<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'               => fake()->name(),
            'email'              => fake()->unique()->safeEmail(),
            'email_verified_at'  => now(),
            'password'           => static::$password ??= Hash::make('password'),
            'remember_token'     => Str::random(10),
            'user_type'          => User::TYPE_USER,
            'company_id'         => null,
            'approved_at'        => null,
            'profile_photo_path' => null,
        ];
    }

    /* -----------------------------------------------------------------
     |  Account-type states
     | ----------------------------------------------------------------- */

    /**
     * An approved company account.
     */
    public function company(): static
    {
        return $this->state(fn () => [
            'user_type'   => User::TYPE_COMPANY,
            'approved_at' => now(),
        ]);
    }

    /**
     * A company account awaiting admin approval.
     */
    public function pendingCompany(): static
    {
        return $this->state(fn () => [
            'user_type'   => User::TYPE_COMPANY,
            'approved_at' => null,
        ]);
    }

    /**
     * A freelancer account.
     */
    public function freelancer(): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_FREELANCER,
            'company_id' => null,
        ]);
    }

    /**
     * A community member (normal user).
     */
    public function community(): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_USER,
            'company_id' => null,
        ]);
    }

    /**
     * An employee belonging to the given company.
     * Verified by default (they've already accepted the invite).
     */
    public function employeeOf(User $company): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_EMPLOYEE,
            'company_id' => $company->id,
        ]);
    }

    /**
     * An employee that has been invited but hasn't accepted yet.
     */
    public function unverifiedEmployeeOf(User $company): static
    {
        return $this->state(fn () => [
            'user_type'         => User::TYPE_EMPLOYEE,
            'company_id'        => $company->id,
            'email_verified_at' => null,
        ]);
    }

    /* -----------------------------------------------------------------
     |  Misc states (kept from the original)
     | ----------------------------------------------------------------- */

    public function unverified(): static
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }

    public function withTwoFactor(): static
    {
        return $this;
    }
}