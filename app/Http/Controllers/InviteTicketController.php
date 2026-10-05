<?php

namespace App\Http\Controllers;

use App\Models\InviteTicket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InviteTicketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tickets/invite/index', [
            'inviteTickets' => InviteTicket::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tickets/invite/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:invite_tickets,code'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        // Never trust user_id from the client — set it from the authenticated user.
        $request->user()->inviteTickets()->create($validated);

        return redirect()->route('tickets.invite.create')
            ->with('success', 'Invite ticket created successfully.');
    }

    public function show(InviteTicket $inviteTicket): Response
    {
        return Inertia::render('tickets/invite/show', [
            'inviteTicket' => $inviteTicket,
        ]);
    }

    public function edit(InviteTicket $inviteTicket): Response
    {
        return Inertia::render('tickets/invite/create', [
            'inviteTicket' => $inviteTicket,
        ]);
    }

    public function update(Request $request, InviteTicket $inviteTicket): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:invite_tickets,code,' . $inviteTicket->id],
            'used_at' => ['sometimes', 'nullable', 'date'],
            'expires_at' => ['sometimes', 'nullable', 'date'],
            'max_uses' => ['sometimes', 'integer', 'min:1'],
            'current_uses' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $inviteTicket->update($validated);

        return redirect()->back()->with('success', 'Invite ticket updated.');
    }

    public function destroy(InviteTicket $inviteTicket): RedirectResponse
    {
        $inviteTicket->delete();

        return redirect()->back()->with('success', 'Invite ticket deleted.');
    }
}