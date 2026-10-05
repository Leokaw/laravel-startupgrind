<?php

namespace App\Http\Controllers;

use App\Models\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Support\ServiceCategory;
use Illuminate\Validation\Rule;

class CompanyServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companyServices = CompanyService::all();
        return response()->json($companyServices);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('services/company/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:200'],
            'category' => ['required', Rule::in(ServiceCategory::values())],
        ]);

        // Price is set server-side; the client cannot override it.
        $validated['price'] = 50;
        $validated['is_active'] = true;

        $request->user()->companyServices()->create($validated);

        return redirect()->back()->with('success', 'Company service created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(CompanyService $companyService)
    {
        return response()->json($companyService);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CompanyService $companyService)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CompanyService $companyService): RedirectResponse
{
    abort_unless(
        $companyService->user_id === $request->user()->id,
        403,
    );

    $validated = $request->validate([
        'name'        => ['required', 'string', 'max:50'],
        'description' => ['nullable', 'string', 'max:200'],
        'category'    => ['required', Rule::in(ServiceCategory::values())],
        'is_active'   => ['required', 'boolean'],
    ]);

    $companyService->update($validated);

    return redirect()
        ->back()
        ->with('success', 'Company service updated successfully.');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CompanyService $companyService): RedirectResponse
{
    abort_unless(
        $companyService->user_id === $request->user()->id,
        403,
    );

    $companyService->delete();

    return redirect()
        ->back()
        ->with('success', 'Company service deleted successfully.');
}
}
