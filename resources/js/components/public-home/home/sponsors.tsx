const sponsors = [
    { name: 'Atlassian', src: '/sponsors/atlassian.png' },
    { name: 'AWS', src: '/sponsors/aws.png' },
    { name: 'Carta', src: '/sponsors/carta.png' },
    { name: 'Google Cloud', src: '/sponsors/google_cloud.png' },
    { name: 'HubSpot', src: '/sponsors/hubspot.png' },
    { name: 'Mayfield', src: '/sponsors/mayfield.png' },
    { name: 'Notion', src: '/sponsors/notion.png' },
];

// Seconds for one full loop. Increase for a slower scroll.
const DURATION = 40;

// Each group repeats the list twice so it is always wider than the screen.
// The track holds two identical groups and slides by exactly one group (-50%),
// so the loop restarts without any visible jump.
const group = [...sponsors, ...sponsors];

function Group({ hidden = false }: { hidden?: boolean }) {
    return (
        <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-stretch">
            {group.map((sponsor, i) => (
                <li
                    key={`${sponsor.name}-${i}`}
                    className="flex h-16 w-40 shrink-0 items-center justify-center border-r border-border px-6 sm:h-20 sm:w-44"
                >
                    <img
                        src={sponsor.src}
                        alt={hidden ? '' : sponsor.name}
                        draggable={false}
                        className="max-h-6 w-auto max-w-full object-contain select-none sm:max-h-14"
                    />
                </li>
            ))}
        </ul>
    );
}

export default function SponsorsMarquee() {
    return (
        <div className="relative border-y border-border bg-background">
            <style>{`
                @keyframes sponsors-marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .sponsors-track {
                    animation: sponsors-marquee ${DURATION}s linear infinite;
                    will-change: transform;
                }
                @media (prefers-reduced-motion: reduce) {
                    .sponsors-track { animation: none; }
                }
            `}</style>

            <div className="flex">
                {/* Spacer so the label lines up with the hero content container */}
                <div aria-hidden className="shrink-0 lg:w-[max(0px,calc((100%-80rem)/2))]" />

                {/* Label */}
                <div className="relative z-10 flex w-44 shrink-0 items-center border-x border-border bg-background px-4 sm:w-60 sm:px-6">
                    {/* Red corner markers */}
                    <span aria-hidden className="absolute -top-[3px] -left-[3px] size-1.5 bg-primary" />

                    <p className="font-mono text-[10px] leading-relaxed tracking-wide text-foreground uppercase sm:text-xs">
                        Powering ideas for
                        <br />
                        the best &amp; brightest
                    </p>
                </div>

                {/* Sliding logos */}
                <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="sponsors-track flex w-max">
                        <Group />
                        <Group hidden />
                    </div>
                </div>
            </div>
        </div>
    );
}