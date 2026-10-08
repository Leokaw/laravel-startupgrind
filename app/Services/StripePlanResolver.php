<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Laravel\Cashier\Cashier;

class StripePlanResolver
{
    /**
     * Returns the Stripe price ID for a plan slug, or null if the plan is free
     * or the price hasn't been created yet.
     */
    public function priceIdFor(string $planSlug): ?string
    {
        $lookupKey = config("subscriptions.plans.{$planSlug}.lookup_key");

        if (! $lookupKey) {
            return null;
        }

        return Cache::remember(
            "stripe.price_id.{$lookupKey}",
            now()->addHour(),
            function () use ($lookupKey) {
                $prices = Cashier::stripe()->prices->all([
                    'lookup_keys' => [$lookupKey],
                    'active'      => true,
                    'limit'       => 1,
                ]);

                return $prices->data[0]->id ?? null;
            },
        );
    }

    /**
     * Resolve a plan slug from a Stripe price ID.
     * Used by the billing page to show which plan the user is on.
     */
    public function planSlugFor(?string $stripePriceId): ?string
    {
        if (! $stripePriceId) {
            return 'starter';
        }

        foreach (config('subscriptions.plans') as $slug => $plan) {
            if (empty($plan['lookup_key'])) {
                continue;
            }

            if (Cache::get("stripe.price_id.{$plan['lookup_key']}") === $stripePriceId) {
                return $slug;
            }

            // Cold cache — resolve once to warm it.
            if ($this->priceIdFor($slug) === $stripePriceId) {
                return $slug;
            }
        }

        return null;
    }
}