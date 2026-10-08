import { Head, router } from '@inertiajs/react';
import {
    Bell,
    Check,
    MessageSquare,
    ArrowRight,
    Ticket,
    Wrench,
    Filter,
    ChevronDown,
    Inbox,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type NotificationItem = {
    id: string;
    type: string;
    data: {
        direction?: 'sent' | 'received' | 'purchased' | 'sold';
        title?: string;
        body?: string;
        topic?: string;
        message_body?: string;
        receiver_name?: string;
        sender_name?: string;
        seller_name?: string;
        buyer_name?: string;
        ticket_name?: string;
        service_name?: string;
        credits_spent?: number;
        credits_earned?: number;
        balance_before?: number;
        balance_after?: number;
    };
    read_at: string | null;
    created_at: string;
};

type PaginatedNotifications = {
    data: NotificationItem[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    notifications: PaginatedNotifications;
    unreadCount: number;
    availableTypes: string[];
    filters: { type: string };
};

/* ------------------------------------------------------------------ */
/* Per-type visual config                                             */
/* ------------------------------------------------------------------ */

type Meta = {
    icon: LucideIcon;
    label: string;
    iconClass: string;
    unreadClass: string;
    dotClass: string;
};

const DEFAULT_META: Meta = {
    icon: Bell,
    label: 'Notification',
    iconClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    unreadClass:
        'border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20',
    dotClass: 'bg-rose-500',
};

const META: Record<string, Meta> = {
    TicketPurchasedNotification: {
        icon: Ticket,
        label: 'Ticket',
        iconClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
        unreadClass:
            'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
        dotClass: 'bg-amber-500',
    },
    ServicePurchasedNotification: {
        icon: Wrench,
        label: 'Service',
        iconClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        unreadClass:
            'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20',
        dotClass: 'bg-emerald-500',
    },
    MessageNotification: {
        icon: MessageSquare,
        label: 'Message',
        iconClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
        unreadClass:
            'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20',
        dotClass: 'bg-blue-500',
    },
};

const metaFor = (type: string): Meta => META[type] ?? DEFAULT_META;

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function NotificationsIndex({
    notifications,
    unreadCount,
    availableTypes,
    filters,
}: Props) {
    const activeType = filters?.type ?? 'all';

    const markAsRead = (id: string) => {
        router.patch(
            `/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['notifications', 'unreadCount'],
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            '/notifications/read-all',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['notifications', 'unreadCount'],
            },
        );
    };

    const applyFilter = (type: string) => {
        router.get(
            '/notifications',
            type === 'all' ? {} : { type },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['notifications', 'filters'],
                replace: true,
            },
        );
    };

    const goToPage = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['notifications', 'unreadCount'],
                onFinish: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
            },
        );
    };

    const activeLabel =
        activeType === 'all' ? 'All types' : metaFor(activeType).label;

    return (
        <>
            <Head title="Notifications" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    {/* Hero band */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/20 bg-primary/5 px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                                <Inbox className="size-6 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <Bell className="size-3.5" />
                                    Activity
                                </div>
                                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                    Notifications
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {unreadCount > 0
                                        ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`
                                        : "You're all caught up."}
                                </p>
                            </div>
                        </div>

                        {/* Quick stats pill — unread count when present */}
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-2 self-center">
                                <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm">
                                    <Bell className="size-3.5 text-primary" />
                                    <span className="font-medium tabular-nums">
                                        {unreadCount}
                                    </span>
                                    <span className="text-muted-foreground">
                                        unread
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {/* Toolbar */}
                        <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        {activeLabel}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>
                                        Filter by type
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                        value={activeType}
                                        onValueChange={applyFilter}
                                    >
                                        <DropdownMenuRadioItem value="all">
                                            All types
                                        </DropdownMenuRadioItem>
                                        {availableTypes.map((t) => (
                                            <DropdownMenuRadioItem
                                                key={t}
                                                value={t}
                                            >
                                                {metaFor(t).label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={markAllAsRead}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark all as read
                                </Button>
                            )}
                        </div>

                        {/* List */}
                        {notifications.data.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
                                <Bell className="h-6 w-6 opacity-50" />
                                {activeType === 'all'
                                    ? 'No notifications yet.'
                                    : `No ${metaFor(activeType).label.toLowerCase()} notifications.`}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.data.map((n) => (
                                    <NotificationRow
                                        key={n.id}
                                        notification={n}
                                        onMarkRead={() => markAsRead(n.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {notifications.last_page > 1 && (
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {notifications.from}–
                                    {notifications.to} of {notifications.total}
                                </p>

                                <nav
                                    className="flex flex-wrap items-center gap-1"
                                    aria-label="Pagination"
                                >
                                    {notifications.links.map((link, i) => {
                                        const isPrev = i === 0;
                                        const isNext =
                                            i ===
                                            notifications.links.length - 1;
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
                    </div>
                </div>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Row                                                                */
/* ------------------------------------------------------------------ */

function NotificationRow({
    notification,
    onMarkRead,
}: {
    notification: NotificationItem;
    onMarkRead: () => void;
}) {
    const d = notification.data;
    const unread = notification.read_at === null;
    const meta = metaFor(notification.type);
    const Icon = meta.icon;

    return (
        <Card
            className={cn(
                'flex flex-row items-start gap-4 p-4 transition-colors',
                unread && meta.unreadClass,
            )}
        >
            <div
                className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    meta.iconClass,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                        {d.title ?? meta.label}
                    </p>
                    {unread && (
                        <span
                            className={cn(
                                'h-2 w-2 rounded-full',
                                meta.dotClass,
                            )}
                        />
                    )}
                </div>

                <p className="text-sm text-muted-foreground">{d.body}</p>

                {d.topic && (
                    <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                            Topic:
                        </span>{' '}
                        {d.topic}
                    </p>
                )}

                {d.message_body && (
                    <p className="rounded-md border bg-muted/50 p-2 text-sm">
                        {d.message_body}
                    </p>
                )}

                {/* Credits summary for spend / earn */}
                {(d.credits_spent !== undefined ||
                    d.credits_earned !== undefined) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {d.credits_spent !== undefined && (
                            <Badge variant="outline" className="tabular-nums">
                                −{d.credits_spent} credits
                            </Badge>
                        )}
                        {d.credits_earned !== undefined && (
                            <Badge
                                variant="outline"
                                className="tabular-nums text-emerald-600 dark:text-emerald-400"
                            >
                                +{d.credits_earned} credits
                            </Badge>
                        )}
                        {d.balance_before !== undefined &&
                            d.balance_after !== undefined && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 tabular-nums"
                                >
                                    {d.balance_before}
                                    <ArrowRight className="h-3 w-3" />
                                    {d.balance_after}
                                </Badge>
                            )}
                    </div>
                )}

                <p className="pt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                    })}
                </p>
            </div>

            {unread && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkRead}
                    className="shrink-0 text-xs"
                >
                    Mark read
                </Button>
            )}
        </Card>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [{ title: 'Notifications', href: '/notifications' }],
};