<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\CompanyEmployeeController;
use App\Http\Controllers\CompanyServiceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscountTicketController;
use App\Http\Controllers\InviteAcceptanceController;
use App\Http\Controllers\InviteTicketController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\ServicePurchaseController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\SubscriptionSuccessController;
use App\Http\Controllers\TicketPurchaseController;
use App\Http\Controllers\UpcomingEventsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::inertia('/', 'welcome')->name('home');

Route::get('/invite/{code}', [InviteAcceptanceController::class, 'show'])
    ->name('invites.accept.show');
Route::post('/invite/{code}', [InviteAcceptanceController::class, 'store'])
    ->name('invites.accept.store');

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');

/*
|--------------------------------------------------------------------------
| Authenticated AND verified
|--------------------------------------------------------------------------
|
| After registration, Fortify redirects to /dashboard. Because that route
| now requires `verified`, an unverified user is bounced to
| verification.notice (/email/verify). Once they click the link in their
| inbox, they land back on /dashboard and the onboarding modal shows.
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::post('/onboarding/complete', [OnboardingController::class, 'complete'])
        ->name('onboarding.complete');
    Route::post('/onboarding/skip', [OnboardingController::class, 'skip'])
        ->name('onboarding.skip');

    // Discount tickets
    Route::get('/tickets/discounted/create', [DiscountTicketController::class, 'create'])
        ->name('tickets.discounted.create');
    Route::post('/tickets/discounted', [DiscountTicketController::class, 'store'])
        ->name('tickets.discounted.store');
    Route::get('/tickets/discounted', [DiscountTicketController::class, 'index'])
        ->name('tickets.discounted.index');
    Route::patch('/tickets/discounted/{discountTicket}', [DiscountTicketController::class, 'update'])
        ->name('tickets.discounted.update');
    Route::delete('/tickets/discounted/{discountTicket}', [DiscountTicketController::class, 'destroy'])
        ->name('tickets.discounted.destroy');

    // Invite tickets
    Route::get('/tickets/invite/create', [InviteTicketController::class, 'create'])
        ->name('tickets.invite.create');
    Route::post('/tickets/invite', [InviteTicketController::class, 'store'])
        ->name('tickets.invite.store');

    // Company services
    Route::get('/services/company/create', [CompanyServiceController::class, 'create'])
        ->name('services.company.create');
    Route::post('/services/company', [CompanyServiceController::class, 'store'])
        ->name('services.company.store');
    Route::patch('/services/company/{companyService}', [CompanyServiceController::class, 'update'])
        ->name('services.company.update');
    Route::delete('/services/company/{companyService}', [CompanyServiceController::class, 'destroy'])
        ->name('services.company.destroy');

    // Community & profile
    Route::get('/community', [CommunityController::class, 'index'])
        ->name('community.index');

    Route::post('/profile/photo', [ProfilePhotoController::class, 'store'])
        ->name('profile.photo.store');
    Route::delete('/profile/photo', [ProfilePhotoController::class, 'destroy'])
        ->name('profile.photo.destroy');

    // Messages
    Route::post('/users/{receiver}/messages', [MessageController::class, 'store'])
        ->name('messages.store');
    Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead'])
        ->name('messages.read');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.read-all');

    // Purchases
    Route::post('/services/{service}/purchase', [ServicePurchaseController::class, 'store'])
        ->name('services.purchase');
    Route::post('/tickets/{ticket}/purchase', [TicketPurchaseController::class, 'store'])
        ->name('tickets.purchase');

    // Billing
    Route::get('billing', BillingController::class)->name('billing');
    Route::post('/billing/subscribe', [BillingController::class, 'subscribe'])
        ->name('billing.subscribe');
    Route::post('/billing/cancel', [BillingController::class, 'cancel'])
        ->name('billing.cancel');
    Route::post('/billing/resume', [BillingController::class, 'resume'])
        ->name('billing.resume');

    // Post-checkout tour
    Route::get('/billing/success/{token}', [SubscriptionSuccessController::class, 'show'])
        ->name('billing.success');
    Route::get('/billing/success/{token}/status', [SubscriptionSuccessController::class, 'status'])
        ->name('billing.success.status');
    Route::post('/billing/success/{token}/complete', [SubscriptionSuccessController::class, 'complete'])
        ->name('billing.success.complete');

    // Company employees
    Route::delete('/company/employees/{employee}', [CompanyEmployeeController::class, 'destroy'])
        ->name('company.employees.destroy');

    // Events
    Route::get('/events', UpcomingEventsController::class)
        ->name('events.index');
    Route::get('/events/{slug}', [UpcomingEventsController::class, 'show'])
        ->name('events.show');
});

require __DIR__ . '/settings.php';