import WhyJoinStats from './why-join-stats';
import HowItWorksSteps from './how-it-works-steps';

function Corner({ className }: { className: string }) {
    // Added 'hidden lg:block' so corners only show on desktop
    return <span aria-hidden className={`hidden lg:block absolute z-20 size-1.5 bg-primary ${className}`} />;
}

export default function BottomFeatures() {
    return (
        <section className="relative border-b border-border bg-background">
            <div className="relative mx-auto max-w-7xl border-x border-border">
                {/* Top outer corners */}
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />

                {/* Bottom outer corners */}
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                {/* Inner corners (centered exactly on the vertical divider) */}
                {/* Note: Removed redundant hidden lg:block here since it's in the base component now */}
                <Corner className="-translate-x-1/2 -bottom-[3.5px] left-1/2" />

                <div className="grid lg:grid-cols-2">
                    <WhyJoinStats />
                    <HowItWorksSteps />
                </div>
            </div>
        </section>
    );
}