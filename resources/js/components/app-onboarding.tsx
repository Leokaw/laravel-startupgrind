import { router, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import {
    Header,
    Navigation,
    Onboarding,
    Step,
    StepIndicator,
} from '@/components/ui/onboarding';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/* =================================================================
 |  Shared types
 | ================================================================= */

type OnboardingShared = {
    required: boolean;
    categories: Record<string, string>;
} | null;

/* =================================================================
 |  Placeholder image
 | ================================================================= */

function StepImage({ src, alt }: { src: string; alt: string }) {
    return (
        <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            draggable={false}
            loading="lazy"
        />
    );
}

/* =================================================================
 |  Choice group — radio list
 | ================================================================= */

type ChoiceGroupItem = {
    value: string;
    label: string;
    description?: string;
    icon?: ReactNode;
};

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
 |  Feature carousel — step 1 hero
 | ================================================================= */

type Feature = {
    title: string;
    description: string;
    image: string;
};

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="order-2 flex flex-col gap-3 md:order-1">
                {features.map((feature, i) => {
                    const isActive = value === i;

                    return (
                        <button
                            key={feature.title}
                            type="button"
                            onClick={() => onChange(i)}
                            className={cn(
                                'flex items-start gap-3 rounded-xl border p-4 text-left',
                                'transition-all duration-200 ease-out',
                                isActive
                                    ? 'border-primary/30 bg-primary/5'
                                    : 'border-transparent hover:bg-muted/60',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground',
                                )}
                            >
                                {i + 1}
                            </span>
                            <span className="flex-1">
                                <span className="block text-sm font-medium">
                                    {feature.title}
                                </span>
                                {isActive && (
                                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="order-1 md:order-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
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
 |  Tips list — step 6
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
 |  Config
 | ================================================================= */

const FEATURES: Feature[] = [
    {
        title: 'Discover your people',
        description:
            'Search founders, investors, and operators by role, stage, industry, and city — then reach out directly.',
        image: 'https://placehold.co/800x600/4f46e5/ffffff?text=Discover',
    },
    {
        title: 'Warm intros, no cold DMs',
        description:
            'Send consent-based intro requests. If the other person accepts, contact details are shared — no exposed emails.',
        image: 'https://placehold.co/800x600/7c3aed/ffffff?text=Warm+Intros',
    },
    {
        title: 'Show up where it matters',
        description:
            'RSVP to chapter events and the global conference. See who else is attending before you walk in.',
        image: 'https://placehold.co/800x600/0891b2/ffffff?text=Events',
    },
];

const ROLES: ChoiceGroupItem[] = [
    { value: 'founder', label: 'Founder', description: 'Building a company' },
    { value: 'investor', label: 'Investor', description: 'Backing founders' },
    { value: 'operator', label: 'Operator', description: 'Scaling teams' },
    { value: 'freelancer', label: 'Freelancer', description: 'Available for hire' },
    { value: 'designer', label: 'Designer', description: 'Design & brand' },
    { value: 'developer', label: 'Developer', description: 'Building product' },
];

const GOALS: ChoiceGroupItem[] = [
    { value: 'raise', label: 'Raise funds' },
    { value: 'cofounder', label: 'Find a co-founder' },
    { value: 'hire', label: 'Hire talent' },
    { value: 'network', label: 'Grow my network' },
    { value: 'learn', label: 'Learn from others' },
    { value: 'events', label: 'Find events' },
];

const INDUSTRIES: ChoiceGroupItem[] = [
    { value: 'fintech', label: 'Fintech' },
    { value: 'healthtech', label: 'Healthtech' },
    { value: 'ai', label: 'AI & ML' },
    { value: 'saas', label: 'SaaS' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'climate', label: 'Climate' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'hardware', label: 'Hardware' },
];

const TIPS: string[] = [
    'Complete your profile — a short description and a photo go a long way.',
    'Use saved searches to get notified when someone matching your filters joins.',
    'RSVP early to popular chapter events. Spots fill up fast.',
    'Warm intros take a couple of days. Plan ahead before big conferences.',
];

/* =================================================================
 |  Steps
 | ================================================================= */

type StepsProps = {
    categories: Record<string, string>;
    onSubmit: (payload: {
        area_of_work: string | null;
        description: string | null;
    }) => void;
    onSkip: () => void;
    submitting: boolean;
};

function Steps({ categories, onSubmit, onSkip, submitting }: StepsProps) {
    const [featureIndex, setFeatureIndex] = useState(0);
    const [role, setRole] = useState<string | null>(null);
    const [goal, setGoal] = useState<string | null>(null);
    const [industry, setIndustry] = useState<string | null>(null);
    const [description, setDescription] = useState('');

    const resolvedAreaOfWork =
        industry && categories[industry] !== undefined ? industry : null;

    return (
        <>
            {/* Fixed top — step indicator */}
            <div className="shrink-0 px-8 pt-6 md:px-10">
                <StepIndicator />
            </div>

            {/* Middle — takes remaining height, contains the step grid */}
            <div className="min-h-0 flex-1">
                <Step
                    step={1}
                    media={
                        <StepImage
                            src="https://placehold.co/900x1400/4f46e5/ffffff?text=1.+Welcome"
                            alt="Welcome"
                        />
                    }
                >
                    <Header
                        title="Welcome to Startup Grind"
                        description="Here's a quick look at what you can do."
                    />
                    <FeatureCarousel
                        features={FEATURES}
                        value={featureIndex}
                        onChange={setFeatureIndex}
                    />
                </Step>

                <Step
                    step={2}
                    media={
                        <StepImage
                            src="https://placehold.co/900x1400/7c3aed/ffffff?text=2.+Your+Role"
                            alt=""
                        />
                    }
                >
                    <Header
                        title="What best describes you?"
                        description="We use this to surface the right people."
                    />
                    <ChoiceGroup
                        name="role"
                        value={role}
                        onChange={setRole}
                        options={ROLES}
                        columns={2}
                    />
                </Step>

                <Step
                    step={3}
                    media={
                        <StepImage
                            src="https://placehold.co/900x1400/0d9488/ffffff?text=3.+Your+Goal"
                            alt=""
                        />
                    }
                >
                    <Header
                        title="What are you here to do?"
                        description="Pick one — you can change it any time."
                    />
                    <ChoiceGroup
                        name="goal"
                        value={goal}
                        onChange={setGoal}
                        options={GOALS}
                        columns={2}
                    />
                </Step>

                <Step
                    step={4}
                    media={
                        <StepImage
                            src="https://placehold.co/900x1400/d97706/ffffff?text=4.+Industry"
                            alt=""
                        />
                    }
                >
                    <Header
                        title="Which industry are you in?"
                        description="This helps us match you with the right events and people."
                    />
                    <ChoiceGroup
                        name="industry"
                        value={industry}
                        onChange={setIndustry}
                        options={INDUSTRIES}
                        columns={2}
                    />
                </Step>

                <Step
                    step={5}
                    media={
                        <StepImage
                            src="https://placehold.co/900x1400/db2777/ffffff?text=5.+About+You"
                            alt=""
                        />
                    }
                >
                    <Header
                        title="Tell us about yourself"
                        description="One or two lines is plenty. This shows up on your profile."
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Founder building in fintech. Based in Budapest. Previously at…"
                        rows={4}
                        maxLength={500}
                        className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="text-right text-xs text-muted-foreground">
                        {description.length} / 500
                    </p>
                </Step>

                <Step
                    step={6}
                    media={
                        <StepImage
                            src="https://placehold.co/900x1400/0284c7/ffffff?text=6.+You're+Ready"
                            alt=""
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

            {/* Fixed bottom — skip + navigation */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-background/60 px-8 py-4 backdrop-blur-sm md:px-10">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onSkip}
                    disabled={submitting}
                    className="text-xs text-muted-foreground"
                >
                    Skip for now
                </Button>

                <Navigation
                    completeLabel={submitting ? 'Finishing…' : 'Finish'}
                    onCompleteOverride={() =>
                        onSubmit({
                            area_of_work: resolvedAreaOfWork,
                            description: description.trim() || null,
                        })
                    }
                />
            </div>
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
    const [submitting, setSubmitting] = useState(false);

    const submit = (payload: {
        area_of_work: string | null;
        description: string | null;
    }) => {
        setSubmitting(true);
        router.post('/onboarding/complete', payload, {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => onClose(),
        });
    };

    const skip = () => {
        setSubmitting(true);
        router.post(
            '/onboarding/skip',
            {},
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
                onSuccess: () => onClose(),
            },
        );
    };

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
                    totalSteps={6}
                    onComplete={() => {}}
                    className="h-[640px] max-h-[88vh]"
                >
                    <Steps
                        categories={categories}
                        onSubmit={submit}
                        onSkip={skip}
                        submitting={submitting}
                    />
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