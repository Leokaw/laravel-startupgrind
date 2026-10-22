import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';
import AppLogo from '@/components/app-logo';
import { MergingBubbles } from '@/components/ui/merging-bubbles';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

// Left bubble: your app logo. Right bubble: Tech in the City.
const startIcon = (
    <div className="flex size-full items-center justify-center [&_svg]:size-full">
        <AppLogo />
    </div>
);

const endIcon = (
    <img
        src="/branding/tech_city.png"
        alt="Tech in the City"
        draggable={false}
        className="size-full object-contain select-none"
    />
);

const bubbleVariants = [
    { size: 'sm', className: 'sm:hidden' }, // Bumped from 'xs' to 'sm' for mobile
    { size: 'md', className: 'hidden sm:block lg:hidden' }, // Bumped from 'sm' to 'md'
    { size: 'lg', className: 'hidden lg:block xl:hidden' }, // Bumped from 'md' to 'lg'
    { size: 'lg', className: 'hidden xl:block scale-120' }, // Added a slight scale for extra large screens
] as const;

function ResponsiveBubbles() {
    return (
        <>
            {bubbleVariants.map(({ size, className }) => (
                <div key={size} className={className}>
                    <MergingBubbles size={size} startIcon={startIcon} endIcon={endIcon} showPlus />
                </div>
            ))}
        </>
    );
}

function Corner({ className }: { className: string }) {
    // Added 'hidden lg:block' to hide on mobile/tablet
    return <span aria-hidden className={`hidden lg:block absolute z-20 size-1.5 bg-primary ${className}`} />;
}

const headline = 'The leading global startup community.';
const countWords = (text: string) => text.split(' ').length;
const TEXT_DONE_MS = (0.2 + (countWords(headline) - 1) * 0.1 + 0.5) * 1000;

const FADE_MS = 1400;
const visible = { overflow: 'visible' } as const;

export default function Partnership() {
    const ref = useRef<HTMLElement>(null);
    // Trigger the animation when the section is 30% visible in the viewport
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const [showExtras, setShowExtras] = useState(false);

    useEffect(() => {
        // Only start the timer if the element has scrolled into view
        if (!inView) return;
        
        const timer = setTimeout(() => setShowExtras(true), TEXT_DONE_MS);
        return () => clearTimeout(timer);
    }, [inView]);

    return (
        <section ref={ref} id="about" className="relative border-b border-border bg-background">
            <style>{`
                @keyframes partnership-fade-in {
                    from { opacity: 0; visibility: hidden; transform: translateY(10px); }
                    to { opacity: 1; visibility: visible; transform: translateY(0); }
                }
                .partnership-fade-in {
                    animation: partnership-fade-in ${FADE_MS}ms ease-out both;
                }
            `}</style>

            <div className="relative mx-auto max-w-7xl border-x border-dashed border-border">
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                <div className="grid items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-20">
                    {/* Left: headline */}
                    <h2 className=" leading-[1] font-thin tracking-tight">
                        <TextAnimate
                            as="span"
                            by="word"
                            type="fadeInUp"
                            text={headline}
                            style={visible}
                            className=' text-gray-700 text-center text-4xl lg:text-6xl lg:font-thin'
                            // Tie the text animation to the inView state
                            animate={inView ? 'visible' : 'hidden'}
                        />
                    </h2>

                    {/* Right: merging bubbles + partnership caption */}
                    <div 
                        className={cn(
                            'flex flex-col items-center gap-5 lg:items-end',
                            showExtras ? 'partnership-fade-in' : 'invisible opacity-0'
                        )}
                    >
                        <ResponsiveBubbles />

                        <p className="text-center font-mono text-sm leading-relaxed tracking-wide text-muted-foreground uppercase lg:text-right">
                            In exclusive partnership with
                            <br />
                            <span className="text-foreground">Tech in the City</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}