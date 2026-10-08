<?php

namespace App\Notifications;

use App\Models\InviteTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InviteTicketNotification extends Notification
{
    use Queueable;

    /**
     * @param  InviteTicket  $inviteTicket       The invite record (holds the bcrypt hash in DB).
     * @param  string        $plainTextPassword  The plaintext password to show the invitee.
     *                                           This never gets persisted anywhere.
     */
    public function __construct(
        public InviteTicket $inviteTicket,
        public string $plainTextPassword,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = route('invites.accept.show', $this->inviteTicket->code);

        return (new MailMessage)
            ->subject('You have been invited')
            ->greeting('Hello '.$this->inviteTicket->invited_name.',')
            ->line('You have been invited to join our platform.')
            ->line('**Your temporary password:** '.$this->plainTextPassword)   // ← PLAINTEXT
            ->line('This password is temporary. You will be asked to change it after your first login.')
            ->action('Accept Invitation', $acceptUrl)
            ->line('If you did not expect this invitation, you can safely ignore this email.');
    }
}