<?php

namespace App\Http\Controllers;

use App\Enums\CreditTransactionCategory;
use App\Exceptions\InsufficientCreditsException;
use App\Models\Message;
use App\Models\User;
use App\Notifications\MessageNotification;
use App\Services\CreditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public const MESSAGE_COST = 50;

    public function __construct(
        protected CreditService $credits,
    ) {}

    public function store(Request $request, User $receiver): RedirectResponse
    {
        $validated = $request->validate([
            'topic'   => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $sender = $request->user();

        abort_if($sender->id === $receiver->id, 422, 'You cannot message yourself.');

        // The sender must have a membership.
        $membership = $sender->membership;
        abort_if($membership === null, 422, 'No active membership.');

        try {
            /** @var Message $message */
            $message = DB::transaction(function () use ($sender, $receiver, $validated, $membership) {
                $message = Message::create([
                    'sender_id'    => $sender->id,
                    'receiver_id'  => $receiver->id,
                    'topic'        => $validated['topic'],
                    'body'         => $validated['message'],
                    'credits_cost' => self::MESSAGE_COST,
                ]);

                // Debit the sender. This is the atomic step.
                $this->credits->spend(
                    membership:  $membership,
                    amount:      self::MESSAGE_COST,
                    category:    CreditTransactionCategory::MESSAGE_SENT,
                    description: "Sent a message to {$receiver->name}",
                    reference:   $message,
                );

                return $message;
            });
        } catch (InsufficientCreditsException $e) {
            return back()->with('error', "Not enough credits — this message costs {$e->required}, you have {$e->available}.");
        }

        // Fire notifications AFTER the DB transaction commits, so the
        // balance_after snapshot is accurate.
        $message->load(['sender.membership', 'receiver.membership']);
        $sender->notify(new MessageNotification($message, 'sent'));
        $receiver->notify(new MessageNotification($message, 'received'));

        return back()->with('success', "Message sent to {$receiver->name}.");
    }

    /**
     * Mark a received message as read.
     */
    public function markAsRead(Request $request, Message $message): RedirectResponse
    {
        abort_unless(
            $message->receiver_id === $request->user()->id,
            403,
        );

        $message->markAsRead();

        return back();
    }
}