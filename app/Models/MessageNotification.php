<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MessageNotification extends Notification
{
    use Queueable;

    /**
     * @param  'sent'|'received'  $direction
     */
    public function __construct(
        public Message $message,
        public string $direction,
    ) {}

    public function via(object $notifiable): array
    {
        // 'database' hits the notifications table.
        // 'mail' later if you want email copies.
        return ['database'];
    }

    /**
     * Data stored in the notifications.data JSON column.
     */
    public function toArray(object $notifiable): array
    {
        $base = [
            'message_id' => $this->message->id,
            'topic'      => $this->message->topic,
            'direction'  => $this->direction,
        ];

        if ($this->direction === 'sent') {
            $balanceAfter  = $this->message->sender->membership->credits_balance;
            $creditsCost   = $this->message->credits_cost;
            $balanceBefore = $balanceAfter + $creditsCost;

            return $base + [
                'title'           => 'Message sent',
                'body'            => "You sent a message to {$this->message->receiver->name}.",
                'receiver_id'     => $this->message->receiver_id,
                'receiver_name'   => $this->message->receiver->name,
                'credits_spent'   => $creditsCost,
                'balance_before'  => $balanceBefore,
                'balance_after'   => $balanceAfter,
            ];
        }

        return $base + [
            'title'         => 'New message received',
            'body'          => "{$this->message->sender->name} sent you a message.",
            'sender_id'     => $this->message->sender_id,
            'sender_name'   => $this->message->sender->name,
            'message_body'  => $this->message->body,
        ];
    }
}