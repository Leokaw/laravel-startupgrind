import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
    Header,
    Navigation,
    Onboarding,
    Step,
    StepIndicator,
    useOnboarding,
} from '@/components/ui/onboarding';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
    FEATURES,
    GOALS,
    INDUSTRIES,
    ROLES,
    TIPS,
    TOTAL_STEPS,
    useOnboardingFlow,
    type ChoiceGroupItem,
    type Feature,
} from '@/components/onboarding/use-onboarding-flow';
import AppLogoIcon from './app-logo-icon';

/* =================================================================
 |  Shared types
 | ================================================================= */

type OnboardingShared = {
    required: boolean;
    categories: Record<string, string>;
} | null;

/* =================================================================
 |  Atoms
 | ================================================================= */

/**
 * Step image used on the left column of split steps (2–6).
 * Darkened slightly so it doesn't compete with the content on the
 * right — a subtle brightness filter + gradient overlay.
 */
function StepImage({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative h-full w-full">
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover brightness-[0.72]"
                draggable={false}
                loading="lazy"
            />
            {/* Soft vignette so the edges blend into the surface */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        </div>
    );
}

function Dots({
    count,
    value,
    onChange,
}: {
    count: number;
    value: number;
    onChange: (i: number) => void;
}) {
    return (
        <div className="flex items-center justify-center gap-2 pt-1">
            {Array.from({ length: count }).map((_, i) => (
                <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => onChange(i)}
                    className={cn(
                        'size-2 rounded-full transition-all duration-200',
                        value === i
                            ? 'bg-foreground'
                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
                    )}
                />
            ))}
        </div>
    );
}

/* =================================================================
 |  Choice group
 | ================================================================= */

type ChoiceGroupProps = {
    name: string;
    value: string | null;
    onChange: (v: string) => void;
    options: ChoiceGroupItem[];
    columns?: 1 | 2 | 3;
};

function ChoiceGroup({
    name,
    value,
    onChange,
    options,
    columns = 2,
}: ChoiceGroupProps) {
    return (
        <div
            role="radiogroup"
            aria-label={name}
            className={cn(
                'grid gap-2.5',
                columns === 1 && 'grid-cols-1',
                columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                columns === 3 && 'grid-cols-2 sm:grid-cols-3',
            )}
        >
            {options.map((option) => {
                const selected = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm',
                            'transition-all duration-200 ease-out',
                            'hover:-translate-y-0.5 hover:shadow-sm',
                            'active:translate-y-0 active:scale-[0.98]',
                            selected
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-primary/40 hover:bg-muted/50',
                        )}
                    >
                        {option.icon && (
                            <span
                                className={cn(
                                    'mt-0.5 shrink-0 transition-colors',
                                    selected
                                        ? 'text-primary'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {option.icon}
                            </span>
                        )}

                        <span className="flex-1">
                            <span className="block font-medium">
                                {option.label}
                            </span>
                            {option.description && (
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {option.description}
                                </span>
                            )}
                        </span>

                        {selected && (
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/* =================================================================
 |  Feature carousel (step 1)
 | ================================================================= */

function FeatureCarousel({
    features,
    value,
    onChange,
}: {
    features: Feature[];
    value: number;
    onChange: (i: number) => void;
}) {
    return (
        <div className="grid h-full min-h-0 grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-8">
            {/* Left — feature list */}
            <div className="order-2 flex flex-col justify-center gap-2.5 md:order-1">
                {features.map((feature, i) => {
                    const isActive = value === i;

                    return (
                        <button
                            key={feature.title}
                            type="button"
                            onClick={() => onChange(i)}
                            className={cn(
                                'flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ease-out',
                                isActive
                                    ? 'border-border bg-muted/60 shadow-sm'
                                    : 'border-transparent hover:bg-muted/40',
                            )}
                        >
                            <span
                                className={cn(
                                    'mt-0.5 shrink-0 transition-colors',
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {feature.icon}
                            </span>
                            <span className="flex-1">
                                <span
                                    className={cn(
                                        'block text-sm font-semibold transition-colors',
                                        isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {feature.title}
                                </span>
                                {isActive && (
                                    <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Right — preview image, fills the row */}
            <div className="order-1 min-h-0 md:order-2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted shadow-sm md:aspect-auto md:h-full">
                    {features.map((feature, i) => (
                        <img
                            key={feature.title}
                            src={feature.image}
                            alt={feature.title}
                            className={cn(
                                'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
                                value === i
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-105',
                            )}
                            draggable={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =================================================================
 |  Tips
 | ================================================================= */

function TipsList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-4">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {i + 1}
                    </span>
                    <span className="leading-relaxed text-muted-foreground">
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    );
}

/* =================================================================
 |  Step 1 — full-width carousel
 | ================================================================= */

function StepOneCarousel({
    featureIndex,
    selectFeature,
    allFeaturesVisited,
}: {
    featureIndex: number;
    selectFeature: (i: number) => void;
    allFeaturesVisited: boolean;
}) {
    const { next } = useOnboarding();

    return (
        <Step step={1} variant="centered">
            <div className="space-y-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <AppLogoIcon className="size-8 fill-current text-primary" />
                </div>
                <p className="text-base text-muted-foreground md:text-lg">
                    Here's a quick look at what you can do.
                </p>
                <Dots
                    count={FEATURES.length}
                    value={featureIndex}
                    onChange={selectFeature}
                />
            </div>

            <div className="flex-1">
                <FeatureCarousel
                    features={FEATURES}
                    value={featureIndex}
                    onChange={selectFeature}
                />
            </div>

            <div className="flex flex-col gap-2 pt-2">
                {!allFeaturesVisited && (
                    <p className="text-center text-xs text-muted-foreground">
                        Explore all {FEATURES.length} to continue
                    </p>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        disabled
                        className="h-11 flex-1 rounded-full text-sm"
                    >
                        Back
                    </Button>
                    <Button
                        type="button"
                        onClick={next}
                        disabled={!allFeaturesVisited}
                        className="h-11 flex-1 gap-2 rounded-full text-sm"
                    >
                        Next
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>
        </Step>
    );
}

/* =================================================================
 |  Steps 2–6 + footer
 | ================================================================= */

type StepsProps = {
    flow: ReturnType<typeof useOnboardingFlow>;
};

function Steps({ flow }: StepsProps) {
    const { step } = useOnboarding();

    const canProceed = (() => {
        switch (step) {
            case 1:
                return flow.allFeaturesVisited;
            case 2:
                return flow.role !== null;
            case 3:
                return flow.goal !== null;
            case 4:
                return flow.industry !== null;
            case 5:
                return flow.description.trim().length > 0;
            case 6:
            default:
                return true;
        }
    })();

    return (
        <>
            {/* Step indicator (hidden on step 1) */}
            {step !== 1 && (
                <div className="shrink-0 px-8 pt-6 md:px-10">
                    <StepIndicator />
                </div>
            )}

            {/* Middle */}
            <div className="min-h-0 flex-1">
                <StepOneCarousel
                    featureIndex={flow.featureIndex}
                    selectFeature={flow.selectFeature}
                    allFeaturesVisited={flow.allFeaturesVisited}
                />

                <Step
                    step={2}
                    media={
                        <StepImage
                            src="/onboarding/step2.webp"
                            alt="Choose your role"
                        />
                    }
                >
                    <Header
                        title="What best describes you?"
                        description="We use this to surface the right people."
                    />
                    <ChoiceGroup
                        name="role"
                        value={flow.role}
                        onChange={flow.setRole}
                        options={ROLES}
                        columns={2}
                    />
                </Step>

                <Step
                    step={3}
                    media={
                        <StepImage
                            src="/onboarding/step3.webp"
                            alt="Set your goal"
                        />
                    }
                >
                    <Header
                        title="What are you here to do?"
                        description="Pick one — you can change it any time."
                    />
                    <ChoiceGroup
                        name="goal"
                        value={flow.goal}
                        onChange={flow.setGoal}
                        options={GOALS}
                        columns={2}
                    />
                </Step>

                <Step
                    step={4}
                    media={
                        <StepImage
                            src="/onboarding/step4.webp"
                            alt="Pick your industry"
                        />
                    }
                >
                    <Header
                        title="Which industry are you in?"
                        description="This helps us match you with the right events and people."
                    />
                    <ChoiceGroup
                        name="industry"
                        value={flow.industry}
                        onChange={flow.setIndustry}
                        options={INDUSTRIES}
                        columns={2}
                    />
                </Step>

                <Step
                    step={5}
                    media={
                        <StepImage
                            src="/onboarding/step6.png"
                            alt="Tell us about yourself"
                        />
                    }
                >
                    <Header
                        title="Tell us about yourself"
                        description="One or two lines is plenty. This shows up on your profile."
                    />
                    <textarea
                        value={flow.description}
                        onChange={(e) => flow.setDescription(e.target.value)}
                        placeholder="Founder building in fintech. Based in Budapest. Previously at…"
                        rows={4}
                        maxLength={500}
                        className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="text-right text-xs text-muted-foreground">
                        {flow.description.length} / 500
                    </p>
                </Step>

                <Step
                    step={6}
                    media={
                        <StepImage
                            src="/onboarding/step7.png"
                            alt="You're all set"
                        />
                    }
                >
                    <Header
                        title="You're all set"
                        description="A few tips to get the most out of the community."
                    />
                    <TipsList items={TIPS} />
                </Step>
            </div>

            {/* Footer (hidden on step 1) */}
            {step !== 1 && (
                <div className="shrink-0 border-t bg-background/60 px-8 py-4 backdrop-blur-sm md:px-10">
                    <Navigation
                        completeLabel={flow.submitting ? 'Finishing…' : 'Finish'}
                        onCompleteOverride={flow.submit}
                        nextDisabled={!canProceed}
                    />
                </div>
            )}
        </>
    );
}

/* =================================================================
 |  Modal wrapper
 | ================================================================= */

type AppOnboardingProps = {
    open: boolean;
    categories: Record<string, string>;
    onClose: () => void;
};

export function AppOnboarding({
    open,
    categories,
    onClose,
}: AppOnboardingProps) {
    const flow = useOnboardingFlow({ categories, onClose });

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent
                className={cn(
                    'w-[95vw] max-w-[95vw]',
                    'sm:max-w-2xl',
                    'md:max-w-4xl',
                    'lg:max-w-6xl',
                    'xl:max-w-7xl',
                    'overflow-hidden p-0',
                )}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                showCloseButton={false}
            >
                <Onboarding
                    totalSteps={TOTAL_STEPS}
                    onComplete={() => {}}
                    className="h-[560px] sm:h-[600px] md:h-[640px] lg:h-[680px] xl:h-[720px]"
                >
                    <Steps flow={flow} />
                </Onboarding>
            </DialogContent>
        </Dialog>
    );
}

/* =================================================================
 |  Gate
 | ================================================================= */

export function OnboardingGate() {
    const { onboarding } = usePage<{ onboarding: OnboardingShared }>().props;
    const [dismissed, setDismissed] = useState(false);

    if (!onboarding?.required || dismissed) return null;

    return (
        <AppOnboarding
            open
            categories={onboarding.categories}
            onClose={() => setDismissed(true)}
        />
    );
}