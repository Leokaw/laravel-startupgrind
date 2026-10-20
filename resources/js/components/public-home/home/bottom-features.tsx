import WhyJoinStats from './why-join-stats';
import HowItWorksSteps from './how-it-works-steps';

function Corner({ className }: { className: string }) {
    return <span aria-hidden className={`absolute z-20 size-1.5 bg-primary ${className}`} />;
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
                <Corner className="hidden lg:block -translate-x-1/2 -bottom-[3.5px] left-1/2" />

                <div className="grid lg:grid-cols-2">
                    <WhyJoinStats />
                    <HowItWorksSteps />
                </div>
            </div>
        </section>
    );
}