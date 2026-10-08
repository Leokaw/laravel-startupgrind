<?php

namespace App\Http\Controllers;

use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use Symfony\Component\HttpFoundation\Response;

class StripeWebhookController extends CashierWebhookController
{
    /**
     * Cashier's parent handler falls back to handleCustomerSubscriptionCreated
     * when its local lookup by stripe_id misses, which can collide with the
     * row created by an earlier customer.subscription.created event. The
     * duplicate is a no-op from our perspective — the data is already there.
     */
   

}