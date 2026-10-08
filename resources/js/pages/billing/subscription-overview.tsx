import {
    ArrowRight,
    BadgeCheck,
    CalendarClock,
    CalendarCheck,
    Coins,
    CreditCard,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Subscription = {
    status: string;
    stripe_price: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    ends_at: string | null;
    trial_ends_at: string | null;
    on_grace_period: boolean;
    on_trial: boolean;
    canceled: boolean;
};

type Plan = {
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

/** "2026. november 8." — Hungarian long form. */
function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/** "in 23 days" / "today" / "in 1 day" */
function relativeDays(iso: string): string {
    const ms = new Date(iso).getTime() - Date.now();
    const days = Math.ceil(ms / 86_400_000);

    if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    if (days === 0) return 'today';
    if (days === 1) return 'in 1 day';
    return `in ${days} days`;
}

/** Percentage of the current billing cycle that has elapsed (0–100). */
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

    // What date matters most right now?
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
                            : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                    )}
                >
                    {isEnding ? 'Cancelling' : 'Active'}
                </Badge>
            </div>

            {/* Body */}
            <div className="space-y-6 px-8 py-6">
                {/* Dates grid */}
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

                {/* Cycle progress bar — only when active and we have both dates */}
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
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Cancel subscription
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}