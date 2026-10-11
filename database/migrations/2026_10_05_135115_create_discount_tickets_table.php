<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('event_url', 2048)->nullable();

            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();

            // Tickets become valid immediately on creation. Only the
            // expiry matters, so we only store `valid_until`.
            $table->dateTime('valid_until');

            $table->integer('usage_limit')->nullable();
            $table->integer('times_used')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discount_tickets');
    }
};