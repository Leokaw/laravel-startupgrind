import { useState } from 'react';
import { Briefcase, Package } from 'lucide-react';
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
import { CompanyServicesSearch } from './company-services-search';
import { CompanyServicesFilter } from './company-services-filter';
import { CompanyServiceRowActions } from './company-service-row-actions';
import { CompanyServiceEditDialog } from './company-service-edit-dialog';
import { CompanyServiceDeleteDialog } from './company-service-delete-dialog';

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: string;
    category: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

type PaginatedServices = {
    data: Service[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    services: PaginatedServices;
    filters: {
        search?: string;
        category?: string;
    };
    categories: Record<string, string>;
};

export function CompanyServicesTable({ services, filters, categories }: Props) {
    const [editing, setEditing] = useState<Service | null>(null);
    const [deleting, setDeleting] = useState<Service | null>(null);

    const updateFilters = (patch: Partial<Props['filters']>) => {
        const next = { ...filters, ...patch };
        const query: Record<string, string> = {};
        if (next.search) query.search = next.search;
        if (next.category) query.category = next.category;

        router.get(window.location.pathname, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['services', 'filters'],
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
            {/* Hero band */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/20 bg-primary/5 px-6 py-6">
                <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                        <Briefcase className="size-6 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <Package className="size-3.5" />
                            Offering
                        </div>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Company Services
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Manage the services you offer to the community.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-center">
                    <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm">
                        <Briefcase className="size-3.5 text-primary" />
                        <span className="font-medium tabular-nums">
                            {services.total}
                        </span>
                        <span className="text-muted-foreground">
                            {services.total === 1 ? 'service' : 'services'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CompanyServicesSearch
                        initialValue={filters.search ?? ''}
                        onChange={(search) => updateFilters({ search })}
                    />
                    <CompanyServicesFilter
                        value={filters.category ?? ''}
                        categories={categories}
                        onChange={(category) => updateFilters({ category })}
                    />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="w-[1%] text-right">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No services found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.data.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">
                                            {service.name}
                                        </TableCell>
                                        <TableCell className="max-w-[280px] truncate text-muted-foreground">
                                            {service.description ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            {service.category
                                                ? categories[service.category] ??
                                                  service.category
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {Number(service.price).toFixed(2)} credits
                                        </TableCell>
                                        <TableCell>
                                            {service.is_active ? (
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
                                                new Date(service.created_at),
                                                'MMM d, yyyy',
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(
                                                new Date(service.updated_at),
                                                'MMM d, yyyy HH:mm',
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <CompanyServiceRowActions
                                                onEdit={() => setEditing(service)}
                                                onDelete={() => setDeleting(service)}
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
                        {services.total === 0
                            ? 'No results'
                            : `Showing ${services.from}–${services.to} of ${services.total}`}
                    </p>
                    <div className="flex gap-2">
                        {services.links.map((link, i) => {
                            const isPrev = i === 0;
                            const isNext = i === services.links.length - 1;
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
                                                only: ['services', 'filters'],
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
            </div>

            {editing && (
                <CompanyServiceEditDialog
                    service={editing}
                    categories={categories}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setEditing(null);
                    }}
                />
            )}

            {deleting && (
                <CompanyServiceDeleteDialog
                    service={deleting}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setDeleting(null);
                    }}
                />
            )}
        </div>
    );
}