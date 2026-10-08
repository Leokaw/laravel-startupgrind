import {
    ArrowRightLeft,
    BadgeCheck,
    CalendarCheck,
    CalendarClock,
    CreditCard,
    Gift,
    Hourglass,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type Subscription = {
    status: string;
    stripe_price: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    ends_at: string | null;
    has_trial: boolean;
    trial_started_at: string | null;
    trial_ends_at: string | null;
    on_trial: boolean;
    pending_plan: { slug: string; name: string } | null;
    on_grace_period: boolean;
    canceled: boolean;
};

export type Plan = {
    slug: string;
    name: string;
    price: number;
    badge: string | null;
    features: string[];
};

type Props = {
    subscription: Subscription;
    plan: Plan | undefined;
    onCancel: () => void;
    onResume: () => void;
    processing?: boolean;
};

/** Null-safe date formatter. Returns "—" for null, undefined, or invalid input. */
function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function relativeDays(iso: string | null | undefined): string {
    if (!iso) return '';

    const ms = new Date(iso).getTime();
    if (Number.isNaN(ms)) return '';

    const diff = ms - Date.now();
    const days = Math.ceil(diff / 86_400_000);

    if (days < 0) {
        const n = Math.abs(days);
        return `${n} day${n === 1 ? '' : 's'} ago`;
    }
    if (days === 0) return 'today';
    if (days === 1) return 'in 1 day';
    return `in ${days} days`;
}

function cycleProgress(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const now = Date.now();

    if (e <= s) return 100;

    return Math.min(100, Math.max(0, Math.round(((now - s) / (e - s)) * 100)));
}

export function SubscriptionOverview({
    subscription,
    plan,
    onCancel,
    onResume,
    processing = false,
}: Props) {
    const isEnding = subscription.on_grace_period;
    const isActive = subscription.status === 'active' && !isEnding;

    const upcomingDate = subscription.ends_at ?? subscription.current_period_end;
    const upcomingLabel = isEnding
        ? 'Access ends'
        : subscription.on_trial
          ? 'First charge'
          : 'Next renewal';

    const progress =
        subscription.current_period_start && subscription.current_period_end
            ? cycleProgress(
                  subscription.current_period_start,
                  subscription.current_period_end,
              )
            : 0;

    const trialInProgress = subscription.on_trial;
    const trialPassed =
        !trialInProgress &&
        subscription.trial_ends_at !== null &&
        new Date(subscription.trial_ends_at).getTime() < Date.now();

    return (
        <Card className="mb-6 overflow-hidden rounded-[2rem] p-0">
            {/* Header band — accent color reflects state */}
            <div
                className={cn(
                    'flex flex-wrap items-start justify-between gap-4 border-b px-8 py-6',
                    isEnding
                        ? 'border-amber-500/20 bg-amber-500/5'
                        : 'border-emerald-500/20 bg-emerald-500/5',
                )}
            >
                <div>
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <CreditCard className="size-3.5" />
                        Your subscription
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                        {plan?.name ?? 'Current plan'}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {plan && plan.price > 0
                            ? `${plan.price.toLocaleString('hu-HU')} Ft / month`
                            : 'Free tier'}
                    </p>
                </div>

                <Badge
                    variant="outline"
                    className={cn(
                        'rounded-full px-3 py-1 text-sm',
                        isEnding
                            ? 'border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400'
                            : subscription.on_trial
                              ? 'border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400'
                              : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                    )}
                >
                    {isEnding
                        ? 'Cancelling'
                        : subscription.on_trial
                          ? 'On trial'
                          : 'Active'}
                </Badge>
            </div>

            <div className="space-y-6 px-8 py-6">
                {/* Pending plan switch — prominent, always at the top */}
                {subscription.pending_plan && (
                    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                            <ArrowRightLeft className="size-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                Plan switch scheduled
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {subscription.current_period_end ? (
                                    <>
                                        Your plan will automatically switch to{' '}
                                        <span className="font-medium text-foreground">
                                            {subscription.pending_plan.name}
                                        </span>{' '}
                                        on{' '}
                                        <span className="font-medium text-foreground">
                                            {formatDate(subscription.current_period_end)}
                                        </span>
                                        . No action required, you'll keep your
                                        current perks until then.
                                    </>
                                ) : (
                                    <>
                                        Your plan will automatically switch to{' '}
                                        <span className="font-medium text-foreground">
                                            {subscription.pending_plan.name}
                                        </span>{' '}
                                        at the start of your next billing cycle.
                                        No action required, you'll keep your
                                        current perks until then.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Trial section — only when a trial exists */}
                {subscription.has_trial && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <Hourglass className="size-3.5" />
                            Trial
                            {trialInProgress && (
                                <span className="ml-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-400">
                                    In progress
                                </span>
                            )}
                            {trialPassed && (
                                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                    Ended
                                </span>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {subscription.trial_started_at && (
                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        <Gift className="size-3.5" />
                                        Trial started
                                    </div>
                                    <p className="mt-2 text-base font-medium">
                                        {formatDate(subscription.trial_started_at)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {relativeDays(subscription.trial_started_at)}
                                    </p>
                                </div>
                            )}

                            {subscription.trial_ends_at && (
                                <div
                                    className={cn(
                                        'rounded-xl border p-4',
                                        trialInProgress
                                            ? 'border-blue-500/20 bg-blue-500/5'
                                            : 'bg-muted/30',
                                    )}
                                >
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        <Hourglass className="size-3.5" />
                                        {trialInProgress ? 'Trial ends' : 'Trial ended'}
                                    </div>
                                    <p className="mt-2 text-base font-medium">
                                        {formatDate(subscription.trial_ends_at)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {relativeDays(subscription.trial_ends_at)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Regular billing dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {subscription.current_period_start && (
                        <div className="rounded-xl border bg-muted/30 p-4">
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <CalendarCheck className="size-3.5" />
                                Billing period started
                            </div>
                            <p className="mt-2 text-base font-medium">
                                {formatDate(subscription.current_period_start)}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {relativeDays(subscription.current_period_start)}
                            </p>
                        </div>
                    )}

                    {upcomingDate && (
                        <div
                            className={cn(
                                'rounded-xl border p-4',
                                isEnding
                                    ? 'border-amber-500/20 bg-amber-500/5'
                                    : 'border-primary/20 bg-primary/5',
                            )}
                        >
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <CalendarClock className="size-3.5" />
                                {upcomingLabel}
                            </div>
                            <p className="mt-2 text-base font-medium">
                                {formatDate(upcomingDate)}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {relativeDays(upcomingDate)}
                                {!isEnding && ' · auto-renews'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Cycle progress bar */}
                {isActive &&
                    subscription.current_period_start &&
                    subscription.current_period_end && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Current billing cycle</span>
                                <span className="tabular-nums">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                {/* Perks */}
                {plan && plan.features.length > 0 && (
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <Sparkles className="size-3.5" />
                            What's included
                        </div>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {plan.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Explanation + actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                        {isEnding
                            ? "You'll keep access until the date above. After that, you'll drop to the Free tier."
                            : subscription.pending_plan
                              ? subscription.current_period_end
                                  ? `Your plan switches to ${subscription.pending_plan.name} on ${formatDate(subscription.current_period_end)}.`
                                  : `Your plan will switch to ${subscription.pending_plan.name} at your next billing cycle.`
                              : 'Your subscription renews automatically on the card you used to subscribe.'}
                    </p>

                    {isEnding ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onResume}
                            disabled={processing}
                        >
                            Resume subscription
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={onCancel}
                            disabled={processing}
                        >
                            Cancel subscription
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}