import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    ArrowRight,
    CalendarDays,
    Globe2,
    MapPin,
    Sparkles,
    Tag,
    Video,
    type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
    CutoutCard,
    CutoutCardAction,
    CutoutCardContent,
    CutoutCardImage,
    CutoutCardInsetLabel,
    CutoutCardMedia,
    CutoutCardOverlay,
    CutoutCardPin,
    cutoutCardSurfaceClassName,
    CutoutCorner,
    useCutoutContentStaggerVariants,
} from '@/components/ui/cutout-card';
import {
    EventFilterBar,
    type EventFilters,
} from '@/components/events/event-filters';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type EventChapter = {
    name: string | null;
    city: string | null;
    country: string | null;
    country_name?: string | null;
    location: string | null;
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
    tags: string[];
    chapter: EventChapter;
};

type PaginatedEvents = {
    data: Event[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type FilterOption = { value: string; label: string; count?: number };

type Props = {
    events: PaginatedEvents;
    filters: EventFilters;
    filterOptions: {
        countries: FilterOption[];
        tags: FilterOption[];
        types: FilterOption[];
        prices: FilterOption[];
    };
    lastSyncedAt: string | null;
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function EventsIndex({
    events,
    filters,
    filterOptions,
    lastSyncedAt,
}: Props) {
    const buildQuery = (
        next: Partial<EventFilters> = {},
        page: number = 1,
    ): Record<string, string> => {
        const merged = { ...filters, ...next };
        const query: Record<string, string> = {};

        if (merged.country) query.country = merged.country;
        if (merged.type) query.type = merged.type;
        if (merged.price) query.price = merged.price;
        if (merged.tag) query.tag = merged.tag;
        if (merged.search) query.search = merged.search;
        if (page > 1) query.page = String(page);

        return query;
    };

    const applyFilters = (next: Partial<EventFilters>) => {
        router.get('/events', buildQuery(next, 1), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['events', 'filters'],
        });
    };

    const goToPage = (url: string | null) => {
        if (!url) return;

        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['events', 'filters'],
                onFinish: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
            },
        );
    };

    return (
        <>
            <Head title="Upcoming Events" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    {/* Hero band */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/20 bg-primary/5 px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                                <CalendarDays className="size-6 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <Sparkles className="size-3.5" />
                                    Discover
                                </div>
                                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                    Upcoming Events
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Meet founders, learn from operators, and
                                    connect with the global Startup Grind
                                    community.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-center">
                            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm">
                                <Globe2 className="size-3.5 text-primary" />
                                <span className="font-medium tabular-nums">
                                    {events.total}
                                </span>
                                <span className="text-muted-foreground">
                                    {events.total === 1 ? 'event' : 'events'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-6 p-6">
                        <EventFilterBar
                            filters={filters}
                            options={filterOptions}
                            onChange={applyFilters}
                        />

                        {events.data.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
                                <CalendarDays className="h-6 w-6 opacity-50" />
                                No events match your filters. Try clearing some.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {events.data.map((event) => (
                                    <EventCard
                                        key={event.id ?? event.url}
                                        event={event}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination — community style */}
                        {events.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
                                <p className="text-sm text-muted-foreground">
                                    Showing {events.from}–{events.to} of{' '}
                                    {events.total}
                                </p>

                                <nav
                                    className="flex flex-wrap items-center gap-1"
                                    aria-label="Pagination"
                                >
                                    {events.links.map((link, i) => {
                                        const isPrev = i === 0;
                                        const isNext =
                                            i === events.links.length - 1;
                                        const isEllipsis =
                                            link.label === '...';

                                        if (isEllipsis) {
                                            return (
                                                <span
                                                    key={`gap-${i}`}
                                                    className="px-2 text-sm text-muted-foreground"
                                                >
                                                    …
                                                </span>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={link.label + i}
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() =>
                                                    goToPage(link.url)
                                                }
                                                aria-current={
                                                    link.active
                                                        ? 'page'
                                                        : undefined
                                                }
                                            >
                                                {isPrev
                                                    ? 'Previous'
                                                    : isNext
                                                        ? 'Next'
                                                        : link.label}
                                            </Button>
                                        );
                                    })}
                                </nav>
                            </div>
                        )}

                        {lastSyncedAt && (
                            <p className="text-center text-xs text-muted-foreground">
                                Last updated{' '}
                                {format(new Date(lastSyncedAt), 'PPpp')} ·
                                refreshes every 8 hours
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Event card — CutoutCard design                                     */
/* ------------------------------------------------------------------ */

function EventCard({ event }: { event: Event }) {
    const startDate = event.start_date ? new Date(event.start_date) : null;
    const stagger = useCutoutContentStaggerVariants();

    const TypeIcon: LucideIcon = event.is_virtual
        ? Video
        : event.is_external
          ? Globe2
          : MapPin;

    const typeLabel = event.is_virtual
        ? 'Virtual'
        : event.is_external
          ? 'Community'
          : 'In-person';

    const location = event.chapter.location ?? event.chapter.name ?? '';

    return (
        <CutoutCard
            className={cn(
                cutoutCardSurfaceClassName,
                'group/card flex flex-col transition-shadow hover:shadow-lg',
            )}
        >
            {/* -----------------------------------------------------------
             |  Media — image with overlay, inset label, and pin
             | ----------------------------------------------------------- */}
            <CutoutCardMedia className="h-44">
                {event.image ? (
                    <CutoutCardImage
                        alt={event.title}
                        src={event.image}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <CalendarDays className="size-10 text-primary/40" />
                    </div>
                )}

                <CutoutCardOverlay />

                {/* Pin — top right. Green when free, primary otherwise */}
                {event.is_free ? (
                    <CutoutCardPin className="bg-emerald-500 text-white shadow-foreground/10 top-0 right-0 rounded-bl-[16px] px-3 py-1.5 text-xs font-semibold shadow-md">
                        Free
                        <CutoutCorner
                            className="text-emerald-500 absolute top-0 -left-[23px] -rotate-90"
                            size={24}
                        />
                        <CutoutCorner
                            className="text-emerald-500 absolute right-0 -bottom-[23px] -rotate-90"
                            size={24}
                        />
                    </CutoutCardPin>
                ) : (
                    <CutoutCardPin className="bg-primary text-primary-foreground shadow-foreground/10 top-0 right-0 rounded-bl-[16px] px-3 py-1.5 text-xs font-semibold shadow-md">
                        <TypeIcon className="mr-1 inline size-3" />
                        {typeLabel}
                        <CutoutCorner
                            className="text-primary absolute top-0 -left-[23px] -rotate-90"
                            size={24}
                        />
                        <CutoutCorner
                            className="text-primary absolute right-0 -bottom-[23px] -rotate-90"
                            size={24}
                        />
                    </CutoutCardPin>
                )}

                {/* Inset label — bottom left, location */}
                {location && (
                    <CutoutCardInsetLabel className="bg-card bottom-0 left-0 rounded-tr-[20px] px-4 py-2">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase">
                            <MapPin className="size-3 shrink-0" />
                            <span className="max-w-[200px] truncate">
                                {location}
                            </span>
                        </span>
                        <CutoutCorner className="text-card absolute -right-[31px] -bottom-px rotate-90" />
                        <CutoutCorner className="text-card absolute -top-[31px] -left-px rotate-90" />
                    </CutoutCardInsetLabel>
                )}
            </CutoutCardMedia>

            {/* -----------------------------------------------------------
             |  Content — title, description, date, tags
             | ----------------------------------------------------------- */}
            <CutoutCardContent className="pb-16">
                <motion.div
                    className="contents"
                    initial="hidden"
                    animate="show"
                    variants={stagger.container}
                >
                    <motion.h3
                        variants={stagger.item}
                        className="text-card-foreground mb-2 line-clamp-2 text-base leading-snug font-semibold text-balance"
                    >
                        {event.title}
                    </motion.h3>

                    <motion.p
                        variants={stagger.item}
                        className="text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed text-pretty"
                    >
                        {event.description}
                    </motion.p>

                    {startDate && (
                        <motion.div
                            variants={stagger.item}
                            className="text-muted-foreground flex items-center gap-1.5 text-xs"
                        >
                            <CalendarDays className="size-3 shrink-0" />
                            <span className="tabular-nums">
                                {format(startDate, 'EEE, MMM d · HH:mm')}
                            </span>
                        </motion.div>
                    )}

                    {event.tags.length > 0 && (
                        <motion.div
                            variants={stagger.item}
                            className="mt-3 flex flex-wrap gap-1.5"
                        >
                            {event.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                >
                                    <Tag className="size-2.5" />
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </CutoutCardContent>

            {/* -----------------------------------------------------------
             |  Action — floating pill, bottom right
             | ----------------------------------------------------------- */}
            <CutoutCardAction className="right-5 bottom-5">
                <Link
                    href={`/events/${event.slug}`}
                    prefetch
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:outline-none active:scale-[0.97]"
                >
                    View event
                    <ArrowRight className="size-3.5" />
                </Link>
            </CutoutCardAction>
        </CutoutCard>
    );
}

EventsIndex.layout = {
    breadcrumbs: [{ title: 'Events', href: '/events' }],
};