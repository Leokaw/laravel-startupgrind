import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { DiscountedTicketsSearch } from './discounted-tickets-search';
import { DiscountedTicketsFilter } from './discounted-tickets-filter';
import { DiscountTicketRowActions } from './discounted-ticket-row-actions';
import { DiscountTicketEditDialog } from './discounted-ticket-edit-dialog';
import { DiscountTicketDeleteDialog } from './discounted-ticket-delete-dialog';

type DiscountTicket = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    discount_percentage: string | null;
    valid_from: string;
    valid_until: string;
    usage_limit: number | null;
    times_used: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

type PaginatedTickets = {
    data: DiscountTicket[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    tickets: PaginatedTickets;
    filters: {
        search?: string;
        status?: string;
    };
};

export function DiscountedTicketsTable({ tickets, filters }: Props) {
    const [editing, setEditing] = useState<DiscountTicket | null>(null);
    const [deleting, setDeleting] = useState<DiscountTicket | null>(null);

    const updateFilters = (patch: Partial<Props['filters']>) => {
        const next = { ...filters, ...patch };

        // Start from the current query string so the OTHER table's
        // filters/pagination (services) survive this update.
        const query: Record<string, string> = {};
        const current = new URLSearchParams(window.location.search);
        current.forEach((value, key) => {
            if (!key.startsWith('ticket_') && key !== 'tickets_page') {
                query[key] = value;
            }
        });

        // Map component-level prop names -> URL param names.
        if (next.search) query.ticket_search = next.search;
        if (next.status) query.ticket_status = next.status;

        // Any change to filters resets tickets pagination.
        delete query.tickets_page;

        router.get(window.location.pathname, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['tickets', 'ticketFilters'],
        });
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <DiscountedTicketsSearch
                    initialValue={filters.search ?? ''}
                    onChange={(search) => updateFilters({ search })}
                />
                <DiscountedTicketsFilter
                    value={filters.status ?? ''}
                    onChange={(status) => updateFilters({ status })}
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Valid From</TableHead>
                            <TableHead>Valid Until</TableHead>
                            <TableHead className="text-right">Used</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="w-[1%] text-right">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No discounted tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.data.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-mono text-xs">
                                        {ticket.code}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {ticket.name}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {ticket.discount_percentage
                                            ? `${Number(
                                                  ticket.discount_percentage,
                                              ).toFixed(2)}%`
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(
                                            new Date(ticket.valid_from),
                                            'MMM d, yyyy',
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(
                                            new Date(ticket.valid_until),
                                            'MMM d, yyyy',
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {ticket.times_used}
                                        {ticket.usage_limit
                                            ? ` / ${ticket.usage_limit}`
                                            : ''}
                                    </TableCell>
                                    <TableCell>
                                        {ticket.is_active ? (
                                            <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(
                                            new Date(ticket.created_at),
                                            'MMM d, yyyy',
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(
                                            new Date(ticket.updated_at),
                                            'MMM d, yyyy HH:mm',
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DiscountTicketRowActions
                                            onEdit={() => setEditing(ticket)}
                                            onDelete={() => setDeleting(ticket)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {tickets.total === 0
                        ? 'No results'
                        : `Showing ${tickets.from}–${tickets.to} of ${tickets.total}`}
                </p>
                <div className="flex gap-2">
                    {tickets.links.map((link, i) => {
                        const isPrev = i === 0;
                        const isNext = i === tickets.links.length - 1;
                        const isNumber = !isPrev && !isNext;

                        if (isNumber) return null;

                        return (
                            <Button
                                key={link.label}
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            only: ['tickets', 'ticketFilters'],
                                        },
                                    )
                                }
                            >
                                {isPrev ? 'Previous' : 'Next'}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {editing && (
                <DiscountTicketEditDialog
                    ticket={editing}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setEditing(null);
                    }}
                />
            )}

            {deleting && (
                <DiscountTicketDeleteDialog
                    ticket={deleting}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setDeleting(null);
                    }}
                />
            )}
        </div>
    );
}