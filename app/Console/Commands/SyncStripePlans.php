<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Laravel\Cashier\Cashier;
use Stripe\Price;
use Stripe\Product;

class SyncStripePlans extends Command
{
    protected $signature = 'stripe:sync-plans {--dry-run : Show what would be created without hitting the API}';
    protected $description = 'Create/update Stripe products and prices from config/subscriptions.php';

    /**
     * Stripe zero-decimal currencies: their smallest unit IS the major unit.
     * Everything else is assumed to be 2-decimal.
     * @see https://docs.stripe.com/currencies#zero-decimal
     */
    private const ZERO_DECIMAL = [
        'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
        'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
    ];

    public function handle(): int
    {
        $plans    = config('subscriptions.plans');
        $currency = strtolower(config('subscriptions.currency'));
        $dryRun   = (bool) $this->option('dry-run');

        foreach ($plans as $slug => $plan) {
            if (empty($plan['lookup_key']) || (int) $plan['price'] <= 0) {
                $this->line("  · skipping <fg=gray>{$slug}</> (free plan)");
                continue;
            }

            $unitAmount = $this->toMinorUnits((int) $plan['price'], $currency);

            $this->line("→ <fg=cyan>{$plan['name']}</> ({$slug})");
            $this->line("    config: {$plan['price']} ".strtoupper($currency)."  →  unit_amount: {$unitAmount}");

            if ($dryRun) {
                continue;
            }

            try {
                $product = $this->findOrCreateProduct($slug, $plan);
                $price   = $this->findOrCreatePrice($product, $plan, $currency, $unitAmount);

                $this->line("    product: <fg=yellow>{$product->id}</>");
                $this->line("    price:   <fg=yellow>{$price->id}</>  (lookup_key: {$price->lookup_key})");

                // Invalidate the resolver cache so the next request picks up the new ID.
                Cache::forget("stripe.price_id.{$plan['lookup_key']}");
            } catch (\Throwable $e) {
                $this->error("    failed: {$e->getMessage()}");
                return self::FAILURE;
            }
        }

        $this->newLine();
        $this->info('Done.');

        return self::SUCCESS;
    }

    private function toMinorUnits(int $majorAmount, string $currency): int
    {
        return in_array(strtoupper($currency), self::ZERO_DECIMAL, true)
            ? $majorAmount
            : $majorAmount * 100;
    }

    private function findOrCreateProduct(string $slug, array $plan): Product
    {
        $stripe = Cashier::stripe();

        $existing = $stripe->products->search([
            'query' => "metadata['app_slug']:'{$slug}'",
            'limit' => 1,
        ]);

        if (! empty($existing->data)) {
            $product = $existing->data[0];

            return $stripe->products->update($product->id, [
                'name'        => $plan['name'],
                'description' => $plan['description'] ?? null,
            ]);
        }

        return $stripe->products->create([
            'name'        => $plan['name'],
            'description' => $plan['description'] ?? null,
            'metadata'    => ['app_slug' => $slug],
        ]);
    }

    private function findOrCreatePrice(
        Product $product,
        array $plan,
        string $currency,
        int $unitAmount,
    ): Price {
        $stripe = Cashier::stripe();

        $existing = $stripe->prices->all([
            'lookup_keys' => [$plan['lookup_key']],
            'active'      => true,
            'limit'       => 1,
        ]);

        if (! empty($existing->data)) {
            $price = $existing->data[0];

            // Amount matches → nothing to do.
            if ($price->unit_amount === $unitAmount && $price->currency === $currency) {
                return $price;
            }

            // Amount drifted → Stripe prices are immutable, so create a new
            // one and transfer the lookup_key to it.
            $this->line("    <fg=yellow>amount drifted</> ({$price->unit_amount} → {$unitAmount}); creating new price");

            return $stripe->prices->create([
                'product'             => $product->id,
                'unit_amount'         => $unitAmount,
                'currency'            => $currency,
                'recurring'           => ['interval' => 'month'],
                'lookup_key'          => $plan['lookup_key'],
                'transfer_lookup_key' => true,
            ]);
        }

        return $stripe->prices->create([
            'product'     => $product->id,
            'unit_amount' => $unitAmount,
            'currency'    => $currency,
            'recurring'   => ['interval' => 'month'],
            'lookup_key'  => $plan['lookup_key'],
        ]);
    }
}