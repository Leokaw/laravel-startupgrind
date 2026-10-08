<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MessageNotification extends Notification
{
    use Queueable;

    /**
     * @param  Message  $message    The message that was sent/received.
     * @param  'sent'|'received'  $direction  Who this notification is for.
     */
    public function __construct(
        public Message $message,
        public string $direction,
    ) {}

    /**
     * Delivery channels. 'database' writes to the notifications table,
     * which is what powers the sidebar badge and the notifications page.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Data stored in the notifications.data JSON column.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $base = [
            'message_id' => $this->message->id,
            'topic'      => $this->message->topic,
            'direction'  => $this->direction,
        ];

        if ($this->direction === 'sent') {
            $receiver    = $this->message->receiver;
            $sender      = $this->message->sender;
            $cost        = $this->message->credits_cost;

            // The sender's balance after this spend. Because the
            // controller loads `sender.membership` before firing
            // notifications, this read is accurate.
            $balanceAfter  = $sender->membership?->credits_balance ?? 0;
            $balanceBefore = $balanceAfter + $cost;

            return $base + [
                'title'          => 'Message sent',
                'body'           => "You sent a message to {$receiver->name}.",
                'receiver_id'    => $receiver->id,
                'receiver_name'  => $receiver->name,
                'credits_spent'  => $cost,
                'balance_before' => $balanceBefore,
                'balance_after'  => $balanceAfter,
            ];
        }

        // Received
        return $base + [
            'title'        => 'New message received',
            'body'         => "{$this->message->sender->name} sent you a message.",
            'sender_id'    => $this->message->sender_id,
            'sender_name'  => $this->message->sender->name,
            'message_body' => $this->message->body,
        ];
    }
}