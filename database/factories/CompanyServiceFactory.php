<?php

namespace Database\Factories;

use App\Models\CompanyService;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CompanyService>
 */
class CompanyServiceFactory extends Factory
{
    protected $model = CompanyService::class;

    /**
     * Mirror of App\Support\ServiceCategory::values().
     * Update this list if your support class changes — otherwise the
     * seeder will generate rows the controller can't validate.
     */
    public const CATEGORIES = [
        'design',
        'development',
        'marketing',
        'consulting',
        'writing',
        'video',
        'other',
    ];

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'name'        => Str::title(fake()->words(rand(2, 4), true)),
            'description' => fake()->paragraph(3),
            'price'       => fake()->randomFloat(2, 20, 500),
            'category'    => fake()->randomElement(self::CATEGORIES),
            // ~85% active — gives your table filters something to bite on.
            'is_active'   => fake()->boolean(85),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function forCategory(string $category): static
    {
        return $this->state(fn () => ['category' => $category]);
    }
}