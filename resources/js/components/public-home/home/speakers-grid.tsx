import { ArrowRight } from "lucide-react"
import { type CSSProperties } from "react"

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
import TextAnimate from "@/components/ui/text-animate" // adjust path
import { cn } from "@/lib/utils"

// Red corner square
function Corner({ className }: { className: string }) {
    // Added 'hidden lg:block' so it only shows on desktop
    return (
        <span aria-hidden className={`hidden lg:block absolute z-20 size-1.5 bg-primary ${className}`} />
    )
}

const GRID_SIZE = 56
const line = "color-mix(in srgb, currentColor 9%, transparent)"

const gridStyle: CSSProperties = {
    backgroundImage: `
        repeating-linear-gradient(30deg, ${line} 0 1px, transparent 1px ${GRID_SIZE}px),
        repeating-linear-gradient(150deg, ${line} 0 1px, transparent 1px ${GRID_SIZE}px)
    `,
    WebkitMaskImage: `
        linear-gradient(to left, #000 20%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, #000 25%, #000 75%, transparent 100%)
    `,
    maskImage: `
        linear-gradient(to left, #000 20%, transparent 100%),
        linear-gradient(to bottom, transparent 0%, #000 25%, #000 75%, transparent 100%)
    `,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
}

const speakers = [
    { name: "Alexandr Wang", company: "Scale AI", image: "alexandr", link: "https://www.youtube.com/watch?v=cC0XxHr9hok&list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw" },
    { name: "Biz Stone", company: "Twitter", image: "biz", link: "https://www.youtube.com/watch?v=4rerytMyqcU&list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw" },
    {
        name: "Chamath Palihapitiya",
        company: "Social Capital",
        image: "cham",
        link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=ncjum-bkW98&feature=youtu.be",
    },
    { name: "Doug Leone", company: "Sequoia Capital", image: "doug", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=CGaHGF0OKXk&feature=youtu.be" },
    { name: "Eric Yuan", company: "Zoom", image: "eric", link: "https://www.youtube.com/watch?v=hnPIrKg7JMU&list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw" },
    { name: "Dr. Fei-Fei Li", company: "Google Cloud", image: "fei", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=Mu3scWZvZKo&feature=youtu.be" },
    { name: "Garry Tan", company: "Y Combinator", image: "garry", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=y4lm8Yc0XhQ&feature=youtu.be" },
    { name: "Jessica Livingston", company: "Y Combinator", image: "jessica", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=zMZZPiJrBo0&feature=youtu.be" },
    { name: "Kevin Systrom", company: "Instagram", image: "kevin", link: "youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=Y9FzqYpR6iE&feature=youtu.be" },
    { name: "Marc Andreessen", company: "Andreessen Horowitz", image: "marc", link: "https://www.youtube.com/watch?v=IkBp1ntD3Zc&list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&index=7" },
    { name: "Naval Ravikant", company: "AngelList", image: "naval", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=7_HdxSKCyNQ&feature=youtu.be" },
    { name: "Patrick Collison", company: "Stripe", image: "patrick", link: "youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=C5mM5dlcHeg&feature=youtu.be" },
    {
        name: "Sam Altman",
        company: "OpenAI",
        image: "sam",
        link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=kVKaMHgOTP4&feature=youtu.be",
    },
    { name: "Eric Schmidt", company: "Alphabet", image: "schmidt", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=cTui1vkow3M&feature=youtu.be" },
    { name: "Stacey Abrams", company: "Fair Fight", image: "stacey", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=1Sw4MPrn2cY&feature=youtu.be" },
    { name: "Stan", company: "WhatsApp", image: "stan", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=xbYprCoLsvY&feature=youtu.be" },
    { name: "Stewart Butterfield", company: "Slack", image: "stewart", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=7kKb_QA32lY&feature=youtu.be" },
    { name: "Vinod Khosla", company: "Khosla Ventures", image: "vinoda", link: "https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=RWTGtjDRLmk&feature=youtu.be" },
]

export default function SpeakersGrid() {
    return (
        <section id="speakers" className="relative isolate border-b border-border bg-background overflow-x-clip">
            {/* Grid pattern (same as hero) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 text-foreground"
                style={gridStyle}
            />

            <div className="relative mx-auto max-w-7xl border-x border-border">
                {/* Top corners */}
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />

                {/* Bottom corners */}
                <Corner className="-bottom-[3.5px] -left-[3.5px]" />
                <Corner className="-right-[3.5px] -bottom-[3.5px]" />

                {/* Intro copy */}
                <div className="px-6  pt-8 lg:px-8 lg:py-10">
                    <TextAnimate
                        as="h2"
                        type="whipInUp"
                        by="word"
                        text="The world's top builders, thinkers, leaders, and investors come to Startup Grind Conference"
                        className="max-w-3xl text-balance text-3xl font-thin text-gray-700 tracking-tight text-foreground lg:text-4xl"
                    />
                    <TextAnimate
                        as="p"
                        type="whipInUp"
                        by="word"
                        text="Explore the voices shaping the future. Our community connects you with the pioneers building the next generation of global innovation."
                        className="mt-3 max-w-2xl text-pretty text-base leading-tight text-[#666560] md:text-lg"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 p-6  pb-16 md:grid-cols-2 lg:grid-cols-6">
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
                                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                                        {speaker.name}
                                    </h3>
                                    <p className="mb-2 text-sm font-medium text-[#666560]">
                                        {speaker.company}
                                    </p>
                                </CutoutCardContent>

                                <CutoutCardFooter className="absolute inset-x-0 bottom-0 h-14 px-4">
                                    <span className="text-base font-medium text-foreground" />
                                </CutoutCardFooter>

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