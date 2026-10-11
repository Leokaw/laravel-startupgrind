<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscountTicket extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'name',
        'description',
        'event_url',
        'discount_percentage',
        'discount_amount',
        'valid_until',
        'usage_limit',
        'times_used',
        'is_active',
    ];

    protected $dates = [
        'valid_until',
        'created_at',
        'updated_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}