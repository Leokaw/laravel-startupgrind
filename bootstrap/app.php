<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Stripe signs its own payloads with the webhook secret, so it
        // can't supply a CSRF token. Exempt the webhook path only.
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Any error on the Stripe webhook path must render as JSON, since
        // Stripe's server (and the CLI) can't parse an HTML error page and
        // will silently retry instead of showing you the real failure.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*')
                || $request->is('stripe/*')
                || $request->expectsJson(),
        );

        // Signature mismatches happen constantly during local development
        // (stale CLI secret, wrong mode). They're expected noise — don't
        // fill the log with them. Remove this once you're in production.
        $exceptions->dontReport([
            SignatureVerificationException::class,
        ]);
    })
    ->create();