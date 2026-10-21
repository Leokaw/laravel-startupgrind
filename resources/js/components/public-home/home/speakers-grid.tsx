import { ArrowRight } from "lucide-react"

import {
    CutoutCard,
    CutoutCardContent,
    CutoutCardFooter,
    CutoutCardImage,
    CutoutCardInsetLabel,
    CutoutCardMedia,
    CutoutCorner,
    cutoutCardSurfaceClassName,
} from "@/components/ui/cutout-card"
import { cn } from "@/lib/utils"

// Red corner square
function Corner({ className }: { className: string }) {
    return (
        <span aria-hidden className={`absolute z-20 size-1.5 bg-primary ${className}`} />
    )
}

const speakers = [
    { name: "Alexandr Wang", image: "alexandr", link: "#" },
    { name: "Biz Stone", image: "biz", link: "#" },
    {
        name: "Chamath Palihapitiya",
        image: "cham",
        link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=ncjum-bkW98&feature=youtu.be",
    },
    { name: "Doug Leone", image: "doug", link: "#" },
    { name: "Eric Yuan", image: "eric", link: "#" },
    { name: "Dr. Fei-Fei Li", image: "fei", link: "#" },
    { name: "Garry Tan", image: "garry", link: "#" },
    { name: "Jessica Livingston", image: "jessica", link: "#" },
    { name: "Kevin Systrom", image: "kevin", link: "#" },
    { name: "Marc Andreessen", image: "marc", link: "#" },
    { name: "Naval Ravikant", image: "naval", link: "#" },
    { name: "Patrick Collison", image: "patrick", link: "#" },
    {
        name: "Sam Altman",
        image: "sam",
        link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=kVKaMHgOTP4&feature=youtu.be",
    },
    { name: "Eric Schmidt", image: "schmidt", link: "#" },
    { name: "Stacey Abrams", image: "stacey", link: "#" },
    { name: "Stan", image: "stan", link: "#" },
    { name: "Stewart Butterfield", image: "stewart", link: "#" },
    { name: "Vinod Khosla", image: "vinoda", link: "#" },
]

export default function SpeakersGrid() {
    return (
        <section className="relative border-b border-border bg-background overflow-x-clip">
            <div className="relative mx-auto max-w-7xl border-x border-border">
                {/* Top corners */}
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />

                {/* Bottom corners */}
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-5">
                    {speakers.map((speaker) => (
                        <a
                            key={speaker.image}
                            href={speaker.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <CutoutCard
                                className={cn(
                                    cutoutCardSurfaceClassName,
                                    "flex h-full flex-col bg-[#EBEAE4]"
                                )}
                            >
                                <CutoutCardContent className="flex-1 p-4 pb-16">
                                    <CutoutCardMedia className="mb-5 aspect-[4/3] rounded-2xl">
                                        <CutoutCardImage
                                            src={`/attendees/${speaker.image}.png`}
                                            alt={speaker.name}
                                            className="grayscale group-hover/cutout:grayscale-0"
                                        />
                                    </CutoutCardMedia>

                                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8B8A86]">
                                        Speaker
                                    </p>
                                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                                        {speaker.name}
                                    </h3>
                                    <p className="text-pretty text-sm leading-relaxed text-[#666560]">
                                        Watch the talk from the Startup Grind archives.
                                    </p>
                                </CutoutCardContent>

                                {/* Bottom row: label on the left, button lives in the cutout pocket */}
                                <CutoutCardFooter className="absolute inset-x-0 bottom-0 h-14 px-4">
                                    <span className="text-base font-medium text-foreground">
                                        Watch talk
                                    </span>
                                </CutoutCardFooter>

                                {/*
                  The cutout "pocket": painted with the page background so the card
                  looks notched. The -1px offsets cover the card's border. The two
                  CutoutCorners add the smooth inverse radii where the pocket meets
                  the card edges.
                */}
                                <CutoutCardInsetLabel
                                    className="-right-px -bottom-px h-14 w-14 rounded-tl-[20px] bg-background transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:w-24"
                                >
                                    <CutoutCorner
                                        size={20}
                                        className="absolute right-0 -top-[19px] text-background"
                                    />
                                    <CutoutCorner
                                        size={20}
                                        className="absolute bottom-0 -left-[19px] text-background"
                                    />

                                    {/* Fixed 56px box pinned to the right so the button doesn't move */}
                                    <div className="absolute right-0 bottom-0 flex size-14 items-center justify-center">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-all duration-300 group-hover/cutout:bg-primary group-hover/cutout:text-primary-foreground">
                                            <ArrowRight className="size-4" />
                                        </div>
                                    </div>
                                </CutoutCardInsetLabel>
                            </CutoutCard>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}