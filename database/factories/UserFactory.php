<?php

namespace Database\Factories;

use App\Models\User;
use App\Support\ServiceCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

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
            // Both optional and null by default — states below fill them.
            'description'        => null,
            'area_of_work'       => null,
        ];
    }

    /* -----------------------------------------------------------------
     |  Account-type states
     | ----------------------------------------------------------------- */

    public function company(): static
    {
        return $this->state(fn () => [
            'user_type'   => User::TYPE_COMPANY,
            'approved_at' => now(),
        ]);
    }

    public function pendingCompany(): static
    {
        return $this->state(fn () => [
            'user_type'   => User::TYPE_COMPANY,
            'approved_at' => null,
        ]);
    }

    public function freelancer(): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_FREELANCER,
            'company_id' => null,
        ]);
    }

    public function community(): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_USER,
            'company_id' => null,
        ]);
    }

    /* -----------------------------------------------------------------
     |  Employee states
     | ----------------------------------------------------------------- */

    public function employee(): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_EMPLOYEE,
            'company_id' => null,
        ]);
    }

    public function employeeOf(User $company): static
    {
        return $this->state(fn () => [
            'user_type'  => User::TYPE_EMPLOYEE,
            'company_id' => $company->id,
        ]);
    }

    public function unverifiedEmployeeOf(User $company): static
    {
        return $this->pendingEmployeeOf($company);
    }

    public function pendingEmployeeOf(User $company): static
    {
        return $this->state(fn () => [
            'user_type'         => User::TYPE_EMPLOYEE,
            'company_id'        => $company->id,
            'email_verified_at' => null,
        ]);
    }

    /* -----------------------------------------------------------------
     |  Profile-detail states
     | ----------------------------------------------------------------- */

    /**
     * Populate both optional profile fields with plausible content.
     * Area of work is picked from the same enum the profile form uses,
     * so generated data always passes `ProfileUpdateRequest::rules()`.
     */
    public function withProfile(): static
    {
        return $this->state(function () {
            $areas = array_keys(ServiceCategory::all());

            return [
                'description'  => fake()->paragraphs(2, true),
                'area_of_work' => fake()->randomElement($areas),
            ];
        });
    }

    /**
     * Set a specific area-of-work key (must be a valid ServiceCategory).
     */
    public function areaOfWork(string $key): static
    {
        return $this->state(fn () => ['area_of_work' => $key]);
    }

    /**
     * Set a specific bio.
     */
    public function withDescription(string $description): static
    {
        return $this->state(fn () => ['description' => $description]);
    }

    /* -----------------------------------------------------------------
     |  Misc
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