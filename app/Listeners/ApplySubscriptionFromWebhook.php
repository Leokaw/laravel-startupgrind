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