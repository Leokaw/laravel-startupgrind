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

        // Existing subscription → swap price in place, no new checkout.
        if ($user->subscribed('default')) {
            $user->subscription('default')->swap($priceId);

            return back()->with('success', "Switched to the {$plan['name']} plan.");
        }

        // Mint a one-shot token the webhook and success page will share.
        $successToken = SubscriptionSuccessToken::create([
            'user_id'    => $user->id,
            'token'      => Str::random(48),
            'plan_slug'  => $slug,
            'status'     => 'pending',
            'expires_at' => now()->addDay(),
        ]);

        // First-time → Stripe Checkout.
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