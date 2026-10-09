import { useEffect, useState } from 'react';
import {
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Coins,
    Headset,
    Mail,
    MessageSquare,
    Shield,
    Sparkles,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type IntroStep = {
    title: string;
    short_description: string;
    full_description: string;
    icon?: string;
};

const ICONS: Record<string, LucideIcon> = {
    sparkles: Sparkles,
    coins: Coins,
    mail: Mail,
    users: Users,
    message: MessageSquare,
    badge: BadgeCheck,
    shield: Shield,
    headset: Headset,
};

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    steps: IntroStep[];
    featureId: string;
    onComplete?: () => void;
    onSkip?: () => void;
    showProgressBar?: boolean;
};

export function IntroDisclosure({
    open,
    setOpen,
    steps,
    featureId,
    onComplete,
    onSkip,
    showProgressBar = true,
}: Props) {
    const [current, setCurrent] = useState(0);
    const [dontShow, setDontShow] = useState(false);

    useEffect(() => {
        if (open) {
            setCurrent(0);
            setDontShow(false);
        }
    }, [open]);

    const step = steps[current];
    const isFirst = current === 0;
    const isLast = current === steps.length - 1;

    if (!step) return null;

    const Icon = ICONS[step.icon ?? 'sparkles'] ?? Sparkles;

    const close = (completed: boolean) => {
        if (dontShow) {
            localStorage.setItem(`feature_${featureId}`, 'true');
        }
        setOpen(false);
        (completed ? onComplete : onSkip)?.();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && close(false)}>
            <DialogContent
                showCloseButton={false}
                className="max-w-lg overflow-hidden p-0"
            >
                <div className="relative">
                    {showProgressBar && (
                        <div className="absolute inset-x-0 top-0 flex h-1 gap-1">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'h-full flex-1 transition-colors duration-300',
                                        i <= current ? 'bg-primary' : 'bg-muted',
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => close(false)}
                        className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                        aria-label="Close tour"
                    >
                        <X className="size-4" />
                    </button>

                    <div className="flex flex-col items-center gap-5 px-8 pb-6 pt-10 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Icon className="size-8 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {current + 1} of {steps.length}
                            </p>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {step.title}
                            </h2>
                            <p className="text-sm font-medium text-primary">
                                {step.short_description}
                            </p>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {step.full_description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t bg-muted/30 px-6 py-4">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                            <Checkbox
                                checked={dontShow}
                                onCheckedChange={(v) => setDontShow(!!v)}
                            />
                            Don&apos;t show again
                        </label>

                        <div className="flex items-center gap-2">
                            {!isFirst && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrent((c) => c - 1)}
                                >
                                    <ChevronLeft className="mr-1 size-4" />
                                    Back
                                </Button>
                            )}

                            {isLast ? (
                                <Button size="sm" onClick={() => close(true)}>
                                    Finish
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => setCurrent((c) => c + 1)}
                                >
                                    Next
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}