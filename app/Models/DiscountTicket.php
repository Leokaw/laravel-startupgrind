<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscountTicket extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_percentage',
        'discount_amount',
        'valid_from',
        'valid_until',
        'usage_limit',
        'times_used',
        'is_active'
    ];

    protected $dates = [
        'valid_from',
        'valid_until',
        'created_at',
        'updated_at'
    ];


    // App\Models\DiscountTicket


public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
}