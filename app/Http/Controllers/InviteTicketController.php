<?php

namespace App\Http\Controllers;

use App\Models\InviteTicket;
use App\Models\User;
use App\Notifications\InviteTicketNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InviteTicketController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorizeInviter($request->user());

        return Inertia::render('tickets/invite/index', [
            'inviteTickets' => InviteTicket::with(['user', 'acceptedBy'])
                ->latest()->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorizeInviter($request->user());

        return Inertia::render('tickets/invite/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeInviter($request->user());

        $validated = $request->validate([
            'invited_name'  => ['required', 'string', 'max:50'],
            'invited_email' => [
                'required', 'email', 'max:255',
                'unique:invite_tickets,invited_email',
                'unique:users,email',
            ],
            'expires_at'    => ['nullable', 'date', 'after:today'],
            'max_uses'      => ['nullable', 'integer', 'min:1'],
        ]);

        // The guard above guarantees this is an approved company.
        $company = $request->user();

        $tempPassword = Str::password(12, symbols: false);
        $hashed       = Hash::make($tempPassword);

        User::create([
            'name'              => $validated['invited_name'],
            'email'             => $validated['invited_email'],
            'password'          => $hashed,
            'user_type'         => 'employee',
            'company_id'        => $company->id,
            'email_verified_at' => null,
        ]);

        $invite = $company->inviteTickets()->create([
            'code'               => $this->generateUniqueCode(),
            'invited_name'       => $validated['invited_name'],
            'invited_email'      => $validated['invited_email'],
            'temporary_password' => $hashed,
            'expires_at'         => $validated['expires_at'] ?? null,
            'max_uses'           => $validated['max_uses'] ?? 1,
            'status'             => 'pending',
            'is_active'          => true,
        ]);

        Notification::route('mail', $invite->invited_email)
            ->notify(new InviteTicketNotification($invite, $tempPassword));

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

    /**
     * Only approved company accounts may invite users.
     */
    protected function authorizeInviter(?User $user): void
    {
        if (! $user || ! $user->isCompany()) {
            abort(403, 'Only company accounts can invite users.');
        }

        if ($user->approved_at === null) {
            abort(403, 'Your company account is pending approval.');
        }
    }
}