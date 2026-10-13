<?php

namespace App\Http\Controllers;

use App\Support\ServiceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function complete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area_of_work' => ['nullable', 'string', 'in:' . implode(',', ServiceCategory::values())],
            'description'  => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        $user->update([
            'area_of_work' => $validated['area_of_work'] ?? $user->area_of_work,
            'description'  => $validated['description'] ?? $user->description,
            'onboarded_at' => now(),
        ]);

        return back()->with('toast', [
            'type'    => 'success',
            'message' => "You're all set. Welcome aboard!",
        ]);
    }

    public function skip(Request $request): RedirectResponse
    {
        $request->user()->update(['onboarded_at' => now()]);

        return back()->with('toast', [
            'type'    => 'info',
            'message' => 'You can complete your profile any time from Settings.',
        ]);
    }
}