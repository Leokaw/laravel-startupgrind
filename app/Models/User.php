<?php

namespace App\Models;

use App\Observers\UserObserver;
use App\Support\ServiceCategory;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Cashier\Billable;

#[ObservedBy([UserObserver::class])]
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, Billable;

    public const TYPE_COMPANY    = 'company';
    public const TYPE_USER       = 'user';
    public const TYPE_FREELANCER = 'freelancer';
    public const TYPE_EMPLOYEE   = 'employee';

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected $with = ['membership'];

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'company_id',
        'profile_photo_path',
        'email_verified_at',
        'approved_at',
        // 👇 new
        'description',
        'area_of_work',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'approved_at'       => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /* -----------------------------------------------------------------
     |  Profile
     | ----------------------------------------------------------------- */

    /**
     * Public URL of the user's profile photo, or a generated fallback
     * based on their initials.
     */
    protected function profilePhotoUrl(): Attribute
    {
        return Attribute::get(function () {
            if ($this->profile_photo_path) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('public');

                return $disk->url($this->profile_photo_path);
            }

            return 'https://ui-avatars.com/api/?background=random&name='
                . urlencode($this->name);
        });
    }

    /**
     * Human-readable label for `area_of_work`.
     * Returns null when unset, or the raw key if it's no longer in the
     * ServiceCategory enum (e.g. an old value after a schema change).
     */
    protected function areaOfWorkLabel(): Attribute
    {
        return Attribute::get(function () {
            if (empty($this->area_of_work)) {
                return null;
            }

            return ServiceCategory::label($this->area_of_work)
                ?? $this->area_of_work;
        });
    }

    public function hasCustomProfilePhoto(): bool
    {
        return ! empty($this->profile_photo_path);
    }

    /**
     * True when the user has filled in at least one of the optional
     * "about me" fields. Useful for nudging them to complete onboarding.
     */
    public function hasProfileDetails(): bool
    {
        return ! empty($this->description) || ! empty($this->area_of_work);
    }

    /* -----------------------------------------------------------------
     |  Relationships
     | ----------------------------------------------------------------- */

    public function company(): BelongsTo
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function membership(): HasOne
    {
        return $this->hasOne(Membership::class);
    }

    public function discountTickets(): HasMany
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

    /* -----------------------------------------------------------------
     |  Type helpers
     | ----------------------------------------------------------------- */

    public function canInvite(): bool
    {
        return $this->isCompany() && $this->approved_at !== null;
    }

    public function isCompany(): bool
    {
        return $this->user_type === self::TYPE_COMPANY;
    }

    public function isFreelancer(): bool
    {
        return $this->user_type === self::TYPE_FREELANCER;
    }
}