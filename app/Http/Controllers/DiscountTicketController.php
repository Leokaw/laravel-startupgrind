<?php

namespace App\Http\Controllers;

use App\Models\DiscountTicket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DiscountTicketController extends Controller
{
    public function index(Request $request): Response
    {
        $tickets = $request->user()
            ->discountTickets()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('is_active', $status === 'active');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tickets/discounted/index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tickets/discounted/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'                => ['required', 'string', 'max:50'],
            'description'         => ['nullable', 'string', 'max:200'],
            'event_url'           => ['required', 'url:http,https', 'max:2048'],
            'discount_percentage' => ['required', 'numeric', 'between:0,100'],
            'valid_until'         => ['required', 'date', 'after:now'],
        ], [
            'event_url.required' => 'Please provide a link to the event this discount is for.',
            'event_url.url'      => 'Please enter a full URL, including the https:// part.',
            'event_url.max'      => 'The link is too long (max 2048 characters).',
            'valid_until.after'  => 'The expiry date must be in the future.',
        ]);

        $validated['code']      = $this->generateUniqueCode();
        $validated['is_active'] = true;

        $request->user()->discountTickets()->create($validated);

        return redirect()
            ->back()
            ->with('success', 'Discounted ticket created successfully.');
    }

    protected function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(10));
        } while (DiscountTicket::where('code', $code)->exists());

        return $code;
    }

    public function show(DiscountTicket $discountTicket)
    {
        return response()->json($discountTicket);
    }

    public function edit(DiscountTicket $discountTicket)
    {
        //
    }

    public function update(Request $request, DiscountTicket $discountTicket): RedirectResponse
    {
        abort_unless(
            $discountTicket->user_id === $request->user()->id,
            403,
        );

        $validated = $request->validate([
            'name'                => ['required', 'string', 'max:50'],
            'description'         => ['nullable', 'string', 'max:200'],
            'event_url'           => ['required', 'url:http,https', 'max:2048'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'valid_until'         => ['required', 'date'],
            'is_active'           => ['required', 'boolean'],
        ], [
            'event_url.required' => 'Please provide a link to the event this discount is for.',
            'event_url.url'      => 'Please enter a full URL, including the https:// part.',
            'event_url.max'      => 'The link is too long (max 2048 characters).',
        ]);

        $discountTicket->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Discounted ticket updated successfully.');
    }

    public function destroy(Request $request, DiscountTicket $discountTicket): RedirectResponse
    {
        abort_unless(
            $discountTicket->user_id === $request->user()->id,
            403,
        );

        $discountTicket->delete();

        return redirect()
            ->back()
            ->with('success', 'Discounted ticket deleted successfully.');
    }
}