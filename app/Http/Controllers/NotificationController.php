<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $type = $request->query('type');

        $query = $user->notifications()->latest();

        // Filter by type (basename of the notification class).
        if (is_string($type) && $type !== '' && $type !== 'all') {
            $query->where('type', 'like', '%\\' . $type);
        }

        $notifications = $query
            ->paginate(5)
            ->withQueryString()
            ->through(fn ($n) => [
                'id'         => $n->id,
                'type'       => class_basename($n->type),
                'data'       => $n->data,
                'read_at'    => $n->read_at,
                'created_at' => $n->created_at,
            ]);

        // Distinct types currently in this user's inbox, used to
        // populate the filter dropdown on the frontend.
        $availableTypes = $user->notifications()
            ->select('type')
            ->distinct()
            ->pluck('type')
            ->map(fn ($t) => class_basename($t))
            ->values()
            ->all();

        return Inertia::render('notifications/index', [
            'notifications'  => $notifications,
            'unreadCount'    => $user->unreadNotifications()->count(),
            'availableTypes' => $availableTypes,
            'filters'        => [
                'type' => $type ?? 'all',
            ],
        ]);
    }

    /**
     * Mark one notification as read.
     */
    public function markAsRead(Request $request, string $notification): RedirectResponse
    {
        $model = $request->user()->notifications()->findOrFail($notification);
        $model->markAsRead();

        return back();
    }

    /**
     * Mark every notification as read.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return back()->with('success', 'All notifications marked as read.');
    }
}