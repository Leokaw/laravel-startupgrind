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
        $company = $this->authorizedCompany($request->user());

        // Show every invite sent by the company itself *or* by any of
        // its employees. The inviter's user_id is the company id for
        // company-sent invites, and the employee id otherwise — so we
        // match against both.
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

    public function create(Request $request): Response
    {
        $this->authorizedCompany($request->user());

        return Inertia::render('tickets/invite/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $this->authorizedCompany($request->user());

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

        // The invitee joins *the company*, regardless of whether the
        // invite was sent by the company owner or one of their employees.
        User::create([
            'name'              => $validated['invited_name'],
            'email'             => $validated['invited_email'],
            'password'          => $hashed,
            'user_type'         => User::TYPE_EMPLOYEE,
            'company_id'        => $company->id,
            'email_verified_at' => null,
        ]);

        // The invite record belongs to the actual sender for audit
        // purposes — company owner or employee.
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
     * Ensure the user is allowed to send invites and return the company
     * they act on behalf of.
     *
     *   - Companies (approved) → returns the company itself.
     *   - Employees of an approved company → returns their company.
     *   - Everyone else → 403.
     */
    protected function authorizedCompany(?User $user): User
    {
        if (! $user) {
            abort(403, 'You must be signed in to invite users.');
        }

        $company = $user->invitableCompany();

        if (! $company) {
            abort(403, 'Only company accounts and their employees can invite users.');
        }

        if ($company->approved_at === null) {
            abort(403, 'Your company account is pending approval.');
        }

        return $company;
    }
}