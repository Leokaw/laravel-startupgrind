<?php

namespace App\Http\Controllers;

use App\Models\InviteTicket;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InviteAcceptanceController extends Controller
{
    public function show(string $code): Response|RedirectResponse
    {
        $invite = InviteTicket::where('code', $code)->first();

        if (! $invite || ! $invite->isRedeemable()) {
            return redirect()->route('login')
                ->with('error', 'This invitation is no longer valid.');
        }

        return Inertia::render('invites/accept', [
            'invite' => [
                'code' => $invite->code,
                'invited_name' => $invite->invited_name,
                'invited_email' => $invite->invited_email,
            ],
        ]);
    }

    public function store(Request $request, string $code): RedirectResponse
    {
        $invite = InviteTicket::where('code', $code)->first();

        if (! $invite || ! $invite->isRedeemable()) {
            return redirect()->route('login')
                ->with('error', 'This invitation is no longer valid.');
        }

        $request->validate([
            'password' => ['required', 'string'],
        ]);

        // The invitee must type the exact temporary password from the email.
        if (! hash_equals($invite->temporary_password, $request->password)) {
            throw ValidationException::withMessages([
                'password' => 'The password does not match this invitation.',
            ]);
        }

        // Create the user account with 'employee' user type.
        $user = User::create([
            'name' => $invite->invited_name,
            'email' => $invite->invited_email,
            'password' => Hash::make($request->password),
            'user_type' => 'employee',
            'email_verified_at' => now(),
        ]);

        // Mark the invite accepted and record the audit trail.
        $invite->update([
            'status' => 'accepted',
            'accepted_by' => $user->id,
            'used_at' => now(),
            'current_uses' => $invite->current_uses + 1,
            'temporary_password' => null, // clear for security after redemption
        ]);

        Auth::login($user);

        return redirect()->route('dashboard')
            ->with('success', 'Welcome to the team!');
    }
}