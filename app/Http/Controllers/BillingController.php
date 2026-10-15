<?php

namespace App\Http\Controllers;

use App\Services\StripePlanResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Checkout;

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

        $pendingSlug = $activeSubscription?->pending_stripe_price
            ? $resolver->planSlugFor($activeSubscription->pending_stripe_price)
            : null;
        $pendingPlan = $pendingSlug
            ? ['slug' => $pendingSlug, 'name' => config("subscriptions.plans.{$pendingSlug}.name")]
            : null;

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

                'has_trial'            => $activeSubscription->trial_ends_at !== null,
                'trial_started_at'     => $trialStartedAt,
                'trial_ends_at'        => $activeSubscription->trial_ends_at?->toIso8601String(),
                'on_trial'             => $activeSubscription->onTrial(),

                'pending_plan'         => $pendingPlan,

                'on_grace_period'      => $activeSubscription->onGracePeriod(),
                'canceled'             => $activeSubscription->canceled(),
            ] : null,

            'flash' => [
                'success'  => session('success'),
                'error'    => session('error'),
                'checkout' => $request->query('checkout'),
                'toast'    => session('toast'), // ← picked up by useFlashToast
            ],
        ]);
    }

    /**
     * Start a new subscription, or schedule a switch for an existing one.
     *
     * Two behaviours:
     *   - No active sub  → redirect to Stripe Checkout.
     *   - Active sub      → set `pending_stripe_price`. The listener
     *                       `ApplySubscriptionFromWebhook::onInvoicePaid`
     *                       performs the swap on the next renewal.
     */
    public function subscribe(Request $request, StripePlanResolver $resolver): RedirectResponse|Checkout
    {
        $request->validate([
            'plan' => ['required', 'in:pro,enterprise'],
        ]);

        $user     = $request->user();
        $planSlug = $request->input('plan');
        $plan     = config("subscriptions.plans.{$planSlug}");
        $priceId  = $resolver->priceIdFor($planSlug);

        abort_if(
            $priceId === null,
            500,
            "Stripe price not configured for plan [{$planSlug}].",
        );

        $subscription = $user->subscription('default');

        // --- Existing subscription: schedule a deferred switch. ---------
        if ($subscription && $subscription->valid()) {
            if ($subscription->stripe_price === $priceId) {
                return back()->with('toast', [
                    'type'    => 'info',
                    'message' => "You're already on {$plan['name']}.",
                ]);
            }

            $subscription->update(['pending_stripe_price' => $priceId]);

            $endsAt = $subscription->current_period_end?->format('M j, Y');

            return back()->with('toast', [
                'type'    => 'success',
                'message' => $endsAt
                    ? "We'll switch you to {$plan['name']} on {$endsAt}."
                    : "We'll switch you to {$plan['name']} at your next billing cycle.",
            ]);
        }

        // --- First-time paid signup: Stripe Checkout. --------------------
        return $user
            ->newSubscription('default', $priceId)
            ->withMetadata([
                'plan_slug' => $planSlug,
            ])
            ->checkout([
                'success_url' => route('billing.index', ['checkout' => 'success']),
                'cancel_url'  => route('billing.index', ['checkout' => 'cancelled']),
            ]);
    }

    /**
     * Cancel at the end of the current billing period.
     */
    public function cancel(Request $request): RedirectResponse
    {
        $subscription = $request->user()->subscription('default');

        if (! $subscription || ! $subscription->valid()) {
            return back()->with('toast', [
                'type'    => 'error',
                'message' => 'No active subscription to cancel.',
            ]);
        }

        if ($subscription->onGracePeriod()) {
            return back()->with('toast', [
                'type'    => 'info',
                'message' => 'Cancellation is already scheduled.',
            ]);
        }

        $subscription->cancel();

        $endsAt = $subscription->ends_at?->format('M j, Y');

        return back()->with('toast', [
            'type'    => 'success',
            'message' => $endsAt
                ? "Subscription cancelled. Access ends {$endsAt}."
                : 'Subscription cancelled.',
        ]);
    }

    /**
     * Undo a scheduled cancellation.
     */
    public function resume(Request $request): RedirectResponse
    {
        $subscription = $request->user()->subscription('default');

        if (! $subscription || ! $subscription->onGracePeriod()) {
            return back()->with('toast', [
                'type'    => 'error',
                'message' => 'Nothing to resume.',
            ]);
        }

        $subscription->resume();

        return back()->with('toast', [
            'type'    => 'success',
            'message' => 'Subscription resumed. Welcome back.',
        ]);
    }
}