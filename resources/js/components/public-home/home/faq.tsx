import { type CSSProperties } from "react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import TextAnimate from "@/components/ui/text-animate" // adjust path
import { cn } from "@/lib/utils"

// Red corner square
function Corner({ className }: { className: string }) {
    // Added 'hidden lg:block' so corners only show on desktop
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

const faqs = [
    {
        question: "What is Startup Grind?",
        answer:
            "Startup Grind is the world's largest community for startup founders, founded in 2010 in Silicon Valley. With over 5 million members across 125 countries and 300+ chapters, we provide education, connections, and opportunities to help startups and scaleups grow. Our network is powered by 2,000+ local volunteer directors who organize monthly events and foster vibrant entrepreneurial communities worldwide.",
    },
    {
        question: "How can I join the Startup Grind community?",
        answer:
            "Joining is simple! You can register your company through our platform, attend local chapter events in your city, or participate in our global conferences. We welcome founders at all stages—from those building their MVP to companies raising Series A and beyond. Simply create an account on our platform to get started and connect with fellow entrepreneurs in your area.",
    },
    {
        question: "What benefits do Startup Grind members receive?",
        answer:
            "Members gain access to a robust network of founders, tech leaders, investors, and partners. Benefits include: attending local and global events, access funding opportunities, discounted tickets at events, expanding market reach through our partner network, mentorship opportunities, and exclusive perks from our preferred partners like HubSpot, AWS, Google Cloud, and Notion.",
    },
    {
        question: "How does the Startup Grind platform work?",
        answer:
            "Our platform is designed to eliminate noise and help you focus on building meaningful business relationships. You can register yourself as a normal user, a freelancer or a company/startup, submit it for evaluation by our experts, browse and discover potential matches, and send messages / acquire services from investors, and partners. We use a credit-based system for workspace interactions with monthly occuring payments.",
    },
    {
        question: "What types of events does Startup Grind organize?",
        answer:
            "We organize over 125 monthly events globally through our local chapters, ranging from intimate founder meetups to large-scale gatherings. Our flagship event is the annual Startup Grind Global Conference in Silicon Valley, which in 2026 brought together over 5,000 founders and generated 14.5 million brand impressions. We also offer virtual events, workshops, and speaker sessions featuring industry leaders.",
    },
    {
        question: "Is Startup Grind suitable for early-stage startups?",
        answer:
            "Absolutely! We're specifically here for the early stage—whether you're building your MVP, raising your first round, or scaling to Series A and beyond. Our community supports founders from bootstrapped beginnings through growth stages. 50% of our team are founders themselves, so we understand the unique challenges early-stage startups face and have built our platform to address them.",
    },
    {
        question: "How much does it cost to join Startup Grind?",
        answer:
            "We offer a free starter tier that gives you access to our workspace platform, custom configuration, and the ability to connect with all registered companies and their employees. For more active users, we offer growth and scale tiers with monthly top-ups for workspace interactions, starting at 5,000 HUF for 500 interaction credits along the month.",
    },
    {
        question: "What success stories have come from Startup Grind?",
        answer:
            "Our community has hosted and connected countless successful founders and innovators, including Sam Altman (OpenAI), Patrick Collison (Stripe), Kevin Systrom (Instagram), and many others who have spoken at our events. Our partners consistently report positive ROI, with HubSpot noting Startup Grind as one of their top partners for four years running, delivering consistent value through access to high-quality startup audiences.",
    },
]

export default function FAQ() {
    return (
        <section id="faq" className="relative isolate border-b border-border bg-background overflow-x-clip">
            {/* Grid pattern (same as hero / speakers) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 text-foreground"
                style={gridStyle}
            />

            <div className="relative mx-auto max-w-7xl border-x border-border ">
                {/* Top corners */}
                <Corner className="-top-[3.5px] -left-[3.5px]" />
                <Corner className="-top-[3.5px] -right-[3.5px]" />

                {/* Bottom corners */}
            

                {/* Intro copy */}
                <div className="px-6 pt-10 lg:px-8 lg:py-10">
                    <TextAnimate
                        as="h2"
                        type="whipInUp"
                        by="word"
                        text="Frequently asked questions"
                        className="max-w-3xl text-balance text-2xl font-thin text-gray-700 tracking-tight text-foreground lg:text-4xl"
                    />
                    <TextAnimate
                        as="p"
                        type="whipInUp"
                        by="word"
                        text="Everything you need to know about the Startup Grind community, platform, and pricing."
                        className="mt-3 max-w-2xl text-pretty text-base leading-tight text-[#666560] md:text-lg"
                    />
                </div>

                {/* Accordion */}
                <div className="px-4 pb-10 pt-4 lg:px-8 lg:pb-16">
                    <Accordion type="single" collapsible className="gap-3">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={faq.question}
                                value={`item-${index}`}
                                className={cn(
                                    "mb-1 rounded-2xl border border-border bg-[#EBEAE4] px-5 sm:px-6",
                                    "not-last:border-b last:mb-0"
                                )}
                            >
                                <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline hover:text-primary sm:text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-sm leading-relaxed text-[#666560] sm:text-base">
                                    <p className="text-pretty">{faq.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}