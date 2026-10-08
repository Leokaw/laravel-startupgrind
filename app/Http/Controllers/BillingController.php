<?php

namespace App\Http\Controllers;

use App\Services\StripePlanResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __invoke(Request $request, StripePlanResolver $resolver): Response
    {
        $user         = $request->user();
        $subscription = $user->subscription('default');

        // Only treat the subscription as current when it's actually valid.
        // Cancelled-and-expired subs shouldn't power the "currentPlan" badge.
        $activeSubscription = $subscription && $subscription->valid()
            ? $subscription
            : null;

        $plans = collect(config('subscriptions.plans'))
            ->map(function ($plan, $slug) use ($resolver) {
                // Attach the resolved Stripe price ID so the frontend can
                // distinguish plans if it ever needs to.
                return array_merge($plan, [
                    'slug'            => $slug,
                    'stripe_price_id' => $resolver->priceIdFor($slug),
                ]);
            })
            ->values()
            ->all();

        return Inertia::render('billing/index', [
            'plans' => $plans,

            'currentPlan' => $resolver->planSlugFor(
                $activeSubscription?->stripe_price
            ),

            /*
             |------------------------------------------------------------------
             | Subscription details
             |------------------------------------------------------------------
             |
             | `current_period_start` / `current_period_end` are provided by
             | Cashier's Subscription model as accessors backed by the primary
             | subscription_item row, so they exist even though there's no
             | column of that name on the `subscriptions` table.
             |
             | `ends_at` is only populated after a cancellation — it's the
             | date the paid access runs out.
             |
             | `trial_ends_at` stays null unless the plan is sold with a trial.
             */
            'subscription' => $activeSubscription ? [
                'status'               => $activeSubscription->stripe_status,
                'stripe_price'         => $activeSubscription->stripe_price,
                'current_period_start' => $activeSubscription->current_period_start?->toIso8601String(),
                'current_period_end'   => $activeSubscription->current_period_end?->toIso8601String(),
                'ends_at'              => $activeSubscription->ends_at?->toIso8601String(),
                'trial_ends_at'        => $activeSubscription->trial_ends_at?->toIso8601String(),
                'on_grace_period'      => $activeSubscription->onGracePeriod(),
                'on_trial'             => $activeSubscription->onTrial(),
                'canceled'             => $activeSubscription->canceled(),
            ] : null,

            'flash' => [
                'success'  => session('success'),
                'error'    => session('error'),
                'checkout' => $request->query('checkout'),
            ],
        ]);
    }
}