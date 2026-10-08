import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { BorderBeamButton } from '@/components/ui/border-beam-button';
import { IntroDisclosure, type IntroStep } from '@/components/intro-disclosure';

type Status = 'pending' | 'ready' | 'completed';

type Props = {
    token: string;
    status: Status;
    plan: { name: string; badge: string | null };
    perks: IntroStep[];
};

function csrfToken(): string {
    const match = document.cookie.match(/(^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : '';
}

export default function BillingSuccess({
    token,
    status: initialStatus,
    plan,
    perks,
}: Props) {
    const [status, setStatus] = useState<Status>(initialStatus);
    const [tourOpen, setTourOpen] = useState(false);
    const [tourFinished, setTourFinished] = useState(
        initialStatus === 'completed',
    );

    useEffect(() => {
        if (status !== 'pending') return;

        let cancelled = false;

        const tick = async () => {
            try {
                const res = await fetch(`/billing/success/${token}/status`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });

                if (!res.ok) return;

                const data: { status: Status } = await res.json();
                if (!cancelled && data.status !== 'pending') {
                    setStatus(data.status);
                }
            } catch {
                // retry next tick
            }
        };

        const interval = setInterval(tick, 1500);
        tick();

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [status, token]);

    useEffect(() => {
        if (status === 'ready' && !tourFinished) {
            const t = setTimeout(() => setTourOpen(true), 400);
            return () => clearTimeout(t);
        }
    }, [status, tourFinished]);

    const handleTourFinish = async () => {
        setTourFinished(true);

        try {
            await fetch(`/billing/success/${token}/complete`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': csrfToken(),
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
            });
        } catch {
            // Non-fatal.
        }
    };

    return (
        <>
            <Head title="Subscription confirmed" />

            <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
                {status === 'pending' && (
                    <>
                        <Loader2 className="size-12 animate-spin text-primary" />
                        <h1 className="text-2xl font-semibold">
                            Finalizing your subscription…
                        </h1>
                        <p className="max-w-md text-muted-foreground">
                            We’re waiting for Stripe to confirm your payment.
                            This usually takes just a few seconds — please keep
                            this page open.
                        </p>
                    </>
                )}

                {status !== 'pending' && !tourFinished && (
                    <>
                        <CheckCircle2 className="size-12 text-emerald-500" />
                        <h1 className="text-2xl font-semibold">
                            You’re on {plan.name}!
                        </h1>
                        <p className="max-w-md text-muted-foreground">
                            Your subscription is active. Let’s take a quick
                            tour of your new perks.
                        </p>
                        <button
                            type="button"
                            onClick={() => setTourOpen(true)}
                            className="text-sm text-primary underline underline-offset-4"
                        >
                            Reopen the tour
                        </button>
                    </>
                )}

                {status !== 'pending' && tourFinished && (
                    <>
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Sparkles className="size-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            You’re all set!
                        </h1>
                        <p className="max-w-md text-muted-foreground">
                            Your {plan.name} perks are live. Jump back into the
                            community and make the most of them.
                        </p>

                        <BorderBeamButton
                            type="button"
                            variant="outline"
                            colorVariant="ocean"
                            wrapperClassName="rounded-full"
                            className="h-12 gap-2 rounded-full px-6 pr-5 text-base"
                            onClick={() => router.visit('/community')}
                        >
                            Take me back to the community
                            <ArrowRight aria-hidden className="size-4 opacity-80" />
                        </BorderBeamButton>
                    </>
                )}
            </div>

            <IntroDisclosure
                open={tourOpen}
                setOpen={(open) => {
                    setTourOpen(open);
                    if (!open && !tourFinished) {
                        handleTourFinish();
                    }
                }}
                steps={perks}
                featureId={`subscription-${token}`}
                onComplete={handleTourFinish}
            />
        </>
    );
}

BillingSuccess.layout = {
    breadcrumbs: [{ title: 'Subscription confirmed', href: '#' }],
};