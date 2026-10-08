<?php

namespace Database\Seeders;

use App\Models\CompanyService;
use App\Models\DiscountTicket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /* =================================================================
         |  STRIPE PLAN SYNC
         | ================================================================= */

        // Runs the Artisan command that creates/updates Stripe products
        // and prices for the paid plans. Only in local/testing, and only
        // when a secret key is configured. Skip by commenting this block
        // out if you're seeding offline.
        if (app()->environment('local', 'testing') && config('cashier.secret')) {
            $this->command->newLine();
            $this->command->info('Syncing subscription plans to Stripe…');
            Artisan::call('stripe:sync-plans', [], $this->command->getOutput());
        }

        /* =================================================================
         |  FIXED ACCOUNTS
         | ================================================================= */

        $mainCompany = User::factory()->company()->create([
            'name'  => 'Test Company',
            'email' => 'company@example.com',
        ]);
        $mainCompany->membership()->update([
            'tier'            => 'pro',
            'monthly_credits' => 10000,
            'credits_balance' => 10000,
        ]);

        User::factory()->pendingCompany()->create([
            'name'  => 'Pending Company',
            'email' => 'pending@example.com',
        ]);

        $mainFreelancer = User::factory()->freelancer()->create([
            'name'  => 'Test Freelancer',
            'email' => 'freelancer@example.com',
        ]);
        $mainFreelancer->membership()->update([
            'tier'            => 'pro',       // was 'growth'
            'monthly_credits' => 10000,       // was 2500
            'credits_balance' => 10000,       // was 2500
        ]);

        User::factory()->community()->create([
            'name'  => 'Test User',
            'email' => 'user@example.com',
        ]);

        CompanyService::factory()->count(5)->for($mainCompany)->create();
        DiscountTicket::factory()->count(3)->for($mainCompany)->create();

        CompanyService::factory()->count(3)->for($mainFreelancer)->create();
        DiscountTicket::factory()->count(1)->for($mainFreelancer)->create();

        /* =================================================================
         |  BULK COMPANIES
         | ================================================================= */

        User::factory()
            ->company()
            ->count(3)
            ->create()
            ->each(function (User $company) {
                $roll = rand(1, 3);
                if ($roll === 1) {
                    $company->membership()->update([
                        'tier'            => 'pro',
                        'monthly_credits' => 10000,
                        'credits_balance' => 10000,
                    ]);
                }
                // No `elseif` branch — with only three tiers (free/pro/enterprise),
                // a company either gets upgraded to pro (1/3 chance) or stays on
                // the free default from the observer.

                CompanyService::factory()->count(rand(3, 6))->for($company)->create();
                DiscountTicket::factory()->count(rand(1, 3))->for($company)->create();

                User::factory()
                    ->count(rand(2, 4))
                    ->employeeOf($company)
                    ->create();

                User::factory()
                    ->unverifiedEmployeeOf($company)
                    ->create();
            });

        /* =================================================================
         |  PENDING COMPANIES
         | ================================================================= */

        User::factory()->pendingCompany()->count(2)->create();

        /* =================================================================
         |  FREELANCERS
         | ================================================================= */

        User::factory()
            ->freelancer()
            ->count(8)
            ->create()
            ->each(function (User $freelancer) {
                if (fake()->boolean(25)) {
                    $freelancer->membership()->update([
                        'tier'            => 'pro',    // was 'growth'
                        'monthly_credits' => 10000,    // was 2500
                        'credits_balance' => 10000,    // was 2500
                    ]);
                }

                CompanyService::factory()->count(rand(1, 4))->for($freelancer)->create();

                if (fake()->boolean(50)) {
                    DiscountTicket::factory()->count(rand(1, 2))->for($freelancer)->create();
                }
            });

        /* =================================================================
         |  COMMUNITY MEMBERS — all default FREE
         | ================================================================= */

        User::factory()->community()->count(15)->create();
    }
}