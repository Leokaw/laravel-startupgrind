<?php

namespace Database\Factories;

use App\Models\DiscountTicket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<DiscountTicket>
 */
class DiscountTicketFactory extends Factory
{
    protected $model = DiscountTicket::class;

    public function definition(): array
    {
        // A ticket is either percentage-based OR amount-based — never both.
        $isPercentage = fake()->boolean(70);

        return [
            'user_id'             => User::factory(),
            'code'                => 'DISC-' . strtoupper(Str::random(8)),
            'name'                => Str::title(fake()->words(rand(2, 4), true)),
            'description'         => fake()->sentence(rand(8, 15)),
            'discount_percentage' => $isPercentage
                ? fake()->randomFloat(2, 5, 50)
                : null,
            'discount_amount'     => $isPercentage
                ? null
                : fake()->randomFloat(2, 5, 100),
            'valid_from'          => now(),
            'valid_until'         => now()->addDays(rand(7, 90)),
            // ~70% have a usage cap; the rest are unlimited.
            'usage_limit'         => fake()->boolean(70) ? rand(10, 500) : null,
            'times_used'          => 0,
            'is_active'           => fake()->boolean(90),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'valid_from'  => now()->subDays(60),
            'valid_until' => now()->subDays(30),
            'is_active'   => false,
        ]);
    }

    public function percentage(float $percent): static
    {
        return $this->state(fn () => [
            'discount_percentage' => $percent,
            'discount_amount'     => null,
        ]);
    }

    public function amount(float $amount): static
    {
        return $this->state(fn () => [
            'discount_amount'     => $amount,
            'discount_percentage' => null,
        ]);
    }

    public function exhausted(): static
    {
        return $this->state(fn () => [
            'times_used' => 10,
            'usage_limit' => 10,
            'is_active'   => false,
        ]);
    }
}