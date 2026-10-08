<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionSuccessToken extends Model
{
    protected $fillable = [
        'user_id',
        'token',
        'plan_slug',
        'status',
        'stripe_checkout_session_id',
        'stripe_subscription_id',
        'ready_at',
        'completed_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'ready_at'     => 'datetime',
            'completed_at' => 'datetime',
            'expires_at'   => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markReady(?string $checkoutSessionId = null, ?string $subscriptionId = null): void
    {
        if ($this->status !== 'pending') {
            return;
        }

        $this->update([
            'status'                     => 'ready',
            'stripe_checkout_session_id' => $checkoutSessionId ?? $this->stripe_checkout_session_id,
            'stripe_subscription_id'     => $subscriptionId ?? $this->stripe_subscription_id,
            'ready_at'                   => now(),
        ]);
    }

    public function isUsable(): bool
    {
        return $this->expires_at === null || $this->expires_at->isFuture();
    }
}