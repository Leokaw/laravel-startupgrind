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

    /**
     * Valid values for the `role` column (onboarding step 2).
     */
    public const ROLES = [
        'founder',
        'investor',
        'operator',
        'freelancer',
        'designer',
        'developer',
    ];

    /**
     * Valid values for the `goal` column (onboarding step 3).
     */
    public const GOALS = [
        'raise',
        'cofounder',
        'hire',
        'network',
        'learn',
        'events',
    ];

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
            // Optional onboarding fields — all null by default. States
            // below fill them.
            'onboarded_at'       => null,
            'role'               => null,
            'goal'               => null,
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
     |  Onboarding states
     | ----------------------------------------------------------------- */

    /**
     * Mark the user as having finished onboarding.
     */
    public function onboarded(): static
    {
        return $this->state(fn () => ['onboarded_at' => now()]);
    }

    /**
     * Set the user's `role` to a specific value. Must be one of ROLES.
     */
    public function withRole(string $role): static
    {
        return $this->state(fn () => ['role' => $role]);
    }

    /**
     * Set the user's `goal` to a specific value. Must be one of GOALS.
     */
    public function withGoal(string $goal): static
    {
        return $this->state(fn () => ['goal' => $goal]);
    }

    /**
     * Set the user's `area_of_work` key. Must be a valid ServiceCategory.
     */
    public function areaOfWork(string $key): static
    {
        return $this->state(fn () => ['area_of_work' => $key]);
    }

    /**
     * Set the user's bio.
     */
    public function withDescription(string $description): static
    {
        return $this->state(fn () => ['description' => $description]);
    }

    /**
     * Fill in every onboarding field with plausible content.
     *
     * - `role` and `goal` are picked from the config arrays above so
     *   they always pass the OnboardingController's `in:` validation.
     * - `area_of_work` is picked from ServiceCategory::all() so it
     *   always passes the same rule.
     * - `onboarded_at` is set so `needsOnboarding()` returns false.
     */
    public function withProfile(): static
    {
        return $this->state(function () {
            $areas = array_keys(ServiceCategory::all());

            return [
                'onboarded_at' => now(),
                'role'         => fake()->randomElement(self::ROLES),
                'goal'         => fake()->randomElement(self::GOALS),
                'description'  => fake()->paragraphs(2, true),
                'area_of_work' => fake()->randomElement($areas),
            ];
        });
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