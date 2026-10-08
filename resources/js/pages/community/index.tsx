import { Head, router } from '@inertiajs/react';
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
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <div className="mb-6">
                        <h1 className="text-lg font-semibold">Community</h1>
                        <p className="text-sm text-muted-foreground">
                            Discover the people building on Startup Grind.
                        </p>
                    </div>

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