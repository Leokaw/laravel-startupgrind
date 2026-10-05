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
        <div className="space-y-4">
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

            {/* Edit dialog — mounted only when a row is selected */}
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