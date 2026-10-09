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

        if (app()->environment('local', 'testing') && config('cashier.secret')) {
            $this->command->newLine();
            $this->command->info('Syncing subscription plans to Stripe…');
            Artisan::call('stripe:sync-plans', [], $this->command->getOutput());
        }

        /* =================================================================
         |  FIXED ACCOUNTS
         | ================================================================= */

        $mainCompany = User::factory()
            ->company()
            ->withDescription(
                'We build internal tools and data pipelines for fast-growing SaaS teams. '
                . 'Our team of six ships end-to-end: discovery, design, implementation, and ongoing support.'
            )
            ->areaOfWork('development')
            ->create([
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

        $mainFreelancer = User::factory()
            ->freelancer()
            ->withDescription(
                'Freelance product designer with eight years of experience across fintech and healthcare. '
                . 'I help early-stage teams go from rough idea to shipped product — research, UX, and UI.'
            )
            ->areaOfWork('design')
            ->create([
                'name'  => 'Test Freelancer',
                'email' => 'freelancer@example.com',
            ]);
        $mainFreelancer->membership()->update([
            'tier'            => 'pro',
            'monthly_credits' => 10000,
            'credits_balance' => 10000,
        ]);

        User::factory()
            ->community()
            ->withDescription(
                'Founder-curious operator. Currently exploring the AI tooling space. '
                . 'Happy to chat about go-to-market, hiring, or anything founder-adjacent.'
            )
            ->areaOfWork('consulting')
            ->create([
                'name'  => 'Test User',
                'email' => 'user@example.com',
            ]);

        CompanyService::factory()->count(5)->for($mainCompany)->create();
        DiscountTicket::factory()->count(3)->for($mainCompany)->create();

        CompanyService::factory()->count(3)->for($mainFreelancer)->create();
        DiscountTicket::factory()->count(1)->for($mainFreelancer)->create();

        // Main test company gets a bigger team so the modal's Team tab
        // has plenty of rows to scroll through.
        $this->seedTeamFor($mainCompany, verified: 6, pending: 3);

        /* =================================================================
         |  BULK COMPANIES
         | ================================================================= */

        User::factory()
            ->company()
            ->withProfile()
            ->count(3)
            ->create()
            ->each(function (User $company) {
                if (rand(1, 3) === 1) {
                    $company->membership()->update([
                        'tier'            => 'pro',
                        'monthly_credits' => 10000,
                        'credits_balance' => 10000,
                    ]);
                }

                CompanyService::factory()->count(rand(3, 6))->for($company)->create();
                DiscountTicket::factory()->count(rand(1, 3))->for($company)->create();

                $this->seedTeamFor(
                    $company,
                    verified: rand(3, 5),
                    pending: rand(1, 3),
                );
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
            ->withProfile()
            ->count(8)
            ->create()
            ->each(function (User $freelancer) {
                if (fake()->boolean(25)) {
                    $freelancer->membership()->update([
                        'tier'            => 'pro',
                        'monthly_credits' => 10000,
                        'credits_balance' => 10000,
                    ]);
                }

                CompanyService::factory()->count(rand(1, 4))->for($freelancer)->create();

                if (fake()->boolean(50)) {
                    DiscountTicket::factory()->count(rand(1, 2))->for($freelancer)->create();
                }
            });

        /* =================================================================
         |  COMMUNITY MEMBERS
         | ================================================================= */

        // Most community members get a profile, but a few stay blank so
        // you can see how the UI renders the "no bio yet" state.
        User::factory()
            ->community()
            ->withProfile()
            ->count(12)
            ->create();

        User::factory()
            ->community()
            ->count(3)
            ->create();
    }

    /**
     * Populate a company with a mixed team of employees.
     *
     * Verified employees get a filled-in profile (they've been around
     * and set things up). Pending employees stay blank — they haven't
     * accepted the invite yet, so their profile is empty until they do.
     */
    private function seedTeamFor(User $company, int $verified = 4, int $pending = 2): void
    {
        User::factory()
            ->count($verified)
            ->employeeOf($company)
            ->withProfile()
            ->create();

        User::factory()
            ->count($pending)
            ->pendingEmployeeOf($company)
            ->create();
    }
}