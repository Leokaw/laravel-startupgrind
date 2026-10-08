<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Who received the service (bought it, spent credits).
            $table->foreignUuid('buyer_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Who gave the service (created it, earned credits).
            $table->foreignUuid('seller_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // CompanyService, DiscountTicket, etc.
            // uuidMorphs() creates type, id, AND an index on both — no extra
            // index needed below.
            $table->uuidMorphs('purchasable');

            // subtotal = platform_fee + seller_payout
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('platform_fee')->default(0);
            $table->unsignedInteger('seller_payout');

            $table->string('status')->default('pending')->index();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamp('canceled_at')->nullable();

            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['buyer_id', 'created_at']);
            $table->index(['seller_id', 'created_at']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};