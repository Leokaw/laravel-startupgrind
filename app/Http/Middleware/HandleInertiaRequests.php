<?php

namespace App\Http\Middleware;

use App\Enums\MembershipTier;
use App\Support\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        $user?->loadMissing('membership:id,user_id,credits_balance,tier,status');

        return [
            ...parent::share($request),

            'serviceCategories' => ServiceCategory::all(),
            'name'              => config('app.name'),

            // Onboarding gate — drives the first-login modal.
            // Null for guests; a payload when the user exists.
            'onboarding' => fn() => $user ? [
           'required'   => $user->onboarded_at === null,

                'categories' => ServiceCategory::all(),
            ] : null,

            'auth' => [
                'user' => $user ? [
                    'id'                       => $user->id,
                    'name'                     => $user->name,
                    'email'                    => $user->email,
                    'user_type'                => $user->user_type,
                    'approved_at'              => $user->approved_at,
                    'email_verified_at'        => $user->email_verified_at,
                    'profile_photo_url'        => $user->profile_photo_url,
                    'has_custom_profile_photo' => $user->hasCustomProfilePhoto(),

                    'membership' => $user->membership ? [
                        'tier'            => $user->membership->tier,
                        'status'          => $user->membership->status,
                        'credits_balance' => $user->membership->credits_balance,
                    ] : null,
                ] : null,
            ],

            'can_view_team' => $user?->membership
                ? $user->membership->isAtLeast(MembershipTier::PRO)
                : false,

            'unreadNotificationsCount' => $user
                ? $user->unreadNotifications()->count()
                : 0,

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
                'toast'   => fn() => $request->session()->get('toast'),
            ],

         'sidebarOpen' => ! $request->hasCookie('sidebar_state')
    || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
