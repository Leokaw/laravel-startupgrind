<?php

namespace App\Http\Controllers;

use App\Models\DiscountTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DiscountTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $discountTickets = DiscountTicket::all();
        return response()->json($discountTickets);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:discount_tickets,code',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'discount_percentage' => 'nullable|numeric|between:0,100',
            'discount_amount' => 'nullable|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean'
        ], [
            'discount_percentage' => 'Either discount_percentage or discount_amount must be provided',
            'discount_amount' => 'Either discount_percentage or discount_amount must be provided'
        ]);

        // Ensure either discount_percentage or discount_amount is provided
        if (!$validated['discount_percentage'] && !$validated['discount_amount']) {
            return response()->json([
                'error' => 'Either discount_percentage or discount_amount must be provided'
            ], 400);
        }

        $discountTicket = DiscountTicket::create($validated);

        return response()->json($discountTicket, 201);
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
    public function update(Request $request, DiscountTicket $discountTicket)
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:discount_tickets,code,' . $discountTicket->id,
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'discount_percentage' => 'sometimes|nullable|numeric|between:0,100',
            'discount_amount' => 'sometimes|nullable|numeric|min:0',
            'valid_from' => 'sometimes|date',
            'valid_until' => 'sometimes|date|after:valid_from',
            'usage_limit' => 'sometimes|integer|min:1',
            'times_used' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean'
        ], [
            'discount_percentage' => 'Either discount_percentage or discount_amount must be provided',
            'discount_amount' => 'Either discount_percentage or discount_amount must be provided'
        ]);

        // Ensure either discount_percentage or discount_amount is provided if one is being updated
        if (isset($validated['discount_percentage']) || isset($validated['discount_amount'])) {
            if (!$validated['discount_percentage'] && !$validated['discount_amount']) {
                // Keep existing values if neither is provided
                unset($validated['discount_percentage']);
                unset($validated['discount_amount']);
            }
        }

        $discountTicket->update($validated);

        return response()->json($discountTicket);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DiscountTicket $discountTicket)
    {
        $discountTicket->delete();

        return response()->json(null, 204);
    }
}