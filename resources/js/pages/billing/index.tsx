import { Head, router } from '@inertiajs/react';
import {
    Building2,
    CircleCheck,
    Star,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { SubscriptionOverview } from './subscription-overview';

type Plan = {
    slug: 'starter' | 'pro' | 'enterprise';
    name: string;
    description: string;
    price: number;
    stripe_price_id: string | null;
    icon: 'star' | 'zap' | 'building';
    badge: string | null;
    features: string[];
};

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
} | null;

type Props = {
    plans: Plan[];
    currentPlan: string | null;
    subscription: Subscription;
    flash: {
        success: string | null;
        error: string | null;
        checkout: 'success' | 'cancelled' | null;
    };
};

const ICONS: Record<Plan['icon'], LucideIcon> = {
    star: Star,
    zap: Zap,
    building: Building2,
};

export default function Billing({
    plans,
    currentPlan,
    subscription,
    flash,
}: Props) {
    const subscribe = (plan: Plan) => {
        if (plan.slug === 'starter') return;
        if (plan.slug === currentPlan) return;

        router.post(
            '/billing/subscribe',
            { plan: plan.slug },
            { preserveScroll: true },
        );
    };

    const cancel = () => {
        router.post('/billing/cancel', {}, { preserveScroll: true });
    };

    const resume = () => {
        router.post('/billing/resume', {}, { preserveScroll: true });
    };

    const currentPlanData = plans.find((p) => p.slug === currentPlan);

    return (
        <>
            <Head title="Billing" />

            <div className="mx-auto w-full p-4 md:p-6">
                {flash.success && (
                    <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                        {flash.success}
                    </div>
                )}

                {flash.checkout === 'cancelled' && (
                    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                        Checkout was cancelled — you have not been charged.
                    </div>
                )}

                {/* Current subscription summary — only when there is one */}
                {subscription && currentPlanData && (
                    <SubscriptionOverview
                        subscription={subscription}
                        plan={currentPlanData}
                        onCancel={cancel}
                        onResume={resume}
                    />
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon = ICONS[plan.icon];
                        const isCurrent = plan.slug === currentPlan;
                        const isPro = plan.slug === 'pro';
                        const isFree = plan.slug === 'starter';

                        // True when the user is on a paid plan and looking at
                        // a different one — the button acts as a "switch",
                        // so we make it primary regardless of which plan it is.
                        const isSwitching = Boolean(
                            currentPlan && currentPlan !== 'starter',
                        );

                        return (
                            <Card
                                key={plan.slug}
                                className={
                                    'relative flex flex-col gap-0 rounded-[2rem] p-8' +
                                    (isPro ? ' border-primary/30 shadow-lg' : '')
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex size-14 items-center justify-center rounded-2xl border bg-muted">
                                        <Icon className="size-6 text-primary" />
                                    </div>
                                    {isCurrent ? (
                                        <Badge
                                            variant="outline"
                                            className="rounded-full border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-400"
                                        >
                                            Current plan
                                        </Badge>
                                    ) : (
                                        plan.badge && (
                                            <Badge className="rounded-full px-3 py-1 text-sm">
                                                {plan.badge}
                                            </Badge>
                                        )
                                    )}
                                </div>

                                <div className="mt-10 min-h-32">
                                    <CardTitle className="text-2xl font-semibold">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-base text-muted-foreground">
                                        {plan.description}
                                    </CardDescription>
                                </div>

                                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-5xl font-semibold tracking-tight">
                                            {plan.price.toLocaleString('hu-HU')}
                                        </span>
                                        <span className="text-2xl font-medium text-muted-foreground">
                                            Ft
                                        </span>
                                    </div>
                                    <div className="text-sm leading-snug">
                                        <p className="font-medium">Per month</p>
                                        <p className="text-muted-foreground">
                                            Plus local taxes
                                        </p>
                                    </div>
                                </div>

                                {isFree ? (
                                    <Button
                                        variant="outline"
                                        className="mt-8 h-12 w-full rounded-full text-base"
                                        disabled={isCurrent}
                                    >
                                        {isCurrent ? 'Current plan' : 'Included by default'}
                                    </Button>
                                ) : isCurrent ? (
                                    <Button
                                        variant="outline"
                                        className="mt-8 h-12 w-full rounded-full text-base"
                                        onClick={cancel}
                                        disabled={subscription?.on_grace_period}
                                    >
                                        {subscription?.on_grace_period
                                            ? 'Cancellation scheduled'
                                            : 'Cancel subscription'}
                                    </Button>
                                ) : (
                                    <Button
                                        className="mt-8 h-12 w-full rounded-full text-base"
                                        variant={isSwitching || isPro ? 'default' : 'outline'}
                                        onClick={() => subscribe(plan)}
                                    >
                                        {isSwitching
                                            ? 'Switch to this plan'
                                            : 'Get started'}
                                    </Button>
                                )}

                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-3 text-base"
                                        >
                                            <CircleCheck className="size-5 shrink-0 text-muted-foreground" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Billing.layout = {
    breadcrumbs: [{ title: 'Billing', href: '/billing' }],
};