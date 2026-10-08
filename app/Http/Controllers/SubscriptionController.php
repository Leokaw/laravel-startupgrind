<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionSuccessToken;
use App\Services\StripePlanResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function checkout(Request $request, StripePlanResolver $resolver): RedirectResponse|\Illuminate\Http\Response
    {
        $validated = $request->validate([
            'plan' => [
                'required',
                'string',
                Rule::in(array_keys(config('subscriptions.plans'))),
            ],
        ]);

        $slug    = $validated['plan'];
        $plan    = config("subscriptions.plans.{$slug}");
        $priceId = $resolver->priceIdFor($slug);

        if (! $priceId) {
            return back()->with(
                'error',
                "The {$plan['name']} plan is free or not yet available on Stripe."
            );
        }

        $user = $request->user();

        // -----------------------------------------------------------------
        // Already subscribed → handle as a deferred plan switch
        // -----------------------------------------------------------------
        if ($user->subscribed('default')) {
            $subscription = $user->subscription('default');

            // Clicking your current plan with a pending switch clears it —
            // that's the "never mind, keep me where I am" path.
            if ($subscription->stripe_price === $priceId) {
                if ($subscription->pending_stripe_price) {
                    $subscription->update(['pending_stripe_price' => null]);

                    return back()->with(
                        'success',
                        "Scheduled switch cancelled — you're staying on {$plan['name']}."
                    );
                }

                return back()->with('success', "You're already on the {$plan['name']} plan.");
            }

            // Schedule the change for the end of the current period.
            $subscription->update(['pending_stripe_price' => $priceId]);

            $effective = $subscription->current_period_end?->format('F j, Y') ?? 'the next billing cycle';

            return back()->with(
                'success',
                "Your plan will switch to {$plan['name']} on {$effective}."
            );
        }

        // -----------------------------------------------------------------
        // First-time subscriber → Stripe Checkout
        // -----------------------------------------------------------------
        $successToken = SubscriptionSuccessToken::create([
            'user_id'    => $user->id,
            'token'      => Str::random(48),
            'plan_slug'  => $slug,
            'status'     => 'pending',
            'expires_at' => now()->addDay(),
        ]);

        $checkout = $user
            ->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('billing.success', ['token' => $successToken->token]),
                'cancel_url'  => route('billing') . '?checkout=cancelled',
                'metadata'    => [
                    'success_token' => $successToken->token,
                    'user_id'       => $user->id,
                    'plan_slug'     => $slug,
                ],
                'subscription_data' => [
                    'metadata' => [
                        'success_token' => $successToken->token,
                        'user_id'       => $user->id,
                        'plan_slug'     => $slug,
                    ],
                ],
            ]);

        return Inertia::location($checkout->url);
    }

    public function cancel(Request $request): RedirectResponse
    {
        $subscription = $request->user()->subscription('default');

        if (! $subscription || ! $subscription->valid()) {
            return back()->with('error', 'You do not have an active subscription.');
        }

        // Cancelling overrides any scheduled plan switch — clearing it here
        // avoids leaving a dangling intent once the sub enters grace period.
        $subscription->update(['pending_stripe_price' => null]);
        $subscription->cancel();

        return back()->with('success', 'Your subscription will end at the close of the current period.');
    }

    public function resume(Request $request): RedirectResponse
    {
        $subscription = $request->user()->subscription('default');

        if (! $subscription || ! $subscription->onGracePeriod()) {
            return back()->with('error', 'There is no cancellation to undo.');
        }

        $subscription->resume();

        return back()->with('success', 'Subscription resumed.');
    }
}