<?php

namespace App\Models;

use App\Enums\CreditTransactionCategory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CreditTransaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'membership_id',
        'user_id',
        'purchase_id',
        'amount',
        'balance_after',
        'category',
        'description',
        'reference_type',
        'reference_id',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'amount'        => 'integer',
            'balance_after' => 'integer',
            'category'      => CreditTransactionCategory::class,
            'metadata'      => 'array',
        ];
    }

    /* -----------------------------------------------------------------
     |  Relationships
     | ----------------------------------------------------------------- */

    /**
     * The membership this entry belongs to. Every transaction is scoped
     * to exactly one membership — the ledger is per-membership, not
     * per-user, so upgrades/downgrades don't confuse history.
     */
    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class);
    }

    /**
     * Denormalized user_id — mirrors membership.user_id. Kept for fast
     * "this user's history" queries without a join.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The purchase that caused this entry, if any. Null for grants,
     * message fees, admin adjustments.
     */
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    /**
     * The thing that was bought or sold: CompanyService, DiscountTicket,
     * etc. Nullable because grants and adjustments have no referent.
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    /* -----------------------------------------------------------------
     |  Direction helpers
     | ----------------------------------------------------------------- */

    /**
     * True when this entry adds credits to the balance.
     * Checks BOTH the sign of amount and the category — catches data
     * bugs where someone writes a positive SERVICE_PURCHASE by accident.
     */
    public function isCredit(): bool
    {
        return $this->amount > 0 && $this->category->isCredit();
    }

    /**
     * True when this entry removes credits from the balance.
     */
    public function isDebit(): bool
    {
        return $this->amount < 0 && ! $this->category->isCredit();
    }

    /**
     * True when this entry is one side of a two-sided marketplace
     * purchase (service or ticket). Grants and admin adjustments
     * return false.
     */
    public function isMarketplaceEntry(): bool
    {
        return $this->category->isMarketplaceTransaction()
            && $this->purchase_id !== null;
    }

    /**
     * The opposite entry for the same purchase — the buyer's debit if
     * this is the seller's credit, or vice versa.
     */
    public function counterpartTransaction(): ?self
    {
        if (! $this->isMarketplaceEntry()) {
            return null;
        }

        return self::query()
            ->where('purchase_id', $this->purchase_id)
            ->where('id', '!=', $this->id)
            ->first();
    }

    /**
     * Signed, human-readable amount. Examples:
     *   +250  → "+250"
     *   -100  → "−100"
     */
    public function signedAmount(): string
    {
        return ($this->amount >= 0 ? '+' : '−') . abs($this->amount);
    }

    /* -----------------------------------------------------------------
     |  Scopes — common queries
     | ----------------------------------------------------------------- */

    public function scopeCredits($query)
    {
        return $query->where('amount', '>', 0);
    }

    public function scopeDebits($query)
    {
        return $query->where('amount', '<', 0);
    }

    public function scopeOfCategory($query, CreditTransactionCategory $category)
    {
        return $query->where('category', $category->value);
    }

    public function scopeForUser($query, User|string $user)
    {
        return $query->where(
            'user_id',
            $user instanceof User ? $user->id : $user,
        );
    }

    public function scopeForPurchase($query, Purchase|string $purchase)
    {
        return $query->where(
            'purchase_id',
            $purchase instanceof Purchase ? $purchase->id : $purchase,
        );
    }

    public function scopeBetween($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }
}