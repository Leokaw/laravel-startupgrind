<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InviteTicket extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'user_id',
        'invited_name',
        'invited_email',
        'temporary_password',
        'status',
        'accepted_by',
        'used_at',
        'expires_at',
        'max_uses',
        'current_uses',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'used_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /** The admin who created this invite. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** The user account created when this invite was redeemed. */
    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isRedeemable(): bool
    {
        return $this->isPending() && $this->is_active && ! $this->isExpired();
    }
}