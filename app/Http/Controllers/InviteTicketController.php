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
    public function index(Request $request): Response|RedirectResponse
    {
        $company = $this->authorizedCompany($request->user());

        if (! $company) {
            return $this->unauthorized();
        }

        $inviteTickets = InviteTicket::with(['user', 'acceptedBy'])
            ->whereHas('user', function ($q) use ($company) {
                $q->where('id', $company->id)
                  ->orWhere('company_id', $company->id);
            })
            ->latest()
            ->get();

        return Inertia::render('tickets/invite/index', [
            'inviteTickets' => $inviteTickets,
        ]);
    }

    public function create(Request $request): Response|RedirectResponse
    {
        $company = $this->authorizedCompany($request->user());

        if (! $company) {
            return $this->unauthorized();
        }

        return Inertia::render('tickets/invite/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $this->authorizedCompany($request->user());

        if (! $company) {
            return $this->unauthorized();
        }

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

        $tempPassword = Str::password(12, symbols: false);
        $hashed       = Hash::make($tempPassword);

        User::create([
            'name'              => $validated['invited_name'],
            'email'             => $validated['invited_email'],
            'password'          => $hashed,
            'user_type'         => User::TYPE_EMPLOYEE,
            'company_id'        => $company->id,
            'email_verified_at' => null,
        ]);

        $invite = $request->user()->inviteTickets()->create([
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
     * Resolve the company the user acts on behalf of, or null if they
     * aren't allowed to send invites. Never throws — callers route the
     * failure through `unauthorized()` so the frontend can show an
     * AlertDialog instead of a 403 page.
     */
    protected function authorizedCompany(?User $user): ?User
    {
        if (! $user) {
            return null;
        }

        $company = $user->invitableCompany();

        if (! $company) {
            return null;
        }

        if ($company->approved_at === null) {
            return null;
        }

        return $company;
    }

    /**
     * Standard "no permission" response — redirects to the dashboard with
     * a flash error. The global `FlashErrorDialog` catches `flash.error`
     * on the destination page and renders the modal.
     */
    protected function unauthorized(): RedirectResponse
    {
        return redirect()
            ->route('dashboard')
            ->with(
                'error',
                'Only approved company accounts and their employees can send invitations.',
            );
    }
}