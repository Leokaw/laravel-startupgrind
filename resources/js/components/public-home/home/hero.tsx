import { Link } from '@inertiajs/react';
import { BookOpen, ChevronRight, Globe as GlobeIcon, Lock } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from '@/components/ui/globe';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

const highlights = [
    { icon: GlobeIcon, title: 'Global Network', text: '125 countries, 300+ chapters' },
    { icon: Lock, title: 'Secure Platform', text: 'Trusted by 5M+ members' },
];

// Isometric grid: two sets of thin lines at +30° and -30° from horizontal.
const GRID_SIZE = 56; // px between lines, increase for a larger grid
const line = 'color-mix(in srgb, currentColor 9%, transparent)';

const gridStyle: CSSProperties = {
    backgroundImage: `
        repeating-linear-gradient(30deg, ${line} 0 1px, transparent 1px ${GRID_SIZE}px),
        repeating-linear-gradient(150deg, ${line} 0 1px, transparent 1px ${GRID_SIZE}px)
    `,
    // Horizontal fade (solid on the right, gone at the left edge) combined with a soft top/bottom fade
    WebkitMaskImage: `
        linear-gradient(to left, #000 20%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, #000 25%, #000 75%, transparent 100%)
    `,
    maskImage: `
        linear-gradient(to left, #000 20%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, #000 25%, #000 75%, transparent 100%)
    `,
    WebkitMaskComposite: 'source-in',
    maskComposite: 'intersect',
};

// Lets descenders (g, p, y) show instead of being clipped by the animation container
const visible = { overflow: 'visible' } as const;

const intro = "The world's largest community for startup founders.";
const description =
    'We deliver education, connections and opportunities in 120 countries to help startups and scaleups grow.';

// The buttons and highlights fade in once the text animation has finished.
// Text timing (fadeInUp): 0.2s initial delay + 0.1s per word + 0.5s for the last word to finish.
// The longest text decides when everything is shown. Change the texts and this updates itself.
const countWords = (text: string) => text.split(' ').length;
const TEXT_DONE_MS = (0.2 + (Math.max(countWords(intro), countWords(description)) - 1) * 0.1 + 0.5) * 1000;

const FADE_MS = 1400; // how long the fade takes (higher = slower)
const FADE_STAGGER_MS = 300; // extra wait before the highlights start fading, after the buttons

export default function Hero() {
    const [showExtras, setShowExtras] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowExtras(true), TEXT_DONE_MS);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative isolate flex flex-1 flex-col">
            <style>{`
                @keyframes hero-fade-in {
                    from { opacity: 0; visibility: hidden; }
                    to { opacity: 1; visibility: visible; }
                }
                .hero-fade-in {
                    animation: hero-fade-in ${FADE_MS}ms ease-out both;
                }
            `}</style>

            {/* Isometric grid background (right side, fades toward the middle of the screen) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full text-foreground lg:w-[60%]"
                style={gridStyle}
            />

            <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8 lg:px-8 lg:py-6">
                {/* Copy */}
                <div className="max-w-xl">
                    {/* One <h1>, each line animated separately (fade in up, word by word) */}
                    <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl">
                        <TextAnimate as="span" by="word" type="fadeInUp" text="Where Ambition" className="" style={visible} />
                        <TextAnimate
                            as="span"
                            by="word"
                            type="fadeInUp"
                            text="Meets Opportunity."
                            className="text-primary"
                            style={visible}
                        />
                    </h1>

                    <div className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                        <TextAnimate
                            as="p"
                            by="word"
                            type="fadeInUp"
                            text={intro}
                            className=""
                            style={visible}
                        />
                        <TextAnimate
                            as="p"
                            by="word"
                            type="fadeInUp"
                            text={description}
                            className=""
                            style={visible}
                        />
                    </div>

                    {/* Fades in first (CSS animation, started by the timer above) */}
                    <div
                        className={cn(
                            'mt-6 flex flex-wrap items-center gap-3',
                            showExtras ? 'hero-fade-in' : 'invisible opacity-0',
                        )}
                    >
                        <Button asChild size="lg">
                            <Link href="/register">
                                Try it for free
                                <ChevronRight className="size-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/manifest">
                                Our manifest
                                <BookOpen className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Fades in right after the buttons */}
                    <ul
                        className={cn('mt-6 space-y-3', showExtras ? 'hero-fade-in' : 'invisible opacity-0')}
                        style={{ animationDelay: `${FADE_STAGGER_MS}ms` }}
                    >
                        {highlights.map(({ icon: Icon, title, text }) => (
                            <li key={title} className="flex items-center gap-4">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                                    <Icon className="size-4" />
                                </span>
                                <span className="leading-tight">
                                    <span className="block text-sm font-medium text-foreground">{title}</span>
                                    <span className="block text-xs text-muted-foreground">{text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Globe Graphic */}
                <div className="relative flex w-full items-center justify-center lg:justify-end">
                    {/* The globe is capped by the screen height so it never pushes the sponsors off-screen */}
                    <div className="w-full" style={{ maxWidth: 'min(100%, calc(100dvh - 16rem))' }}>
                        <Globe className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}