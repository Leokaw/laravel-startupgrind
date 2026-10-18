import AppLogo from '@/components/app-logo';
import { MergingBubbles } from '@/components/ui/merging-bubbles';

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

// MergingBubbles has fixed pixel sizes, so we render one per size and let
// Tailwind breakpoints show only the one that fits the available space.
const bubbleVariants = [
    { size: 'xs', className: 'sm:hidden' },
    { size: 'sm', className: 'hidden sm:block lg:hidden' },
    { size: 'md', className: 'hidden lg:block xl:hidden' },
    { size: 'lg', className: 'hidden xl:block' },
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

// Small red square that sits on a border intersection.
function Corner({ className }: { className: string }) {
    // z-20 keeps the square above the sponsors label (which uses z-10) so it is never half hidden.
    return <span aria-hidden className={`absolute z-20 size-1.5 bg-primary ${className}`} />;
}

export default function Partnership() {
    return (
        <section className="relative border-b border-border bg-background">
            {/* Framed area: dashed vertical borders on the left and right, red squares at the intersections.
                The top-left square here is the only one at that intersection (the sponsors strip aligns its
                left border with this frame and does not draw its own bottom-left square). */}
            <div className="relative mx-auto max-w-7xl border-x border-dashed border-border">
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                <div className="grid items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-20">
                    {/* Left: headline */}
                    <h2 className="text-center text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-left xl:text-6xl">
                        The leading global startup community.
                    </h2>

                    {/* Right: merging bubbles + partnership caption */}
                    <div className="flex flex-col items-center gap-5 lg:items-end">
                        <ResponsiveBubbles />

                        <p className="text-center font-mono text-xs leading-relaxed tracking-wide text-muted-foreground uppercase lg:text-right">
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