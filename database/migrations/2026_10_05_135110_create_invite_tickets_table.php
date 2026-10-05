<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invite_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();

            // Who created the invite
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete();

            // Who is being invited
            $table->string('invited_name', 50);
            $table->string('invited_email')->unique();

            // Temporary credential
            $table->string('temporary_password');

            // Lifecycle tracking
            $table->string('status')->default('pending'); // pending | accepted | revoked
            $table->foreignUuid('accepted_by')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->dateTime('used_at')->nullable();

            $table->dateTime('expires_at')->nullable();
            $table->integer('max_uses')->default(1);
            $table->integer('current_uses')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invite_tickets');
    }
};