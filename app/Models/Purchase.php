<?php

namespace App\Models;

use App\Enums\PurchaseStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Purchase extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'buyer_id',
        'seller_id',
        'purchasable_type',
        'purchasable_id',
        'subtotal',
        'platform_fee',
        'seller_payout',
        'status',
        'completed_at',
        'refunded_at',
        'canceled_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status'         => PurchaseStatus::class,
            'subtotal'       => 'integer',
            'platform_fee'   => 'integer',
            'seller_payout'  => 'integer',
            'completed_at'   => 'datetime',
            'refunded_at'    => 'datetime',
            'canceled_at'    => 'datetime',
            'metadata'       => 'array',
        ];
    }

    /* -----------------------------------------------------------------
     |  Relationships
     | ----------------------------------------------------------------- */

    /**
     * Who received the service — the buyer who spent credits.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Who gave the service — the seller who created it and earned credits.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * The thing that was purchased: a CompanyService, DiscountTicket, etc.
     */
    public function purchasable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Both ledger entries for this order — the buyer's debit and the
     * seller's credit. Ordered so the buyer entry (negative amount)
     * comes first, matching the DB insert order.
     */
    public function creditTransactions(): HasMany
    {
        return $this->hasMany(CreditTransaction::class);
    }

    /**
     * Convenience: fetch only the buyer's ledger entry for this order.
     */
    public function buyerTransaction(): ?CreditTransaction
    {
        return $this->creditTransactions
            ->firstWhere('user_id', $this->buyer_id);
    }

    /**
     * Convenience: fetch only the seller's ledger entry for this order.
     */
    public function sellerTransaction(): ?CreditTransaction
    {
        return $this->creditTransactions
            ->firstWhere('user_id', $this->seller_id);
    }

    /* -----------------------------------------------------------------
     |  State helpers
     | ----------------------------------------------------------------- */

    public function isPending(): bool
    {
        return $this->status === PurchaseStatus::PENDING;
    }

    public function isCompleted(): bool
    {
        return $this->status === PurchaseStatus::COMPLETED;
    }

    public function isRefunded(): bool
    {
        return $this->status === PurchaseStatus::REFUNDED;
    }

    public function isDisputed(): bool
    {
        return $this->status === PurchaseStatus::DISPUTED;
    }

    public function isCanceled(): bool
    {
        return $this->status === PurchaseStatus::CANCELED;
    }

    /**
     * A purchase can be refunded only if it completed and hasn't been
     * refunded or disputed already.
     */
    public function isRefundable(): bool
    {
        return $this->status === PurchaseStatus::COMPLETED;
    }

    /**
     * A purchase that hasn't yet moved credits can be canceled freely.
     */
    public function isCancelable(): bool
    {
        return $this->status === PurchaseStatus::PENDING;
    }

    /* -----------------------------------------------------------------
     |  Scopes — small helpers for common queries
     | ----------------------------------------------------------------- */

    public function scopeCompleted($query)
    {
        return $query->where('status', PurchaseStatus::COMPLETED);
    }

    public function scopeForBuyer($query, User|string $buyer)
    {
        return $query->where('buyer_id', $buyer instanceof User ? $buyer->id : $buyer);
    }

    public function scopeForSeller($query, User|string $seller)
    {
        return $query->where('seller_id', $seller instanceof User ? $seller->id : $seller);
    }
}