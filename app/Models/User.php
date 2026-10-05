<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;   // ← add this
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasUuids;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Discount tickets created by this user.
     */
    public function discountTickets(): HasMany      // ← add this method
    {
        return $this->hasMany(DiscountTicket::class);
    }

    public function inviteTickets(): HasMany
    {
        return $this->hasMany(InviteTicket::class, 'user_id');
    }

    public function invitesAccepted(): HasMany
    {
        return $this->hasMany(InviteTicket::class, 'accepted_by');
    }


    public function companyServices(): HasMany
{
    return $this->hasMany(CompanyService::class);
}
}
