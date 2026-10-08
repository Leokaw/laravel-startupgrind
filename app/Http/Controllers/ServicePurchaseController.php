<?php

namespace App\Http\Controllers;

use App\Enums\CreditTransactionCategory;
use App\Enums\PurchaseStatus;
use App\Exceptions\InsufficientCreditsException;
use App\Models\CompanyService;
use App\Models\Purchase;
use App\Notifications\ServicePurchasedNotification;
use App\Services\CreditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServicePurchaseController extends Controller
{
    /**
     * Fixed purchase price for now — matches PurchaseServiceForm::serviceCost.
     */
    public const SERVICE_COST = 100;

    public function __construct(
        protected CreditService $credits,
    ) {}

    public function store(Request $request, CompanyService $service): RedirectResponse
    {
        $buyer  = $request->user();
        $seller = $service->user;

        abort_if($buyer->id === $seller->id, 422, 'You cannot purchase your own service.');
        abort_if(! $service->is_active, 422, 'This service is not available.');

        $membership = $buyer->membership;
        abort_if($membership === null, 422, 'No active membership.');

        $sellerMembership = $seller->membership;
        abort_if($sellerMembership === null, 422, 'Seller has no active membership.');

        $amount = self::SERVICE_COST;

        try {
            /** @var Purchase $purchase */
            $purchase = DB::transaction(function () use (
                $buyer, $seller, $service, $amount,
                $membership, $sellerMembership,
            ) {
                $purchase = Purchase::create([
                    'buyer_id'         => $buyer->id,
                    'seller_id'        => $seller->id,
                    'purchasable_type' => CompanyService::class,
                    'purchasable_id'   => $service->id,
                    'subtotal'         => $amount,
                    'platform_fee'     => 0,
                    'seller_payout'    => $amount,
                    'status'           => PurchaseStatus::PENDING,
                ]);

                // Debit the buyer.
                $this->credits->spend(
                    membership:  $membership,
                    amount:      $amount,
                    category:    CreditTransactionCategory::SERVICE_PURCHASE,
                    description: "Purchased \"{$service->name}\" from {$seller->name}",
                    reference:   $service,
                    purchase:    $purchase,
                );

                // Credit the seller with the full amount.
                $this->credits->grant(
                    membership:  $sellerMembership,
                    amount:      $amount,
                    category:    CreditTransactionCategory::SERVICE_SALE,
                    description: "Sold \"{$service->name}\" to {$buyer->name}",
                    reference:   $service,
                    purchase:    $purchase,
                );

                $purchase->update([
                    'status'       => PurchaseStatus::COMPLETED,
                    'completed_at' => now(),
                ]);

                return $purchase;
            });
        } catch (InsufficientCreditsException $e) {
            return back()->with(
                'error',
                "Not enough credits — this service costs {$e->required}, you have {$e->available}.",
            );
        }

        // Fire notifications AFTER the transaction commits.
        $purchase->load(['buyer', 'seller']);
        $buyer->notify(new ServicePurchasedNotification($purchase, 'purchased'));
        $seller->notify(new ServicePurchasedNotification($purchase, 'sold'));

        return back()->with(
            'success',
            "Purchased \"{$service->name}\" from {$seller->name}.",
        );
    }
}