import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Globe2,
    MapPin,
    Sparkles,
    Tag,
    Ticket,
    Users,
    Video,
    type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderBeamButton } from '@/components/ui/border-beam-button';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type EventChapter = {
    name: string | null;
    city: string | null;
    country: string | null;
    country_name: string | null;
    location: string | null;
    timezone: string | null;
    logo: string | null;
    website: string | null;
};

type Event = {
    id: number | null;
    slug: string;
    title: string;
    description: string;
    image: string | null;
    url: string;
    start_date: string | null;
    event_type: string;
    is_free: boolean;
    is_virtual: boolean;
    is_external: boolean;
    allows_cohosting: boolean;
    tags: string[];
    chapter: EventChapter;
};

type Props = {
    event: Event;
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function EventShow({ event }: Props) {
    const startDate = event.start_date ? new Date(event.start_date) : null;

    const TypeIcon: LucideIcon = event.is_virtual
        ? Video
        : event.is_external
          ? Globe2
          : MapPin;

    const typeLabel = event.is_virtual
        ? 'Virtual Event'
        : event.is_external
          ? 'Community Event'
          : 'In-Person Event';

    return (
        <>
            <Head title={event.title} />

            <div className="flex h-full flex-1 flex-col md:gap-2 gap-0 overflow-x-auto rounded-xl p-0 md:p-4">
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    {/* ======================================================
                     |  Hero — banner image with overlaid back link + title
                     | ====================================================== */}
                    <div className="relative h-64 overflow-hidden bg-muted sm:h-80 lg:h-96">
                        {event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                                <CalendarDays className="size-16 text-primary/40" />
                            </div>
                        )}

                        {/* Overlay gradient for legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Back link */}
                        <div className="absolute left-6 top-6">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
                            >
                                <Link href="/events">
                                    <ArrowLeft className="mr-1.5 size-4" />
                                    Back to events
                                </Link>
                            </Button>
                        </div>

                        {/* Pills — top right */}
                        <div className="absolute right-6 top-6 flex flex-wrap gap-2">
                            {event.is_free && (
                                <Badge className="rounded-full border-emerald-500/30 bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-500/90">
                                    Free
                                </Badge>
                            )}
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                                <TypeIcon className="size-3.5" />
                                {typeLabel}
                            </span>
                        </div>

                        {/* Title block */}
                        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10 sm:pb-10">
                            {event.chapter.name && (
                                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white/80">
                                    <MapPin className="size-3.5 shrink-0" />
                                    <span className="truncate">
                                        {event.chapter.location ??
                                            event.chapter.name}
                                    </span>
                                </p>
                            )}

                            <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-white text-balance sm:text-3xl lg:text-4xl">
                                {event.title}
                            </h1>
                        </div>
                    </div>

                    {/* ======================================================
                     |  Body — two column layout
                     | ====================================================== */}
                    <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_360px]">
                        {/* Main column */}
                        <div className="space-y-8">
                            {/* About this event */}
                            <section>
                                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <Sparkles className="size-3.5" />
                                    About this event
                                </div>
                                <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
                                    {event.description ||
                                        'No description provided for this event.'}
                                </p>
                            </section>

                            {/* Tags */}
                            {event.tags.length > 0 && (
                                <section>
                                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        <Tag className="size-3.5" />
                                        Categories
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Hosted by */}
                            {event.chapter.name && (
                                <section>
                                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        <Users className="size-3.5" />
                                        Hosted by
                                    </div>
                                    <Card className="flex flex-row items-center gap-4 rounded-2xl p-4">
                                        {event.chapter.logo ? (
                                            <img
                                                src={event.chapter.logo}
                                                alt={event.chapter.name}
                                                className="size-24 mt-4 shrink-0 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                                <Users className="size-6 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-base font-semibold">
                                                {event.chapter.name}
                                            </p>
                                            {event.chapter.location && (
                                                <p className="truncate text-sm text-muted-foreground">
                                                    {event.chapter.location}
                                                </p>
                                            )}
                                        </div>
                                       
                                    </Card>
                                </section>
                            )}

                            {/* Event details grid */}
                            <section className="grid gap-4 sm:grid-cols-2">
                                {startDate && (
                                    <Card className="rounded-2xl p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            <CalendarDays className="size-3.5" />
                                            Date & time
                                        </div>
                                        <p className="mt-2 text-base font-medium">
                                            {format(startDate, 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                                            {format(startDate, 'HH:mm')}
                                            {event.chapter.timezone && (
                                                <>
                                                    {' · '}
                                                    {event.chapter.timezone}
                                                </>
                                            )}
                                        </p>
                                    </Card>
                                )}

                                {event.chapter.location && (
                                    <Card className="rounded-2xl p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            <MapPin className="size-3.5" />
                                            Location
                                        </div>
                                        <p className="mt-2 text-base font-medium">
                                            {event.chapter.location}
                                        </p>
                                        {event.is_virtual && (
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                Online event
                                            </p>
                                        )}
                                    </Card>
                                )}
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-6 lg:self-start">
                            <Card className="space-y-5 rounded-2xl p-6">
                                {/* Quick summary */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <CalendarDays className="size-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">
                                                When
                                            </p>
                                            <p className="truncate font-medium">
                                                {startDate
                                                    ? format(
                                                          startDate,
                                                          'EEE, MMM d · HH:mm',
                                                      )
                                                    : 'TBA'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <TypeIcon className="size-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">
                                                Format
                                            </p>
                                            <p className="truncate font-medium">
                                                {typeLabel}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Ticket className="size-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">
                                                Price
                                            </p>
                                            <p className="truncate font-medium">
                                                {event.is_free
                                                    ? 'Free entry'
                                                    : 'See registration page'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Primary CTA — border beam button */}
                                <BorderBeamButton
                                    type="button"
                                    variant="secondary"
                                    colorVariant="colorful"
                                    beamSize="md"
                                    borderBeamClassName="w-full!"
                                    className="h-12 w-full gap-2 rounded-full text-base font-semibold"
                                    onClick={() => {
                                        // TODO: wire to real ticket-claim flow
                                    }}
                                >
                                    <Ticket className="size-4" />
                                    Claim discounted ticket
                                </BorderBeamButton>

                                {/* Secondary: external register link */}
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                  
                                    <a
                                        href={event.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                           <ArrowRight className="ml-1.5 size-4" />
                                        Visit event website
                                       
                                    </a>
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    Discount available to Startup Grind
                                    members. You'll be redirected to the
                                    organizer's page to complete registration.
                                </p>
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

EventShow.layout = {
    breadcrumbs: [{ title: 'Events', href: '/events' }],
};