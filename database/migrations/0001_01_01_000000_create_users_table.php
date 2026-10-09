<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('profile_photo_path')->nullable();
            $table->string('password');
            $table->string('user_type');
            $table->rememberToken();
            $table->timestamps();

            // 👇 new
            $table->text('description')->nullable();
            // Matches App\Support\ServiceCategory::values() — one of those
            // keys, or null if the user hasn't picked yet.
            $table->string('area_of_work')->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->uuid('user_id');
            $table->string('token');
            $table->timestamp('created_at')->nullable();

            $table->primary(['user_id', 'token']);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};