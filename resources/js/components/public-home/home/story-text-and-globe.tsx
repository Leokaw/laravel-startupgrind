import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

const visible = { overflow: 'visible' } as const;

function Corner({ className }: { className: string }) {
    return <span aria-hidden className={`absolute z-20 size-1.5 bg-primary ${className}`} />;
}

const FADE_MS = 1400;
const FADE_STAGGER_MS = 300;
const leftText = "Engage with the world's leading startup community";

// The texts to animate
const p1Text = "Founded in 2010, Startup Grind is the largest community for startup founders in the world. With 5M members, 300 chapters in 125 countries, we've spent 15 years connecting founders with the resources and relationships they need to grow.";
const p2Text = "Our network is powered by 2,000+ local volunteer directors who organize monthly events, alongside a robust digital community. In 2026, our global conference in Silicon Valley brought together over 5,000 founders, generating 14.5 million brand impressions.";
const p3Text = "Our partners play a central role in this ecosystem, gaining exposure to a highly targeted, founder-dense audience at the exact moment key adoption decisions are being made.";

const countWords = (text: string) => text.split(' ').length;
// Calculate the time based on the longest text so the button waits for all animations to finish
const maxWords = Math.max(countWords(leftText), countWords(p1Text), countWords(p2Text), countWords(p3Text));
const TEXT_DONE_MS = (0.2 + (maxWords - 1) * 0.1 + 0.5) * 1000;

export default function StoryTextAndGlobe() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    const [showExtras, setShowExtras] = useState(false);

    useEffect(() => {
        if (!inView) return;
        const timer = setTimeout(() => setShowExtras(true), TEXT_DONE_MS);
        return () => clearTimeout(timer);
    }, [inView]);

    const animate = inView ? 'visible' : 'hidden';

    return (
        <div ref={ref} className="relative lg:px-0 px-2 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border flex flex-col md:flex-row">
            {/* Inner corners for the 2/3 intersection */}
            <Corner className="hidden lg:block -top-[3.5px] -right-[3.5px]" />
            <Corner className="hidden lg:block -bottom-[3.5px] -right-[3.5px]" />

            {/* Text Area */}
            <div className="p-4 lg:p-10 flex-1 flex flex-col">
                <h2 className="text-3xl leading-[1.1] font-thin tracking-tight text-foreground lg:text-3xl">
                    <TextAnimate
                        as="span"
                        by="word"
                        type="fadeInUp"
                        text={leftText}
                        className="text-gray-700"
                        style={visible}
                        animate={animate}
                    />
                </h2>

                <div className="mt-8 border-l-4 border-primary pl-4">
                    <TextAnimate
                        as="p"
                        by="word"
                        type="fadeInUp"
                        text={p1Text}
                        className="text-base font-medium text-foreground leading-tight"
                        style={visible}
                        animate={animate}
                    />
                </div>

                <div className="mt-6 space-y-4 text-muted-foreground leading-tight">
                    <TextAnimate
                        as="p"
                        by="word"
                        type="fadeInUp"
                        className='text-base font-thin text-foreground leading-tight'
                        text={p2Text}
                        style={visible}
                        animate={animate}
                    />
                    <TextAnimate
                        as="p"
                        by="word"
                        type="fadeInUp"
                        text={p3Text}
                        className='text-base font-thin text-foreground leading-tight'
                        style={visible}
                        animate={animate}
                    />
                </div>

                <div
                    className={cn(
                        'mt-8',
                        showExtras ? 'story-fade-in' : 'invisible opacity-0'
                    )}
                    style={{ animationDelay: `${FADE_STAGGER_MS}ms` }}
                >
                    <Button size="sm" className="w-full text-base sm:w-auto !h-9 px-10">
                        Become a member
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="lg:mr-10 flex-1 flex items-center justify-center relative overflow-visible">
                <img
                    src="/home/globe.png"
                    alt="Global network"
                    className="lg:w-[120%] w-[90%] max-w-none object-contain"
                />
            </div>
        </div>
    );
}