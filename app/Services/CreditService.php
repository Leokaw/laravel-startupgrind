<?php

namespace App\Services;

use App\Enums\CreditTransactionCategory;
use App\Exceptions\InsufficientCreditsException;
use App\Models\CreditTransaction;
use App\Models\Membership;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CreditService
{
    /**
     * Debit the given amount from a membership and record a ledger entry.
     * Atomic — either the balance and the ledger both change, or neither does.
     */
    public function spend(
        Membership $membership,
        int $amount,
        CreditTransactionCategory $category,
        ?string $description = null,
        ?Model $reference = null,
        ?Purchase $purchase = null,
    ): CreditTransaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive.');
        }

        if ($category->isCredit()) {
            throw new \InvalidArgumentException(
                "Category {$category->value} is not a debit category."
            );
        }

        return DB::transaction(function () use (
            $membership, $amount, $category, $description, $reference, $purchase,
        ) {
            // Lock the row so concurrent spends can't race.
            /** @var Membership $membership */
            $membership = Membership::query()
                ->lockForUpdate()
                ->findOrFail($membership->id);

            if ($membership->credits_balance < $amount) {
                throw new InsufficientCreditsException(
                    required: $amount,
                    available: $membership->credits_balance,
                );
            }

            $balanceBefore = $membership->credits_balance;
            $membership->credits_balance -= $amount;
            $membership->save();

            return CreditTransaction::create([
                'membership_id' => $membership->id,
                'user_id'       => $membership->user_id,
                'purchase_id'   => $purchase?->id,
                'amount'        => -$amount,
                'balance_after' => $membership->credits_balance,
                'category'      => $category,
                'description'   => $description,
                'reference_type' => $reference ? $reference::class : null,
                'reference_id'   => $reference?->getKey(),
                'metadata' => [
                    'balance_before' => $balanceBefore,
                ],
            ]);
        });
    }

    /**
     * Credit the given amount to a membership and record a ledger entry.
     */
    public function grant(
        Membership $membership,
        int $amount,
        CreditTransactionCategory $category,
        ?string $description = null,
        ?Model $reference = null,
        ?Purchase $purchase = null,
    ): CreditTransaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive.');
        }

        if (! $category->isCredit()) {
            throw new \InvalidArgumentException(
                "Category {$category->value} is not a credit category."
            );
        }

        return DB::transaction(function () use (
            $membership, $amount, $category, $description, $reference, $purchase,
        ) {
            /** @var Membership $membership */
            $membership = Membership::query()
                ->lockForUpdate()
                ->findOrFail($membership->id);

            $balanceBefore = $membership->credits_balance;
            $membership->credits_balance += $amount;
            $membership->save();

            return CreditTransaction::create([
                'membership_id' => $membership->id,
                'user_id'       => $membership->user_id,
                'purchase_id'   => $purchase?->id,
                'amount'        => $amount,
                'balance_after' => $membership->credits_balance,
                'category'      => $category,
                'description'   => $description,
                'reference_type' => $reference ? $reference::class : null,
                'reference_id'   => $reference?->getKey(),
                'metadata' => [
                    'balance_before' => $balanceBefore,
                ],
            ]);
        });
    }
}