import { Head, router } from '@inertiajs/react';
import { Compass, Globe2, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/community/user-card';
import { CommunitySearch } from '@/components/community/community-search';
import { CommunityFilter } from '@/components/community/community-filter';

type CommunityUser = {
    id: string;
    name: string;
    email: string;
    user_type: 'company' | 'user' | 'freelancer' | 'employee';
    profile_photo_url: string;
    has_custom_profile_photo: boolean;
    company: { id: string; name: string } | null;
    email_verified_at: string | null;
    approved_at: string | null;
    services: {
        id: string;
        name: string;
        description: string | null;
        price: number | string;
        category: string | null;
    }[];
    tickets: {
        id: string;
        name: string;
        description: string | null;
        discount_percentage: number | string | null;
        discount_amount: number | string | null;
    }[];
};

type PaginatedUsers = {
    data: CommunityUser[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    me: CommunityUser;
    users: PaginatedUsers;
    filters: {
        search?: string;
        user_type?: string;
    };
};

export default function CommunityIndex({ me, users, filters }: Props) {
    const updateFilters = (patch: Partial<Props['filters']>) => {
        const next = { ...filters, ...patch };
        const query: Record<string, string> = {};
        if (next.search) query.search = next.search;
        if (next.user_type) query.user_type = next.user_type;

        router.get(window.location.pathname, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['users', 'filters'],
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
                only: ['users', 'filters'],
                onFinish: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
            },
        );
    };

    const hasOthers = users.data.length > 0;

    return (
        <>
            <Head title="Community" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    {/* ============================================================
                     |  Hero band — primary-tinted header with icon chip
                     | ============================================================ */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/10 bg-primary/5 px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                                <Users className="size-6 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <Compass className="size-3.5" />
                                    Discover
                                </div>
                                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                    Community
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Discover the people building on Startup Grind.
                                </p>
                            </div>
                        </div>

                        {/* Quick stats — pure decoration, no extra data needed */}
                        <div className="flex items-center gap-2 self-center">
                            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm">
                                <Globe2 className="size-3.5 text-primary" />
                                <span className="font-medium tabular-nums">
                                    {users.total}
                                </span>
                                <span className="text-muted-foreground">
                                    {users.total === 1 ? 'member' : 'members'}
                                </span>
                            </div>
                           
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {/* Toolbar */}
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CommunitySearch
                                initialValue={filters.search ?? ''}
                                onChange={(search) => updateFilters({ search })}
                            />
                            <CommunityFilter
                                value={filters.user_type ?? ''}
                                onChange={(user_type) =>
                                    updateFilters({ user_type })
                                }
                            />
                        </div>

                        {/* Grid — your card is always the very first cell */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            <UserCard user={me} />

                            {users.data.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>

                        {/* Empty state — only for "other" members */}
                        {!hasOthers && (
                            <div className="mt-6 flex h-32 items-center justify-center rounded-lg border border-dashed border-sidebar-border/70 text-sm text-muted-foreground">
                                No other community members match your search.
                            </div>
                        )}

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {users.from}–{users.to} of {users.total}
                                </p>

                                <nav
                                    className="flex flex-wrap items-center gap-1"
                                    aria-label="Pagination"
                                >
                                    {users.links.map((link, i) => {
                                        const isPrev = i === 0;
                                        const isNext = i === users.links.length - 1;
                                        const isEllipsis = link.label === '...';

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
                                                    link.active ? 'default' : 'outline'
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => goToPage(link.url)}
                                                aria-current={
                                                    link.active ? 'page' : undefined
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
                    </div>
                </div>
            </div>
        </>
    );
}

CommunityIndex.layout = {
    breadcrumbs: [
        {
            title: 'Community',
            href: '/community',
        },
    ],
};