<?php

namespace App\Http\Controllers;

use App\Models\InviteTicket;
use App\Notifications\InviteTicketNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InviteTicketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tickets/invite/index', [
            'inviteTickets' => InviteTicket::with(['user', 'acceptedBy'])
                ->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tickets/invite/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'invited_name' => ['required', 'string', 'max:50'],
            'invited_email' => ['required', 'email', 'max:255', 'unique:invite_tickets,invited_email'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
        ]);

        $tempPassword = Str::password(12, symbols: false);

        $invite = $request->user()->inviteTickets()->create([
            'code' => $this->generateUniqueCode(),
            'invited_name' => $validated['invited_name'],
            'invited_email' => $validated['invited_email'],
            'temporary_password' => $tempPassword,
            'expires_at' => $validated['expires_at'] ?? null,
            'max_uses' => $validated['max_uses'] ?? 1,
            'status' => 'pending',
            'is_active' => true,
        ]);

        Notification::route('mail', $invite->invited_email)
            ->notify(new InviteTicketNotification($invite));

        return redirect()->back()
            ->with('success', 'Invitation sent to '.$invite->invited_email);
    }

    protected function generateUniqueCode(): string
    {
        do {
            $code = 'INV-'.strtoupper(Str::random(8));
        } while (InviteTicket::where('code', $code)->exists());

        return $code;
    }
}