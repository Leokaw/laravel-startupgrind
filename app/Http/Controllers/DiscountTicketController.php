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
    /**
     * Display a listing of the resource.
     */
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
     return Inertia::render('tickets/discounted/create');
    }

    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:200'],
            'discount_percentage' => ['required', 'numeric', 'between:0,100'],
            'valid_from' => ['required', 'date'],
            'valid_until' => ['required', 'date', 'after:valid_from'],
        ]);

        $validated['code'] = $this->generateUniqueCode();
        $validated['is_active'] = true;

        // Relationship sets user_id automatically and locks it to the authenticated user
        $request->user()->discountTickets()->create($validated);

        return redirect()->back()->with('success', 'Discounted ticket created successfully.');
    }

    /**
     * Generate a unique, uppercase alphanumeric code for a discount ticket.
     */
    protected function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(10));
        } while (DiscountTicket::where('code', $code)->exists());

        return $code;
    } 
    

    /**
     * Display the specified resource.
     */
    public function show(DiscountTicket $discountTicket)
    {
        return response()->json($discountTicket);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DiscountTicket $discountTicket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, DiscountTicket $discountTicket): RedirectResponse
{
    abort_unless(
        $discountTicket->user_id === $request->user()->id,
        403,
    );

    $validated = $request->validate([
        'name'                => ['required', 'string', 'max:50'],
        'description'         => ['nullable', 'string', 'max:200'],
        'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        'valid_from'          => ['required', 'date'],
        'valid_until'         => ['required', 'date', 'after_or_equal:valid_from'],
        'is_active'           => ['required', 'boolean'],
    ]);

    $discountTicket->update($validated);

    return redirect()
        ->back()
        ->with('success', 'Discounted ticket updated successfully.');
}

    /**
     * Remove the specified resource from storage.
     */
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