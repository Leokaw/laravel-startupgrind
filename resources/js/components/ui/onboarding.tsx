import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------
 |  Context
 | ----------------------------------------------------------------- */

type OnboardingContextValue = {
    step: number;
    totalSteps: number;
    next: () => void;
    previous: () => void;
    complete: () => void;
    isFirst: boolean;
    isLast: boolean;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function useOnboarding(): OnboardingContextValue {
    const ctx = useContext(OnboardingContext);
    if (!ctx) throw new Error('useOnboarding must be used inside <Onboarding>');
    return ctx;
}

/* -----------------------------------------------------------------
 |  Root
 | ----------------------------------------------------------------- */

type OnboardingProps = {
    totalSteps: number;
    onComplete: () => void;
    children: ReactNode;
    className?: string;
};

function Onboarding({
    totalSteps,
    onComplete,
    children,
    className,
}: OnboardingProps) {
    const [step, setStep] = useState(1);

    const value = useMemo<OnboardingContextValue>(
        () => ({
            step,
            totalSteps,
            isFirst: step === 1,
            isLast: step === totalSteps,
            next: () => setStep((s) => Math.min(s + 1, totalSteps)),
            previous: () => setStep((s) => Math.max(s - 1, 1)),
            complete: onComplete,
        }),
        [step, totalSteps, onComplete],
    );

    return (
        <OnboardingContext.Provider value={value}>
            <div className={cn('flex h-full min-h-0 flex-col', className)}>
                {children}
            </div>
        </OnboardingContext.Provider>
    );
}

/* -----------------------------------------------------------------
 |  Step indicator
 | ----------------------------------------------------------------- */

function StepIndicator() {
    const { step, totalSteps } = useOnboarding();

    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => {
                const n = i + 1;
                const done = n < step;
                const active = n === step;

                return (
                    <div
                        key={n}
                        className={cn(
                            'h-1.5 flex-1 rounded-full transition-all duration-500 ease-out',
                            done && 'bg-primary',
                            active && 'bg-primary/60',
                            !done && !active && 'bg-muted',
                        )}
                    />
                );
            })}
        </div>
    );
}

/* -----------------------------------------------------------------
 |  Step
 |
 |  variant="split"     → image left, content right (steps 2–6)
 |  variant="centered"  → full-width, no image column (step 1)
 | ----------------------------------------------------------------- */

type StepProps = {
    step: number;
    media?: ReactNode;
    children: ReactNode;
    variant?: 'split' | 'centered';
};

function Step({ step, media, children, variant = 'split' }: StepProps) {
    const { step: current } = useOnboarding();
    if (current !== step) return null;

    if (variant === 'centered') {
        return (
            <div
                className={cn(
                    'flex h-full min-h-0 flex-col gap-6 p-6 md:p-8',
                    'animate-in fade-in slide-in-from-bottom-3',
                    'duration-300 ease-out',
                    'motion-reduce:animate-none',
                )}
            >
                {children}
            </div>
        );
    }

    return (
        <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-2">
            <div className="relative hidden h-full overflow-hidden bg-muted/40 md:block">
                <div
                    className={cn(
                        'h-full w-full',
                        'animate-in fade-in duration-500 ease-out',
                        'motion-reduce:animate-none',
                    )}
                >
                    {media}
                </div>
            </div>

            <div className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain">
                <div
                    className={cn(
                        'flex flex-col gap-6 p-8 md:p-10',
                        'animate-in fade-in slide-in-from-bottom-3',
                        'duration-300 ease-out',
                        'motion-reduce:animate-none',
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

/* -----------------------------------------------------------------
 |  Header
 | ----------------------------------------------------------------- */

function Header({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

/* -----------------------------------------------------------------
 |  Navigation
 |
 |  Two equal-width pill buttons, matching step 1's footer. Both
 |  variants (step 1's local footer + this shared one for 2–6) now
 |  look identical.
 | ----------------------------------------------------------------- */

type NavigationProps = {
    completeLabel?: string;
    nextLabel?: string;
    previousLabel?: string;
    onCompleteOverride?: () => void;
    nextDisabled?: boolean;
};

function Navigation({
    completeLabel = 'Complete',
    nextLabel = 'Next',
    previousLabel = 'Back',
    onCompleteOverride,
    nextDisabled = false,
}: NavigationProps) {
    const { isFirst, isLast, next, previous, complete } = useOnboarding();

    return (
        <div className="flex gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={previous}
                disabled={isFirst}
                className="h-11 flex-1 rounded-full text-sm"
            >
                <ArrowLeft className="size-4" />
                {previousLabel}
            </Button>

            {isLast ? (
                <Button
                    type="button"
                    onClick={onCompleteOverride ?? complete}
                    className="h-11 flex-1 gap-2 rounded-full text-sm"
                >
                    <Check className="size-4" />
                    {completeLabel}
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={next}
                    disabled={nextDisabled}
                    className="h-11 flex-1 gap-2 rounded-full text-sm"
                >
                    {nextLabel}
                    <ArrowRight className="size-4" />
                </Button>
            )}
        </div>
    );
}

export {
    Onboarding,
    StepIndicator,
    Step,
    Header,
    Navigation,
    useOnboarding,
};