<?php

use App\Http\Controllers\CompanyServiceController;
use App\Http\Controllers\DiscountTicketController;
use App\Http\Controllers\InviteAcceptanceController;
use App\Http\Controllers\InviteTicketController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome')->name('home');
// Public — invitees are not logged in yet
Route::get('/invite/{code}', [InviteAcceptanceController::class, 'show'])
    ->name('invites.accept.show');
Route::post('/invite/{code}', [InviteAcceptanceController::class, 'store'])
    ->name('invites.accept.store');

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
});


Route::get('/tickets/discounted', [DiscountTicketController::class, 'index'])
    ->name('tickets.discounted.index');
Route::patch('/tickets/discounted/{discountTicket}', [DiscountTicketController::class, 'update'])
    ->name('tickets.discounted.update');
Route::delete('/tickets/discounted/{discountTicket}', [DiscountTicketController::class, 'destroy'])
    ->name('tickets.discounted.destroy');



require __DIR__ . '/settings.php';
