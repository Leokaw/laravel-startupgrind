import { Link } from '@inertiajs/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

const heading = ['A framework for', 'developers and agents'];

const description =
    "Laravel has opinions on everything: routing, queues, authentication, and more. That's thousands of decisions an agent doesn't have to make. The result? Clean code that anyone can understand.";

const features = [
    'Starter kits for React, Vue, and Svelte',
    'AI SDK and Boost AI assistant',
    'Database ORM, queues, routing, and more',
    'Open source ecosystem of over 30 packages',
];

const visible = { overflow: 'visible' } as const;

const PARAGRAPH_STAGGER = 0.04;
const paragraphVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: PARAGRAPH_STAGGER, delayChildren: 0.2 } },
};

const countWords = (text: string) => text.split(' ').length;
const TEXT_DONE_MS = (0.2 + (countWords(description) - 1) * PARAGRAPH_STAGGER + 0.5) * 1000;

const FADE_MS = 1400;
const FADE_STAGGER_MS = 300;

function Corner({ className }: { className: string }) {
    // Added 'hidden lg:block' so it only shows on desktop
    return <span aria-hidden className={`hidden lg:block absolute z-20 size-1.5 bg-primary ${className}`} />;
}

export default function Features() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });
    const [showExtras, setShowExtras] = useState(false);

    useEffect(() => {
        if (!inView) return;
        const timer = setTimeout(() => setShowExtras(true), TEXT_DONE_MS);
        return () => clearTimeout(timer);
    }, [inView]);

    const animate = inView ? 'visible' : 'hidden';

    return (
        <section className="relative border-b border-border bg-background overflow-x-clip">
            <style>{`
                @keyframes features-fade-in {
                    from { opacity: 0; visibility: hidden; }
                    to { opacity: 1; visibility: visible; }
                }
                .features-fade-in {
                    animation: features-fade-in ${FADE_MS}ms ease-out both;
                }
            `}</style>

            <div className="relative mx-auto max-w-7xl border-x border-border lg:px-0 px-3">
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                {/* Glow overflowing to all sides, with a deeper bottom overflow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -bottom-64 -right-32 -left-10 rounded-full bg-primary/15 blur-[120px] z-0"
                />

                {/* Content wrapper with overflow-hidden to clip the image at the borders */}
                <div className="relative overflow-hidden z-10">
                    <div className="relative grid gap-10 px-4 pt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-12 lg:pt-0">
                        {/* Left: texts */}
                        <div ref={ref} className="flex flex-col justify-center lg:py-8">
                            <h2 className="text-3xl  leading-[1] font-thin tracking-tight text-foreground sm:text-4xl">
                                {heading.map((line) => (
                                    <TextAnimate
                                        key={line}
                                        as="span"
                                        by="word"
                                        type="fadeInUp"
                                        text={line}
                                        className="text-gray-700"
                                        style={visible}
                                        animate={animate}
                                    />
                                ))}
                            </h2>

                            <TextAnimate
                                as="p"
                                by="word"
                                type="fadeInUp"
                                text={description}
                                className="mt-4 max-w-sm text-sm leading-tight text-muted-foreground sm:text-base leading-[0.9]"
                                style={visible}
                                variants={paragraphVariants}
                                animate={animate}
                            />

                            <ul
                                className={cn('mt-6 space-y-1', showExtras ? 'features-fade-in' : 'invisible opacity-0')}
                            >
                                {features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-1.5  text-sm text-foreground">
                                        <Check className="size-3.5 shrink-0 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div
                                className={cn('mt-8', showExtras ? 'features-fade-in' : 'invisible opacity-0')}
                                style={{ animationDelay: `${FADE_STAGGER_MS}ms` }}
                            >
                                <Button asChild variant="outline">
                                    <Link href="/features">
                                        Explore the framework
                                        <ArrowUpRight className="size-4 text-primary" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right: image hanging from the bottom-right corner */}
                        <div className="-mx-6 self-end pl-6 lg:mx-0 lg:-mr-12 lg:pl-0">
                            <div className="rounded-tl-[1.75rem] border-t border-l border-border bg-background">
                                <img
                                    src="/onboarding/step2.webp"
                                    alt="Platform preview"
                                    loading="lazy"
                                    draggable={false}
                                    className="block h-auto w-full rounded-tl-[1.75rem] shadow-xl  select-none brightness-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}