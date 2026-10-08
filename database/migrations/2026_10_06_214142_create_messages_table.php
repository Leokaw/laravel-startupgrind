<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('sender_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignUuid('receiver_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('topic');
            $table->text('body');

            // Snapshot of the cost — if the price changes later, historical
            // messages still show what was actually charged.
            $table->unsignedInteger('credits_cost');

            // Set when the receiver opens/reads the message.
            $table->timestamp('read_at')->nullable();

            $table->timestamps();

            $table->index(['sender_id', 'created_at']);
            $table->index(['receiver_id', 'created_at']);
            $table->index(['receiver_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};