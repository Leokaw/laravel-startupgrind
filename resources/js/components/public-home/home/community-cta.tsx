import { ArrowUpRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function CommunityCta() {
    return (
        <div className="relative flex flex-col h-full lg:pt-0 lg:px-0 px-2 pt-4 bg-muted/5">
            {/* The Red Glow - anchored to the bottom right and bleeding upwards */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-64 -bottom-24 -right-32 -left-10 rounded-full bg-primary/15 blur-[120px] z-0"
            />

            {/* Text & Buttons Area */}
            <div className="relative z-10 p-4 lg:p-8 flex-1">
                <h2 className="text-2xl leading-[1.1] w-full tracking-tight font-light text-gray-700 lg:text-3xl">
                    We are shaping what's next <br />
                    <span className="italic">for your company </span>
                </h2>
                <p className="mt-4 text-base leading-tight text-muted-foreground">
                    Whether you're building your MVP, raising your first round, or scaling to Series A and beyond: we're here to help you grow.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <Button className='!h-9' variant="outline">
                 
                            Attend an event
                            <ArrowUpRight className="size-4 text-primary" />
            
                    </Button>
                </div>
            </div>

            {/* Bottom Image Area - Smaller width, aligned to right */}
            <div className="relative z-10 mt-auto ml-auto w-[85%] overflow-hidden rounded-tl-2xl border-t border-l border-border bg-background">
                <img
                    src="/home/step6.webp"
                    alt="Startup Grind community"
                    className="aspect-[4/3] lg:aspect-auto lg:h-[300px] w-full h-full object-cover"
                />
            </div>
        </div>
    );
}