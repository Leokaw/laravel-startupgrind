<?php

namespace App\Notifications;

use App\Models\Purchase;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ServicePurchasedNotification extends Notification
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
        $service     = $this->purchase->purchasable;
        $serviceName = $service?->name ?? 'Service';

        $base = [
            'purchase_id'  => $this->purchase->id,
            'service_id'   => $service?->id,
            'service_name' => $serviceName,
            'direction'    => $this->direction,
        ];

        if ($this->direction === 'purchased') {
            $membership    = $this->purchase->buyer->membership;
            $balanceAfter  = $membership?->credits_balance ?? 0;
            $balanceBefore = $balanceAfter + $this->purchase->subtotal;

            return $base + [
                'title'          => 'Service purchased',
                'body'           => "You purchased \"{$serviceName}\" from {$this->purchase->seller->name}.",
                'seller_id'      => $this->purchase->seller_id,
                'seller_name'    => $this->purchase->seller->name,
                'credits_spent'  => $this->purchase->subtotal,
                'balance_before' => $balanceBefore,
                'balance_after'  => $balanceAfter,
            ];
        }

        // 'sold'
        return $base + [
            'title'          => 'Service sold',
            'body'           => "{$this->purchase->buyer->name} purchased \"{$serviceName}\" from you.",
            'buyer_id'       => $this->purchase->buyer_id,
            'buyer_name'     => $this->purchase->buyer->name,
            'credits_earned' => $this->purchase->seller_payout,
        ];
    }
}