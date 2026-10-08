<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Which company this user belongs to (null for company accounts
            // and unaffiliated community members/freelancers).
            $table->uuid('company_id')->nullable()->after('user_type');
            $table->foreign('company_id')
                ->references('id')->on('users')->onDelete('set null');
            $table->index('company_id');

            // Admin approval — only meaningful for company accounts.
            $table->timestamp('approved_at')->nullable()->after('email_verified_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropIndex(['company_id']);
            $table->dropColumn(['company_id', 'approved_at']);
        });
    }
};