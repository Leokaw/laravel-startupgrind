<?php

namespace App\Models;

use App\Enums\MembershipTier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class Membership extends Model
{
    use HasFactory, HasUuids;

    /**
     * Lifecycle states. Kept as string constants rather than an enum
     * because billing providers (Stripe, Paddle) send these as strings
     * and matching them 1:1 avoids a translation layer.
     */
    public const STATUS_ACTIVE     = 'active';
    public const STATUS_TRIALING   = 'trialing';
    public const STATUS_PAST_DUE   = 'past_due';
    public const STATUS_CANCELED   = 'canceled';
    public const STATUS_INCOMPLETE = 'incomplete';
    public const STATUS_PAUSED     = 'paused';

    protected $fillable = [
        'user_id',
        'tier',
        'status',
        'credits_balance',
        'monthly_credits',
        'credits_reset_at',
        'bonus_credits_awarded_at',
        'external_customer_id',
        'external_subscription_id',
        'current_period_start',
        'current_period_end',
        'cancel_at_period_end',
        'trial_ends_at',
        'canceled_at',
    ];

    protected function casts(): array
    {
        return [
            'tier'                     => MembershipTier::class,
            'credits_balance'          => 'integer',
            'monthly_credits'          => 'integer',
            'credits_reset_at'         => 'datetime',
            'bonus_credits_awarded_at' => 'datetime',
            'current_period_start'     => 'datetime',
            'current_period_end'       => 'datetime',
            'cancel_at_period_end'     => 'boolean',
            'trial_ends_at'            => 'datetime',
            'canceled_at'              => 'datetime',
        ];
    }

    /* -----------------------------------------------------------------
     |  Relationships
     | ----------------------------------------------------------------- */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Every ledger entry for this membership, newest first.
     */
    public function creditTransactions(): HasMany
    {
        return $this->hasMany(CreditTransaction::class)->latest();
    }

    /**
     * All marketplace purchases made while on this membership.
     * Goes through the user — purchases are owned by users, not memberships,
     * but this makes "what did I buy as a Pro member?" trivial.
     */
    public function purchases(): HasManyThrough
    {
        return $this->hasManyThrough(
            Purchase::class,
            User::class,
            'id',            // users.id (FK on memberships.user_id → users.id)
            'buyer_id',      // purchases.buyer_id
            'user_id',       // memberships.user_id (local key)
            'id',            // users.id (local key on users)
        );
    }

    public function sales(): HasManyThrough
    {
        return $this->hasManyThrough(
            Purchase::class,
            User::class,
            'id',
            'seller_id',
            'user_id',
            'id',
        );
    }

    /* -----------------------------------------------------------------
     |  Tier helpers
     | ----------------------------------------------------------------- */

    public function isFree(): bool
    {
        return $this->tier === MembershipTier::FREE;
    }

  

    public function isPro(): bool
    {
        return $this->tier === MembershipTier::PRO;
    }

    /**
     * True when this membership is at or above the given tier.
     * Use for feature gating: `if ($membership->isAtLeast(MembershipTier::GROWTH)) { ... }`
     */
    public function isAtLeast(MembershipTier $tier): bool
    {
        return $this->tier->level() >= $tier->level();
    }

    /**
     * Compare to another tier. Returns -1 (lower), 0 (same), or 1 (higher).
     */
    public function compareTo(MembershipTier $tier): int
    {
        return $this->tier->level() <=> $tier->level();
    }

    /* -----------------------------------------------------------------
     |  Status helpers
     | ----------------------------------------------------------------- */

    public function isActive(): bool
    {
        return in_array($this->status, [
            self::STATUS_ACTIVE,
            self::STATUS_TRIALING,
        ], true);
    }

    public function isTrialing(): bool
    {
        return $this->status === self::STATUS_TRIALING
            && $this->trial_ends_at?->isFuture();
    }

    public function isPastDue(): bool
    {
        return $this->status === self::STATUS_PAST_DUE;
    }

    public function isCanceled(): bool
    {
        return $this->status === self::STATUS_CANCELED
            || $this->canceled_at !== null;
    }

    /**
     * True when the current paid period has elapsed and no renewal is due.
     * Typically set by the billing webhook, not computed on the fly.
     */
    public function hasEnded(): bool
    {
        return $this->current_period_end !== null
            && $this->current_period_end->isPast();
    }

    public function isCancelingAtPeriodEnd(): bool
    {
        return $this->cancel_at_period_end && ! $this->hasEnded();
    }

    /* -----------------------------------------------------------------
     |  Credit helpers
     | ----------------------------------------------------------------- */



    /**
     * Apply the effects of a new Stripe subscription:
     *  - upgrade the tier
     *  - refresh monthly_credits
     *  - sync the billing period from Stripe
     *  - grant the one-time signup bonus, if it hasn't been granted before
     *
     * Idempotent: safe to call twice for the same $externalSubscriptionId.
     */
    public function applySubscription(
        MembershipTier $tier,
        string $externalSubscriptionId,
        ?Carbon $periodStart = null,
        ?Carbon $periodEnd = null,
        int $signupBonusCredits = 0,
    ): void {
        // Already applied for this exact subscription — nothing to do.
        if ($this->external_subscription_id === $externalSubscriptionId) {
            return;
        }

        DB::transaction(function () use (
            $tier,
            $externalSubscriptionId,
            $periodStart,
            $periodEnd,
            $signupBonusCredits,
        ) {
        // Re-fetch under lock so concurrent webhook deliveries can't race
        // each other across the bonus check.
            /** @var self $fresh */
            $fresh = self::query()->lockForUpdate()->find($this->id);

            $fresh->update([
                'tier'                     => $tier,
                'status'                   => self::STATUS_ACTIVE,
                'monthly_credits'          => $tier->monthlyCredits(),
                'external_subscription_id' => $externalSubscriptionId,
                'current_period_start'     => $periodStart ?? $fresh->current_period_start,
                'current_period_end'       => $periodEnd ?? $fresh->current_period_end,
                'credits_reset_at'         => $periodEnd ?? now()->addMonth(),
                'cancel_at_period_end'     => false,
                'canceled_at'              => null,
            ]);

            // One-time bonus — never more than once per membership lifetime.
            if ($signupBonusCredits > 0 && $fresh->bonus_credits_awarded_at === null) {
                $fresh->increment('credits_balance', $signupBonusCredits);
                $fresh->update(['bonus_credits_awarded_at' => now()]);
            }

            // Keep the in-memory instance in sync with the DB.
            $this->setRawAttributes($fresh->getAttributes(), true);
        });
    }

    public function hasCredits(int $amount = 1): bool
    {
        return $this->credits_balance >= $amount;
    }

    public function isOutOfCredits(): bool
    {
        return $this->credits_balance <= 0;
    }

    /**
     * True when credits are due to be topped up. Used by the
     * ResetMonthlyCredits scheduled job.
     */
    public function isDueForCreditReset(): bool
    {
        return $this->credits_reset_at !== null
            && $this->credits_reset_at->isPast()
            && $this->isActive();
    }

    /**
     * Days until the next credit refresh, or null if not scheduled.
     */
    public function daysUntilReset(): ?int
    {
        if ($this->credits_reset_at === null) {
            return null;
        }

        return max(0, (int) now()->diffInDays($this->credits_reset_at, false));
    }

    /**
     * Next reset date, or null if not scheduled.
     */
    public function nextResetDate(): ?Carbon
    {
        return $this->credits_reset_at;
    }

    /* -----------------------------------------------------------------
     |  Scopes
     | ----------------------------------------------------------------- */

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            self::STATUS_ACTIVE,
            self::STATUS_TRIALING,
        ]);
    }

    public function scopeOfTier(Builder $query, MembershipTier $tier): Builder
    {
        return $query->where('tier', $tier->value);
    }

    public function scopeDueForCreditReset(Builder $query): Builder
    {
        return $query
            ->whereNotNull('credits_reset_at')
            ->where('credits_reset_at', '<=', now())
            ->whereIn('status', [
                self::STATUS_ACTIVE,
                self::STATUS_TRIALING,
            ]);
    }

    public function scopeTrialing(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_TRIALING);
    }

    public function scopeCanceled(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CANCELED);
    }
}
