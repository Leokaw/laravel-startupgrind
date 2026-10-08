<?php

namespace Database\Factories;

use App\Enums\MembershipTier;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Membership>
 */
class MembershipFactory extends Factory
{
    protected $model = Membership::class;

    public function definition(): array
    {
        $tier = MembershipTier::FREE;

        return [
            'user_id'          => User::factory(),
            'tier'             => $tier,
            'status'           => Membership::STATUS_ACTIVE,
            'credits_balance'  => $tier->monthlyCredits(),
            'monthly_credits'  => $tier->monthlyCredits(),
            'credits_reset_at' => now()->addMonth(),
            'current_period_start' => now(),
            'current_period_end'   => now()->addMonth(),
            'cancel_at_period_end' => false,
        ];
    }

    /**
     * Set the tier and sync the credits allotment automatically.
     */
    public function tier(MembershipTier $tier): static
    {
        return $this->state(fn () => [
            'tier'            => $tier,
            'monthly_credits' => $tier->monthlyCredits(),
            'credits_balance' => $tier->monthlyCredits(),
        ]);
    }

    public function free(): static
    {
        return $this->tier(MembershipTier::FREE);
    }

  
    public function pro(): static
    {
        return $this->tier(MembershipTier::PRO);
    }

    /**
     * A membership with a specific balance, ignoring the tier default.
     * Useful for testing "what happens when a user has 10 credits left".
     */
    public function withBalance(int $credits): static
    {
        return $this->state(fn () => ['credits_balance' => $credits]);
    }

    public function pastDue(): static
    {
        return $this->state(fn () => ['status' => Membership::STATUS_PAST_DUE]);
    }

    public function canceled(): static
    {
        return $this->state(fn () => [
            'status'      => Membership::STATUS_CANCELED,
            'canceled_at' => now(),
        ]);
    }

    public function trialing(): static
    {
        return $this->state(fn () => [
            'status'        => Membership::STATUS_TRIALING,
            'trial_ends_at' => now()->addDays(14),
        ]);
    }
}