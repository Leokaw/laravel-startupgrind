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

        return Inertia::render('invite/accept', [
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

    // temporary_password holds the bcrypt hash of the temp password.
    if (! Hash::check($request->password, $invite->temporary_password)) {
        throw ValidationException::withMessages([
            'password' => 'The password does not match this invitation.',
        ]);
    }

    // The user was already created when the invite was sent.
    $user = User::where('email', $invite->invited_email)->firstOrFail();

    // Mark accepted and audit it. DO NOT null out temporary_password —
    // the column is NOT NULL in the schema, and we don't need to clear it.
    $invite->update([
        'status'       => 'accepted',
        'accepted_by'  => $user->id,
        'used_at'      => now(),
        'current_uses' => $invite->current_uses + 1,
    ]);

    // Now that they proved they own the email, verify them.
    $user->forceFill(['email_verified_at' => now()])->save();

    Auth::login($user);

    return redirect()->route('dashboard')
        ->with('success', 'Welcome to the team!');
}
}