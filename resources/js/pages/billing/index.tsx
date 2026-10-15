import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertTriangle,
    Building2,
    CheckCircle2,
    CircleCheck,
    Star,
    XCircle,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { BorderBeamButton } from '@/components/ui/border-beam-button';
import {
    SubscriptionOverview,
    type Subscription,
} from './subscription-overview';

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

type FlashToast = {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
};

type Props = {
    plans: Plan[];
    currentPlan: string | null;
    subscription: Subscription | null;
    flash: {
        success: string | null;
        error: string | null;
        checkout: 'success' | 'cancelled' | null;
        toast: FlashToast | null;
    };
};

const ICONS: Record<Plan['icon'], LucideIcon> = {
    star: Star,
    zap: Zap,
    building: Building2,
};

const TOAST_ID = 'billing-action';

const scrollToTop = () => {
    const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth',
    });
};

export default function Billing({
    plans,
    currentPlan,
    subscription,
    flash,
}: Props) {
    const [processing, setProcessing] = useState(false);

    const subscribe = (plan: Plan) => {
        if (plan.slug === 'starter') return;
        if (plan.slug === currentPlan) return;
        if (processing) return;

        setProcessing(true);
        toast.loading('Updating your plan…', { id: TOAST_ID });
        scrollToTop();

        router.post(
            '/billing/subscribe',
            { plan: plan.slug },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    toast.dismiss(TOAST_ID);
                },
                onError: () => {
                    toast.error('Could not update plan. Please try again.', {
                        id: TOAST_ID,
                    });
                },
            },
        );
    };

    const cancel = () => {
        if (processing) return;

        setProcessing(true);
        toast.loading('Cancelling subscription…', { id: TOAST_ID });
        scrollToTop();

        router.post(
            '/billing/cancel',
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    toast.dismiss(TOAST_ID);
                },
                onError: () => {
                    toast.error('Could not cancel. Please try again.', {
                        id: TOAST_ID,
                    });
                },
            },
        );
    };

    const resume = () => {
        if (processing) return;

        setProcessing(true);
        toast.loading('Resuming subscription…', { id: TOAST_ID });
        scrollToTop();

        router.post(
            '/billing/resume',
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    toast.dismiss(TOAST_ID);
                },
                onError: () => {
                    toast.error('Could not resume. Please try again.', {
                        id: TOAST_ID,
                    });
                },
            },
        );
    };

    const currentPlanData = plans.find((p) => p.slug === currentPlan);

    return (
        <>
            <Head title="Billing" />

            <div className="mx-auto w-full p-4 md:p-6">
                {/* Current subscription summary — only when there is one */}
                {subscription && currentPlanData && (
                    <SubscriptionOverview
                        subscription={subscription}
                        plan={currentPlanData}
                        onCancel={cancel}
                        onResume={resume}
                        processing={processing}
                    />
                )}

                {/* Success flash — emerald */}
                {flash.success && (
                    <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50">
                        <CheckCircle2 />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* Error flash — red */}
                {flash.error && (
                    <Alert className="mb-4 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
                        <XCircle />
                        <AlertTitle>Something went wrong</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Checkout cancelled — amber */}
                {flash.checkout === 'cancelled' && (
                    <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                        <AlertTriangle />
                        <AlertTitle>Checkout cancelled</AlertTitle>
                        <AlertDescription>
                            You have not been charged. You can try again
                            whenever you're ready.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon = ICONS[plan.icon];
                        const isCurrent = plan.slug === currentPlan;
                        const isPro = plan.slug === 'pro';
                        const isFree = plan.slug === 'starter';

                        const isSwitching = Boolean(
                            currentPlan && currentPlan !== 'starter',
                        );

                        const isPrimary = isSwitching || isPro;

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
                                    </div>
                                </div>

                                {isFree ? (
                                    <Button
                                        variant="outline"
                                        className="mt-8 h-12 w-full rounded-full text-base"
                                        disabled={isCurrent}
                                    >
                                        {isCurrent
                                            ? 'Current plan'
                                            : 'Included by default'}
                                    </Button>
                                ) : isCurrent ? (
                                    <Button
                                        variant="destructive"
                                        className="mt-8 h-12 w-full rounded-full text-base"
                                        onClick={cancel}
                                        disabled={
                                            processing ||
                                            subscription?.on_grace_period
                                        }
                                    >
                                        {subscription?.on_grace_period
                                            ? 'Cancellation scheduled'
                                            : 'Cancel subscription'}
                                    </Button>
                                ) : isPrimary ? (
                                    <BorderBeamButton
                                        type="button"
                                        variant="secondary"
                                        colorVariant="colorful"
                                        beamSize="md"
                                        borderBeamClassName="mt-8 w-full!"
                                        className="h-12 w-full gap-2 rounded-full text-base font-semibold"
                                        onClick={() => subscribe(plan)}
                                        disabled={processing}
                                    >
                                        {isSwitching
                                            ? 'Switch to this plan'
                                            : 'Get started'}
                                    </BorderBeamButton>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="mt-8 h-12 w-full rounded-full text-base"
                                        onClick={() => subscribe(plan)}
                                        disabled={processing}
                                    >
                                        Get started
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