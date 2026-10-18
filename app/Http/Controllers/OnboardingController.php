<?php

namespace App\Http\Controllers;

use App\Support\ServiceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OnboardingController extends Controller
{
    public function complete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role'         => ['required', 'string', Rule::in([
                'founder',
                'investor',
                'operator',
                'freelancer',
                'designer',
                'developer',
            ])],
            'goal'         => ['required', 'string', Rule::in([
                'raise',
                'cofounder',
                'hire',
                'network',
                'learn',
                'events',
            ])],
            'area_of_work' => ['required', 'string', Rule::in(ServiceCategory::values())],
            'description'  => ['required', 'string', 'max:500'],
        ]);

        $user = $request->user();

        $user->forceFill([
            'role'         => $validated['role'],
            'goal'         => $validated['goal'],
            'area_of_work' => $validated['area_of_work'],
            'description'  => $validated['description'],
            'onboarded_at' => now(),
        ])->save();

        // Re-read from the DB so any observer side effects are reflected
        // in the in-memory instance before we return.
        $user->refresh();

        // Explicit destination so we don't fall back to `back()` and
        // land on /dashboard?verified=1 (which would remount the gate
        // with stale shared props).
        return redirect()
            ->route('dashboard')
            ->with('toast', [
                'type'    => 'success',
                'message' => "You're all set. Welcome aboard!",
            ]);
    }

    public function skip(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->forceFill(['onboarded_at' => now()])->save();
        $user->refresh();

        return redirect()
            ->route('dashboard')
            ->with('toast', [
                'type'    => 'info',
                'message' => 'You can complete your profile any time from Settings.',
            ]);
    }
}