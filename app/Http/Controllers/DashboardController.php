<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $services = $user
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

        $tickets = $user
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

        // Employees are only relevant for company accounts.
        $employees = null;
        $employeeFilters = null;

        if ($user->isCompany()) {
            $employees = $user
                ->employees()
                ->when($request->input('employee_search'), function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->when($request->input('employee_status'), function ($query, $status) {
                    if ($status === 'active') {
                        $query->whereNotNull('email_verified_at');
                    } elseif ($status === 'pending') {
                        $query->whereNull('email_verified_at');
                    }
                })
                ->latest()
                ->paginate(10, ['*'], 'employees_page')
                ->withQueryString();

            $employeeFilters = $request->only(['employee_search', 'employee_status']);
        }

        return Inertia::render('dashboard', [
            'services'        => $services,
            'filters'         => $request->only(['search', 'category']),
            'tickets'         => $tickets,
            'ticketFilters'   => $request->only(['ticket_search', 'ticket_status']),
            'employees'       => $employees,
            'employeeFilters' => $employeeFilters,
        ]);
    }
}