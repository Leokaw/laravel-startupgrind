<?php

namespace App\Http\Controllers;

use App\Models\CompanyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $companyService = CompanyService::create($validated);

        return response()->json($companyService, 201);
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
    public function update(Request $request, CompanyService $companyService)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string',
            'is_active' => 'sometimes|boolean'
        ]);

        $companyService->update($validated);

        return response()->json($companyService);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompanyService $companyService)
    {
        $companyService->delete();

        return response()->json(null, 204);
    }
}