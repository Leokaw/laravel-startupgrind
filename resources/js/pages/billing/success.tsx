import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    CheckCircle2,
    Loader2,
    RotateCcw,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { BorderBeamButton } from '@/components/ui/border-beam-button';
import {
    IntroDisclosure,
    type IntroStep,
} from '@/components/intro-disclosure';

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

    // Prevent the "ready" toast from firing more than once per mount.
    const readyToastShown = useRef(initialStatus !== 'pending');

    // ----------------------------------------------------------------
    // Poll the success-token endpoint until the webhook flips it
    // from `pending` to `ready`.
    // ----------------------------------------------------------------
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

    // ----------------------------------------------------------------
    // Fire a one-time success toast when the token flips to ready.
    // ----------------------------------------------------------------
    useEffect(() => {
        if (status === 'pending') return;
        if (readyToastShown.current) return;

        readyToastShown.current = true;
        toast.success(`You're on ${plan.name}!`, {
            description: 'Your perks are active. Enjoy the tour.',
        });
    }, [status, plan.name]);

    // ----------------------------------------------------------------
    // Auto-open the tour once the webhook has confirmed payment.
    // ----------------------------------------------------------------
    useEffect(() => {
        if (status === 'ready' && !tourFinished) {
            const t = setTimeout(() => setTourOpen(true), 400);
            return () => clearTimeout(t);
        }
    }, [status, tourFinished]);

    // ----------------------------------------------------------------
    // Called exactly once, when the tour closes the first time.
    // ----------------------------------------------------------------
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
            // Non-fatal — the tour is done locally either way.
        }
    };

    const handleReplayTour = () => {
        setTourOpen(true);
    };

    return (
        <>
            <Head title="Subscription confirmed" />

            <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
                {/* ============ Pending ============ */}
                {status === 'pending' && (
                    <>
                        <Loader2 className="size-12 animate-spin text-primary" />
                        <h1 className="text-2xl font-semibold">
                            Finalizing your subscription…
                        </h1>
                        <p className="max-w-md text-muted-foreground">
                            We're waiting for Stripe to confirm your payment.
                            This usually takes just a few seconds — please keep
                            this page open.
                        </p>
                    </>
                )}

                {/* ============ Ready, tour not finished ============ */}
                {status !== 'pending' && !tourFinished && (
                    <>
                        <CheckCircle2 className="size-12 text-emerald-500" />
                        <h1 className="text-2xl font-semibold">
                            You're on {plan.name}!
                        </h1>
                        <p className="max-w-md text-muted-foreground">
                            Your subscription is active. Let's take a quick
                            tour of your new perks.
                        </p>
                        <button
                            type="button"
                            onClick={handleReplayTour}
                            className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                        >
                            <RotateCcw className="size-3.5" />
                            Reopen the tour
                        </button>
                    </>
                )}

                {/* ============ Final state ============ */}
                {status !== 'pending' && tourFinished && (
                    <>
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Sparkles className="size-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            You're all set!
                        </h1>
                        <p className="max-w-md text-muted-foreground">
                            Your {plan.name} perks are live. Jump back into the
                            community and make the most of them.
                        </p>

                        <div className="flex flex-col items-center gap-3">
                            <BorderBeamButton
                                type="button"
                                variant="outline"
                                colorVariant="ocean"
                                beamSize="md"
                                borderBeamClassName="rounded-full"
                                className="h-12 gap-2 rounded-full px-6 pr-5 text-base"
                                onClick={() => router.visit('/community')}
                            >
                                Take me back to the community
                                <ArrowRight
                                    aria-hidden
                                    className="size-4 opacity-80"
                                />
                            </BorderBeamButton>

                            <button
                                type="button"
                                onClick={handleReplayTour}
                                className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline"
                            >
                                <RotateCcw className="size-3.5" />
                                Replay the tour
                            </button>
                        </div>
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