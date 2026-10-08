<?php

namespace App\Observers;

use App\Enums\MembershipTier;
use App\Models\Membership;
use App\Models\User;

class UserObserver
{
    public function created(User $user): void
    {
        // firstOrCreate is idempotent — safe even if the observer fires
        // more than once for the same user. It checks `user_id` and only
        // inserts when no membership exists yet.
        Membership::firstOrCreate(
            ['user_id' => $user->id],
            [
                'tier'             => MembershipTier::FREE,
                'status'           => Membership::STATUS_ACTIVE,
                'credits_balance'  => MembershipTier::FREE->monthlyCredits(),
                'monthly_credits'  => MembershipTier::FREE->monthlyCredits(),
                'credits_reset_at' => now()->addMonth(),
            ],
        );
    }
}