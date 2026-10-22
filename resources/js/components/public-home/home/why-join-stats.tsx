import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

const visible = { overflow: 'visible' } as const;

function Corner({ className }: { className: string }) {
    return <span aria-hidden className={`absolute z-20 size-1.5 bg-primary ${className}`} />;
}

const stats = [
    { value: 300, suffix: '+', label: 'Organizations', bar: 'bg-sky-500' },
    { value: 100, suffix: '+', label: 'Countries', bar: 'bg-purple-600' },
    { value: 125, suffix: '+', label: 'Monthly events', bar: 'bg-green-600' },
    { value: 10, suffix: 'K+', label: 'Conference attendees', bar: 'bg-primary' },
];

const COUNT_MS = 1800;

function AnimatedNumber({ value, suffix, start, delay = 0 }: { value: number; suffix: string; start: boolean; delay?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!start) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(value);
            return;
        }

        let frame = 0;
        const t0 = performance.now() + delay;

        const tick = (now: number) => {
            const progress = Math.min(Math.max((now - t0) / COUNT_MS, 0), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [start, value, delay]);

    return (
        <>
            {display}
            {suffix}
        </>
    );
}

function Stats() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });

    return (
        <div 
            ref={ref} 
            // Added rounded-2xl and overflow-hidden
            className="relative mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-background "
        >
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    className={cn(
                        'group flex flex-col items-start gap-3 p-6 transition-colors duration-300 hover:bg-muted/40',
                        i % 2 === 0 && 'border-r border-border',
                        i < 2 && 'border-b border-border',
                    )}
                >
                    <span className="text-3xl leading-none font-light tracking-tight text-foreground tabular-nums sm:text-4xl">
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} start={inView} delay={i * 150} />
                    </span>

                    <span
                        className={cn(
                            'h-1 w-8 rounded-full transition-[width] duration-500 ease-out group-hover:w-14',
                            stat.bar,
                        )}
                    />

                    <span className="font-mono text-[11px] leading-snug tracking-wide text-muted-foreground uppercase sm:text-xs">
                        {stat.label}
                    </span>
                </div>
            ))}

            <Corner className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
    );
}

export default function WhyJoinStats() {
    return (
        <div className="border-border p-6 lg:mt-0 mt-5 lg:border-r lg:p-12">
            <h2 className="text-3xl leading-[1] font-light tracking-tight text-foreground sm:text-4xl">
                <TextAnimate
                    as="span"
                    by="word"
                    type="fadeInUp"
                    text="Why join the community?"
                    className="text-gray-700"
                    style={visible}
                />
            </h2>
            <p className="mt-4 mb-12 text-sm leading-tight text-muted-foreground sm:text-base">
                Being part of Startup Grind means you are never building alone. We connect you with the people who can help you take the next step.
            </p>

            <Stats />
        </div>
    );
}