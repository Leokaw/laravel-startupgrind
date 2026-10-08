<?php

namespace App\Listeners;

use App\Enums\MembershipTier;
use App\Models\SubscriptionSuccessToken;
use App\Models\User;
use Illuminate\Support\Carbon;
use Laravel\Cashier\Events\WebhookReceived;

class ApplySubscriptionFromWebhook
{
    public function handle(WebhookReceived $event): void
    {
        $type = $event->payload['type'] ?? null;

        match ($type) {
            'checkout.session.completed'    => $this->onCheckoutCompleted($event->payload),
            'customer.subscription.created',
            'customer.subscription.updated' => $this->onSubscription($event->payload),
            'invoice.payment_succeeded'     => $this->onInvoicePaid($event->payload),
            default                         => null,
        };
    }

    private function onCheckoutCompleted(array $payload): void
    {
        $token = $payload['data']['object']['metadata']['success_token'] ?? null;

        if ($token) {
            SubscriptionSuccessToken::where('token', $token)->first()?->markReady(
                checkoutSessionId: $payload['data']['object']['id'] ?? null,
                subscriptionId:    $payload['data']['object']['subscription'] ?? null,
            );
        }
    }

    /**
     * Runs when the periodic renewal invoice is paid.
     *
     * This is where a scheduled plan switch (set via `pending_stripe_price`
     * on the local subscription) is executed. `proration_behavior: none`
     * means the user isn't charged anything extra now — the new price takes
     * effect at the next cycle, keeping the switch truly deferred.
     */
    private function onInvoicePaid(array $payload): void
    {
        $invoice = $payload['data']['object'];

        // Only renewals trigger the switch — initial charges and mid-cycle
        // updates shouldn't count as "end of period".
        if (($invoice['billing_reason'] ?? null) !== 'subscription_cycle') {
            return;
        }

        $customerId = $invoice['customer'] ?? null;
        $user       = $customerId ? User::where('stripe_id', $customerId)->first() : null;
        $subscription = $user?->subscription('default');

        if (! $subscription || ! $subscription->pending_stripe_price) {
            return;
        }

        $subscription->swap(
            $subscription->pending_stripe_price,
            ['proration_behavior' => 'none'],
        );

        $subscription->update(['pending_stripe_price' => null]);
    }

    private function onSubscription(array $payload): void
    {
        $subscription = $payload['data']['object'];
        $userId       = $this->userIdFor($subscription['customer'] ?? null);

        if (! $userId) {
            return;
        }

        $user = User::with('membership')->find($userId);
        if (! $user?->membership) {
            return;
        }

        // Record the trial start the first time we see a trial-bearing
        // subscription. `trial_start` is a Unix timestamp from Stripe.
        $cashierSub = $user->subscription('default');
        if ($cashierSub
            && $cashierSub->trial_ends_at !== null
            && $cashierSub->trial_started_at === null
        ) {
            $trialStart = isset($subscription['trial_start'])
                ? Carbon::createFromTimestamp($subscription['trial_start'])
                : now();

            $cashierSub->forceFill(['trial_started_at' => $trialStart])->save();
        }

        $planSlug = $subscription['metadata']['plan_slug'] ?? null;
        $plan     = $planSlug ? config("subscriptions.plans.{$planSlug}") : null;
        $tier     = MembershipTier::tryFrom($plan['membership_tier'] ?? '');

        if (! $plan || ! $tier) {
            return;
        }

        $user->membership->applySubscription(
            tier: $tier,
            externalSubscriptionId: $subscription['id'],
            periodStart: isset($subscription['current_period_start'])
                ? Carbon::createFromTimestamp($subscription['current_period_start'])
                : null,
            periodEnd: isset($subscription['current_period_end'])
                ? Carbon::createFromTimestamp($subscription['current_period_end'])
                : null,
            signupBonusCredits: (int) ($plan['signup_bonus_credits'] ?? 0),
        );

        $token = $subscription['metadata']['success_token'] ?? null;
        if ($token) {
            SubscriptionSuccessToken::where('token', $token)->first()?->markReady(
                subscriptionId: $subscription['id'] ?? null,
            );
        }
    }

    private function userIdFor(?string $stripeCustomerId): int|string|null
    {
        return $stripeCustomerId
            ? User::where('stripe_id', $stripeCustomerId)->value('id')
            : null;
    }
}