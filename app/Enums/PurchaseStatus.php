<?php

namespace App\Enums;

enum PurchaseStatus: string
{
    case PENDING    = 'pending';     // created, credits not yet moved
    case COMPLETED  = 'completed';   // credits moved buyer → seller
    case REFUNDED   = 'refunded';    // credits reversed
    case DISPUTED   = 'disputed';    // frozen for investigation
    case CANCELED   = 'canceled';    // abandoned before completion

    public function label(): string
    {
        return match ($this) {
            self::PENDING   => 'Pending',
            self::COMPLETED => 'Completed',
            self::REFUNDED  => 'Refunded',
            self::DISPUTED  => 'Disputed',
            self::CANCELED  => 'Canceled',
        };
    }
}