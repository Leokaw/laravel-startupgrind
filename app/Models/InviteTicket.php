<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class InviteTicket extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'user_id',
        'used_at',
        'expires_at',
        'max_uses',
        'current_uses',
        'is_active'
    ];

    protected $dates = [
        'used_at',
        'expires_at',
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}