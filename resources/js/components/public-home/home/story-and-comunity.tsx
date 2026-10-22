import StoryTextAndGlobe from './story-text-and-globe';
import CommunityCta from './community-cta';

function Corner({ className }: { className: string }) {
    // Added 'hidden lg:block' so corners only show on desktop
    return <span aria-hidden className={`hidden lg:block absolute z-20 size-1.5 bg-primary ${className}`} />;
}

export default function StoryAndCommunity() {
    return (
        <section id="features" className="relative border-b border-border bg-background overflow-x-clip">
            <style>{`
                @keyframes story-fade-in {
                    from { opacity: 0; visibility: hidden; transform: translateY(10px); }
                    to { opacity: 1; visibility: visible; transform: translateY(0); }
                }
                .story-fade-in {
                    animation: story-fade-in 1400ms ease-out both;
                }
            `}</style>

            <div className="relative mx-auto max-w-7xl border-x border-border">
                {/* Top outer corners */}
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />

                {/* Bottom outer corners */}
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:px-0 lg:pt-0 pt-6">
                    <StoryTextAndGlobe />
                    <CommunityCta />
                </div>
            </div>
        </section>
    );
}