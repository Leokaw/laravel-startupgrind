<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('membership_id')
                ->constrained('memberships')
                ->cascadeOnDelete();

            // Denormalized copy of memberships.user_id — saves a join on
            // the hot path ("show me this user's recent ledger entries").
            $table->foreignUuid('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Links a ledger entry to the order that caused it.
            // Nullable for one-sided events: grants, message fees,
            // admin adjustments.
            $table->foreignUuid('purchase_id')
                ->nullable()
                ->constrained('purchases')
                ->nullOnDelete();

            // Signed: positive = credit in, negative = credit out.
            $table->integer('amount');

            // Snapshot of balance AFTER this entry. Lets you reconstruct
            // any point in time without replaying the ledger.
            $table->integer('balance_after');

            // Enum values: service_purchase, service_sale, subscription_grant, etc.
            $table->string('category')->index();
            $table->string('description')->nullable();

            // Polymorphic link to the thing that was bought/sold.
            // nullableUuidMorphs() creates type, id, AND an index on both.
            $table->nullableUuidMorphs('reference');

            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['membership_id', 'created_at']);
            $table->index(['purchase_id', 'user_id']);   // both sides of one order
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
    }
};