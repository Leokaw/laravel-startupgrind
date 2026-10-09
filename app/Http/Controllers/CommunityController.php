<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    public function index(Request $request): Response
    {
        $me = $request->user()->load('company:id,name');

        $users = User::query()
            ->with([
                'company:id,name',
                'companyServices' => fn ($q) => $q->where('is_active', true),
                'discountTickets' => fn ($q) => $q->where('is_active', true),
                // Employees belonging to any company in this page.
                // For non-company users this returns an empty collection
                // — no per-row branching required.
                'employees' => fn ($q) => $q->orderBy('name'),
            ])
            ->where('id', '!=', $me->id)
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->input('user_type'), function ($query, $type) {
                $query->where('user_type', $type);
            })
            ->orderBy('name')
            ->paginate(7)
            ->withQueryString()
            ->through(fn (User $user) => $this->serialize($user));

        $me->load([
            'companyServices' => fn ($q) => $q->where('is_active', true),
            'discountTickets' => fn ($q) => $q->where('is_active', true),
            'employees'       => fn ($q) => $q->orderBy('name'),
        ]);

        return Inertia::render('community/index', [
            'me'      => $this->serialize($me),
            'users'   => $users,
            'filters' => $request->only(['search', 'user_type']),
        ]);
    }

    /**
     * Shape a User into the payload the frontend expects.
     *
     * @return array<string, mixed>
     */
    protected function serialize(User $user): array
    {
        return [
            'id'                       => $user->id,
            'name'                     => $user->name,
            'email'                    => $user->email,
            'user_type'                => $user->user_type,
            'profile_photo_url'        => $user->profile_photo_url,
            'has_custom_profile_photo' => $user->hasCustomProfilePhoto(),
            'company'                  => $user->company ? [
                'id'   => $user->company->id,
                'name' => $user->company->name,
            ] : null,
            'email_verified_at'        => $user->email_verified_at,
            'approved_at'              => $user->approved_at,

            'services' => $user->companyServices->map(fn ($service) => [
                'id'          => $service->id,
                'name'        => $service->name,
                'description' => $service->description,
                'price'       => $service->price,
                'category'    => $service->category,
            ])->values()->all(),

            'tickets' => $user->discountTickets->map(fn ($ticket) => [
                'id'                  => $ticket->id,
                'code'                => $ticket->code,
                'name'                => $ticket->name,
                'description'         => $ticket->description,
                'discount_percentage' => $ticket->discount_percentage,
                'discount_amount'     => $ticket->discount_amount,
                'valid_from'          => $ticket->valid_from,
                'valid_until'         => $ticket->valid_until,
                'usage_limit'         => $ticket->usage_limit,
                'times_used'          => $ticket->times_used,
            ])->values()->all(),

            // Only populated for company accounts — empty for everyone else.
            'employees' => $user->employees->map(fn (User $employee) => [
                'id'                       => $employee->id,
                'name'                     => $employee->name,
                'email'                    => $employee->email,
                'profile_photo_url'        => $employee->profile_photo_url,
                'has_custom_profile_photo' => $employee->hasCustomProfilePhoto(),
                'email_verified_at'        => $employee->email_verified_at,
                'created_at'               => $employee->created_at?->toIso8601String(),
            ])->values()->all(),
        ];
    }
}