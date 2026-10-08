<?php

namespace App\Enums;

enum MembershipTier: string
{
    case FREE       = 'free';
    case PRO        = 'pro';
    case ENTERPRISE = 'enterprise';

    /**
     * Numeric level — use for sorting, comparisons, "upgrade from X to Y".
     */
    public function level(): int
    {
        return match ($this) {
            self::FREE       => 0,
            self::PRO        => 1,
            self::ENTERPRISE => 2,
        };
    }

    /**
     * Monthly credit grant for this tier.
     */
    public function monthlyCredits(): int
    {
        return match ($this) {
            self::FREE       => 500,
            self::PRO        => 10_000,
            self::ENTERPRISE => 25_000,
        };
    }

    /**
     * Human label for the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::FREE       => 'Free',
            self::PRO        => 'Pro',
            self::ENTERPRISE => 'Enterprise',
        };
    }

    /**
     * Price in HUF (major units — 5000 = 5 000 Ft).
     *
     * Display-only. The real price charged to the user comes from the Stripe
     * Price resolved via `lookup_key` in config/subscriptions.php — never
     * pass this value to `newSubscription()`.
     */
    public function priceInHuf(): int
    {
        return match ($this) {
            self::FREE       => 0,
            self::PRO        => 5_000,
            self::ENTERPRISE => 10_000,
        };
    }

    /**
     * Whether this tier is a paid tier.
     */
    public function isPaid(): bool
    {
        return $this !== self::FREE;
    }

    /**
     * The plan slug in config/subscriptions.php that unlocks this tier.
     *
     * Returns null for FREE — no plan sells it, it's the default state when
     * no subscription is active.
     */
    public function planSlug(): ?string
    {
        return match ($this) {
            self::FREE       => null,
            self::PRO        => 'pro',
            self::ENTERPRISE => 'enterprise',
        };
    }

    /**
     * All tiers sorted ascending by level — useful for upgrade/downgrade logic.
     *
     * @return array<self>
     */
    public static function ordered(): array
    {
        return [self::FREE, self::PRO, self::ENTERPRISE];
    }

    /**
     * All paid tiers, ascending.
     *
     * @return array<self>
     */
    public static function paid(): array
    {
        return array_values(
            array_filter(self::ordered(), fn (self $tier) => $tier->isPaid()),
        );
    }

    /**
     * Value used by <Select> and similar UI primitives.
     *
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $tier) => [$tier->value => $tier->label()])
            ->all();
    }
}