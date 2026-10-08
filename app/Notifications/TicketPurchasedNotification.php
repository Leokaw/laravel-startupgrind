<?php

namespace App\Notifications;

use App\Models\Purchase;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TicketPurchasedNotification extends Notification
{
    use Queueable;

    /**
     * @param  'purchased'|'sold'  $direction
     */
    public function __construct(
        public Purchase $purchase,
        public string $direction,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $ticket     = $this->purchase->purchasable;
        $ticketName = $ticket?->name ?? 'Ticket';

        $base = [
            'purchase_id'  => $this->purchase->id,
            'ticket_id'    => $ticket?->id,
            'ticket_name'  => $ticketName,
            'direction'    => $this->direction,
        ];

        if ($this->direction === 'purchased') {
            $membership    = $this->purchase->buyer->membership;
            $balanceAfter  = $membership?->credits_balance ?? 0;
            $balanceBefore = $balanceAfter + $this->purchase->subtotal;

            return $base + [
                'title'          => 'Ticket purchased',
                'body'           => "You purchased \"{$ticketName}\" from {$this->purchase->seller->name}.",
                'seller_id'      => $this->purchase->seller_id,
                'seller_name'    => $this->purchase->seller->name,
                'credits_spent'  => $this->purchase->subtotal,
                'balance_before' => $balanceBefore,
                'balance_after'  => $balanceAfter,
            ];
        }

        // 'sold'
        return $base + [
            'title'          => 'Ticket sold',
            'body'           => "{$this->purchase->buyer->name} purchased \"{$ticketName}\" from you.",
            'buyer_id'       => $this->purchase->buyer_id,
            'buyer_name'     => $this->purchase->buyer->name,
            'credits_earned' => $this->purchase->seller_payout,
        ];
    }
}