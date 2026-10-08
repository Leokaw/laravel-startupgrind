<?php

namespace App\Http\Controllers;

use App\Enums\CreditTransactionCategory;
use App\Enums\PurchaseStatus;
use App\Exceptions\InsufficientCreditsException;
use App\Models\DiscountTicket;
use App\Models\Purchase;
use App\Notifications\TicketPurchasedNotification;
use App\Services\CreditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketPurchaseController extends Controller
{
    /**
     * Fixed purchase price for a ticket — matches PurchaseTicketForm::ticketCost.
     */
    public const TICKET_COST = 50;

    public function __construct(
        protected CreditService $credits,
    ) {}

    public function store(Request $request, DiscountTicket $ticket): RedirectResponse
    {
        $buyer  = $request->user();
        $seller = $ticket->user;

        abort_if($buyer->id === $seller->id, 422, 'You cannot purchase your own ticket.');
        abort_if(! $ticket->is_active, 422, 'This ticket is not available.');

        // Guard against expired / not-yet-valid tickets.
        $now = now();
        abort_if($ticket->valid_from && $now->lt($ticket->valid_from), 422, 'This ticket is not valid yet.');
        abort_if($ticket->valid_until && $now->gt($ticket->valid_until), 422, 'This ticket has expired.');

        // If there's a usage limit, enforce it.
        if ($ticket->usage_limit !== null && $ticket->times_used >= $ticket->usage_limit) {
            abort(422, 'This ticket has reached its usage limit.');
        }

        $membership = $buyer->membership;
        abort_if($membership === null, 422, 'No active membership.');

        $sellerMembership = $seller->membership;
        abort_if($sellerMembership === null, 422, 'Seller has no active membership.');

        $amount = self::TICKET_COST;

        try {
            /** @var Purchase $purchase */
            $purchase = DB::transaction(function () use (
                $buyer, $seller, $ticket, $amount,
                $membership, $sellerMembership,
            ) {
                $purchase = Purchase::create([
                    'buyer_id'         => $buyer->id,
                    'seller_id'        => $seller->id,
                    'purchasable_type' => DiscountTicket::class,
                    'purchasable_id'   => $ticket->id,
                    'subtotal'         => $amount,
                    'platform_fee'     => 0,
                    'seller_payout'    => $amount,
                    'status'           => PurchaseStatus::PENDING,
                ]);

                // Debit the buyer.
                $this->credits->spend(
                    membership:  $membership,
                    amount:      $amount,
                    category:    CreditTransactionCategory::TICKET_PURCHASE,
                    description: "Purchased ticket \"{$ticket->name}\" from {$seller->name}",
                    reference:   $ticket,
                    purchase:    $purchase,
                );

                // Credit the seller with the full amount.
                $this->credits->grant(
                    membership:  $sellerMembership,
                    amount:      $amount,
                    category:    CreditTransactionCategory::TICKET_SALE,
                    description: "Sold ticket \"{$ticket->name}\" to {$buyer->name}",
                    reference:   $ticket,
                    purchase:    $purchase,
                );

                // Increment usage counter on the ticket itself.
                $ticket->increment('times_used');

                $purchase->update([
                    'status'       => PurchaseStatus::COMPLETED,
                    'completed_at' => now(),
                ]);

                return $purchase;
            });
        } catch (InsufficientCreditsException $e) {
            return back()->with(
                'error',
                "Not enough credits — this ticket costs {$e->required}, you have {$e->available}.",
            );
        }

        // Fire notifications AFTER the transaction commits.
        $purchase->load(['buyer', 'seller']);
        $buyer->notify(new TicketPurchasedNotification($purchase, 'purchased'));
        $seller->notify(new TicketPurchasedNotification($purchase, 'sold'));

        return back()->with(
            'success',
            "Purchased \"{$ticket->name}\" from {$seller->name}.",
        );
    }
}