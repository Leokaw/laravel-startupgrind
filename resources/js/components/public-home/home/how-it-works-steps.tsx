import { MessageCircle, Send, UserPlus, Users } from 'lucide-react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import {
    FoldedCard,
    FoldedCardBorder,
    FoldedCardDescription,
    FoldedCardFold,
    FoldedCardFooter,
    FoldedCardGrid,
    FoldedCardHeading,
    FoldedCardPreview,
    FoldedCardTitle,
} from '@/components/ui/folded-card';
import { cn } from '@/lib/utils';

const steps = [
    {
        icon: UserPlus,
        title: 'Register to our community!',
        description: 'Join our global network of founders and start your journey today.',
    },
    {
        icon: Send,
        title: 'Submit your company',
        description: 'Provide your company details for a thorough evaluation by our experts.',
    },
    {
        icon: Users,
        title: 'Find your match',
        description: 'Browse and discover someone you would like to chat with.',
    },
    {
        icon: MessageCircle,
        title: 'Send a message!',
        description: 'Initiate meaningful conversations and build lasting business relationships.',
    },
];

export default function HowItWorksSteps() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <div className="flex h-full flex-col justify-center bg-muted/5 p-6 pb-12 lg:p-12">
            <div ref={ref} className="grid gap-4 sm:grid-cols-2">
                {steps.map(({ icon: Icon, title, description }, i) => (
                    <div
                        key={title}
                        className={cn(
                            'group h-full transition-[opacity,translate] duration-700 ease-out',
                            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                        )}
                        style={{ transitionDelay: inView ? `${i * 120}ms` : '0ms' }}
                    >
                        <FoldedCard className="flex h-full w-full flex-col bg-card transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
                            <FoldedCardFold />
                            <FoldedCardBorder />

                            <FoldedCardPreview className="h-24 transition-colors duration-300 group-hover:bg-primary/5 sm:h-28">
                                <FoldedCardGrid
                                    rows={3}
                                    columns={4}
                                    className="opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                                />

                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                                />

                                <span className="absolute top-3 left-3 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                                    Step {i + 1}
                                </span>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="relative flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
                                        <Icon className="size-6" />
                                    </span>
                                </div>
                            </FoldedCardPreview>

                            <FoldedCardFooter className="flex-1">
                                <FoldedCardHeading>
                                    <FoldedCardTitle className="transition-colors duration-300 group-hover:text-primary">
                                        {title}
                                    </FoldedCardTitle>
                                </FoldedCardHeading>
                                <FoldedCardDescription className='leading-tight leading-[1.1]'>{description}</FoldedCardDescription>
                            </FoldedCardFooter>
                        </FoldedCard>
                    </div>
                ))}
            </div>
        </div>
    );
}