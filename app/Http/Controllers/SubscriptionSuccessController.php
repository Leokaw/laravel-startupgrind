<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionSuccessToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionSuccessController extends Controller
{
    public function show(Request $request, string $token): Response|RedirectResponse
    {
        $record = $this->resolveToken($request, $token);

        // Already finished → back to billing.
        if ($record->status === 'completed') {
            return redirect()->route('billing');
        }

        $plan = config("subscriptions.plans.{$record->plan_slug}");

        return Inertia::render('billing/success', [
            'token'  => $record->token,
            'status' => $record->status,
            'plan'   => [
                'name'  => $plan['name'],
                'badge' => $plan['badge'] ?? null,
            ],
            'perks' => $plan['tour_perks'] ?? [],
        ]);
    }

    public function status(Request $request, string $token): JsonResponse
    {
        $record = $this->resolveToken($request, $token);

        return response()->json([
            'status'   => $record->status,
            'ready_at' => $record->ready_at?->toIso8601String(),
        ]);
    }

    public function complete(Request $request, string $token): RedirectResponse
    {
        $record = $this->resolveToken($request, $token);

        if ($record->status !== 'completed') {
            $record->update([
                'status'       => 'completed',
                'completed_at' => now(),
            ]);
        }

        return redirect()->route('billing');
    }

    private function resolveToken(Request $request, string $token): SubscriptionSuccessToken
    {
        return SubscriptionSuccessToken::where('token', $token)
            ->where('user_id', $request->user()->id)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->firstOrFail();
    }
}