<?php

use App\Http\Controllers\CompanyServiceController;
use App\Http\Controllers\DiscountTicketController;
use App\Http\Controllers\InviteAcceptanceController;
use App\Http\Controllers\InviteTicketController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CompanyEmployeeController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\ServicePurchaseController;
use App\Http\Controllers\TicketPurchaseController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SubscriptionSuccessController;



Route::inertia('/', 'welcome')->name('home');
// Public — invitees are not logged in yet
Route::get('/invite/{code}', [InviteAcceptanceController::class, 'show'])
    ->name('invites.accept.show');
Route::post('/invite/{code}', [InviteAcceptanceController::class, 'store'])
    ->name('invites.accept.store');


Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');


    // Discount tickets
    Route::get('/tickets/discounted/create', [DiscountTicketController::class, 'create'])
        ->name('tickets.discounted.create');
    Route::post('/tickets/discounted', [DiscountTicketController::class, 'store'])
        ->name('tickets.discounted.store');

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


    Route::get('/tickets/invite/create', [InviteTicketController::class, 'create'])
        ->name('tickets.invite.create');
    Route::post('/tickets/invite', [InviteTicketController::class, 'store'])
        ->name('tickets.invite.store');



    Route::patch('/services/company/{companyService}', [CompanyServiceController::class, 'update'])
        ->name('services.company.update');


    Route::delete('/services/company/{companyService}', [CompanyServiceController::class, 'destroy'])
        ->name('services.company.destroy');

    Route::get('/community', [CommunityController::class, 'index'])
        ->name('community.index');

    Route::post('/profile/photo', [ProfilePhotoController::class, 'store'])
        ->name('profile.photo.store');

    Route::delete('/profile/photo', [ProfilePhotoController::class, 'destroy'])
        ->name('profile.photo.destroy');

    Route::post('/users/{receiver}/messages', [MessageController::class, 'store'])
        ->name('messages.store');

    Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead'])
        ->name('messages.read');

    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.read');

    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.read-all');

    Route::post('/services/{service}/purchase', [ServicePurchaseController::class, 'store'])
        ->name('services.purchase');

    Route::post('/tickets/{ticket}/purchase', [TicketPurchaseController::class, 'store'])
        ->name('tickets.purchase');


    Route::get('billing', \App\Http\Controllers\BillingController::class)
        ->name('billing');

    Route::post('/billing/subscribe', [SubscriptionController::class, 'checkout'])
        ->name('billing.subscribe');

    Route::post('/billing/cancel', [SubscriptionController::class, 'cancel'])
        ->name('billing.cancel');

    Route::post('/billing/resume', [SubscriptionController::class, 'resume'])
        ->name('billing.resume');



    Route::get('/tickets/discounted', [DiscountTicketController::class, 'index'])
        ->name('tickets.discounted.index');
    Route::patch('/tickets/discounted/{discountTicket}', [DiscountTicketController::class, 'update'])
        ->name('tickets.discounted.update');
    Route::delete('/tickets/discounted/{discountTicket}', [DiscountTicketController::class, 'destroy'])
        ->name('tickets.discounted.destroy');

    Route::delete('/company/employees/{employee}', [CompanyEmployeeController::class, 'destroy'])
        ->name('company.employees.destroy');



    Route::get('/billing/success/{token}', [SubscriptionSuccessController::class, 'show'])
        ->name('billing.success');

    Route::get('/billing/success/{token}/status', [SubscriptionSuccessController::class, 'status'])
        ->name('billing.success.status');

    Route::post('/billing/success/{token}/complete', [SubscriptionSuccessController::class, 'complete'])
        ->name('billing.success.complete');
});




Route::get('billing', BillingController::class)->name('billing');



require __DIR__ . '/settings.php';
