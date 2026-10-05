<?php

use App\Http\Controllers\CompanyServiceController;
use App\Http\Controllers\DiscountTicketController;
use App\Http\Controllers\InviteTicketController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

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
});

require __DIR__.'/settings.php';