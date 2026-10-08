<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('tier')->default('free')->index();
            $table->string('status')->default('active')->index();

            $table->integer('credits_balance')->default(0);
            $table->unsignedInteger('monthly_credits')->default(500);
            $table->timestamp('credits_reset_at')->nullable();

            //  new: set the moment the subscription signup bonus is granted.
            // Null means "no signup bonus has been awarded yet"; non-null
            // means "never award another one" (prevents double-crediting on
            // webhook retries and on cancel/resubscribe).
            $table->timestamp('bonus_credits_awarded_at')->nullable();

            $table->string('external_customer_id')->nullable()->index();
            $table->string('external_subscription_id')->nullable()->index();
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->boolean('cancel_at_period_end')->default(false);
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('canceled_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};