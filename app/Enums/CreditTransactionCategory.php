<?php

namespace App\Enums;

enum CreditTransactionCategory: string
{
    // Money in (grants, top-ups, rollovers)
    case SUBSCRIPTION_GRANT = 'subscription_grant';
    case TOP_UP_PURCHASE    = 'top_up_purchase';
    case ROLLOVER           = 'rollover';

    // Two-sided: marketplace transactions
    case SERVICE_PURCHASE   = 'service_purchase';   // buyer spends
    case SERVICE_SALE       = 'service_sale';       // seller earns  ← new
    case TICKET_PURCHASE    = 'ticket_purchase';    // buyer spends
    case TICKET_SALE        = 'ticket_sale';        // issuer earns  ← new

    // One-sided: platform fees
    case MESSAGE_SENT       = 'message_sent';       // sender spends, platform keeps

    // Corrections
    case REFUND             = 'refund';
    case ADMIN_ADJUSTMENT   = 'admin_adjustment';

    /**
     * Whether transactions in this category increase the balance.
     */
    public function isCredit(): bool
    {
        return match ($this) {
            self::SUBSCRIPTION_GRANT,
            self::TOP_UP_PURCHASE,
            self::ROLLOVER,
            self::SERVICE_SALE,       // seller is credited
            self::TICKET_SALE,        // issuer is credited
            self::REFUND              => true,

            self::SERVICE_PURCHASE,   // buyer is debited
            self::TICKET_PURCHASE,
            self::MESSAGE_SENT,
            self::ADMIN_ADJUSTMENT    => false,
        };
    }

    /**
     * The matching category on the other side of the transaction,
     * if this category is part of a two-sided purchase.
     */
    public function counterpart(): ?self
    {
        return match ($this) {
            self::SERVICE_PURCHASE => self::SERVICE_SALE,
            self::SERVICE_SALE     => self::SERVICE_PURCHASE,
            self::TICKET_PURCHASE  => self::TICKET_SALE,
            self::TICKET_SALE      => self::TICKET_PURCHASE,
            default                => null,
        };
    }

    public function isMarketplaceTransaction(): bool
    {
        return $this->counterpart() !== null;
    }

    public function label(): string
    {
        return match ($this) {
            self::SUBSCRIPTION_GRANT => 'Subscription grant',
            self::TOP_UP_PURCHASE    => 'Top-up purchase',
            self::ROLLOVER           => 'Rollover',
            self::SERVICE_PURCHASE   => 'Service purchase',
            self::SERVICE_SALE       => 'Service sale',
            self::TICKET_PURCHASE    => 'Ticket purchase',
            self::TICKET_SALE        => 'Ticket sale',
            self::MESSAGE_SENT       => 'Message sent',
            self::REFUND             => 'Refund',
            self::ADMIN_ADJUSTMENT   => 'Admin adjustment',
        };
    }
}