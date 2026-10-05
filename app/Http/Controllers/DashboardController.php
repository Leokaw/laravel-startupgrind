<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $services = $request->user()
            ->companyServices()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(10, ['*'], 'services_page')
            ->withQueryString();

        $tickets = $request->user()
            ->discountTickets()
            ->when($request->input('ticket_search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($request->input('ticket_status'), function ($query, $status) {
                $query->where('is_active', $status === 'active');
            })
            ->latest()
            ->paginate(10, ['*'], 'tickets_page')
            ->withQueryString();

        return Inertia::render('dashboard', [
            'services' => $services,
            'filters' => $request->only(['search', 'category']),
            'tickets' => $tickets,
            'ticketFilters' => $request->only(['ticket_search', 'ticket_status']),
        ]);
    }
}