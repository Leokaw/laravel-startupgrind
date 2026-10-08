<?php

namespace App\Http\Controllers;

use App\Services\StripePlanResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __invoke(Request $request, StripePlanResolver $resolver): Response
    {
        $user         = $request->user();
        $subscription = $user->subscription('default');

        $activeSubscription = $subscription && $subscription->valid()
            ? $subscription
            : null;

        $plans = collect(config('subscriptions.plans'))
            ->map(fn ($plan, $slug) => array_merge($plan, [
                'slug'            => $slug,
                'stripe_price_id' => $resolver->priceIdFor($slug),
            ]))
            ->values()
            ->all();

        // Resolve the pending-switch target to a displayable plan so the
        // frontend can say "switches to Enterprise on Nov 8" instead of
        // showing a raw Stripe price ID.
        $pendingSlug = $activeSubscription?->pending_stripe_price
            ? $resolver->planSlugFor($activeSubscription->pending_stripe_price)
            : null;
        $pendingPlan = $pendingSlug
            ? ['slug' => $pendingSlug, 'name' => config("subscriptions.plans.{$pendingSlug}.name")]
            : null;

        // `trial_started_at` is stored as a string since Cashier's model
        // doesn't cast it — we parse explicitly for the JSON payload.
        $trialStartedAt = $activeSubscription?->trial_started_at
            ? Carbon::parse($activeSubscription->trial_started_at)->toIso8601String()
            : null;

        return Inertia::render('billing/index', [
            'plans' => $plans,

            'currentPlan' => $resolver->planSlugFor($activeSubscription?->stripe_price),

            'subscription' => $activeSubscription ? [
                'status'               => $activeSubscription->stripe_status,
                'stripe_price'         => $activeSubscription->stripe_price,
                'current_period_start' => $activeSubscription->current_period_start?->toIso8601String(),
                'current_period_end'   => $activeSubscription->current_period_end?->toIso8601String(),
                'ends_at'              => $activeSubscription->ends_at?->toIso8601String(),

                // Trial information — both `has_trial` and the two dates so
                // the UI can decide whether to render the section at all.
                'has_trial'            => $activeSubscription->trial_ends_at !== null,
                'trial_started_at'     => $trialStartedAt,
                'trial_ends_at'        => $activeSubscription->trial_ends_at?->toIso8601String(),
                'on_trial'             => $activeSubscription->onTrial(),

                // Pending plan switch (deferred to the next billing cycle).
                'pending_plan'         => $pendingPlan,

                'on_grace_period'      => $activeSubscription->onGracePeriod(),
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