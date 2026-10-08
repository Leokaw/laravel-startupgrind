import { useState } from 'react';
import { Building2, UserCheck } from 'lucide-react';
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
import { CompanyEmployeesSearch } from './company-employees-search';
import { CompanyEmployeesFilter } from './company-employees-filter';
import { CompanyEmployeeRowActions } from './company-employee-row-actions';
import { CompanyEmployeeUnlinkDialog } from './company-employee-unlink-dialog';

type Employee = {
    id: string;
    name: string;
    email: string;
    user_type: 'employee' | 'user' | 'freelancer' | 'company';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

type PaginatedEmployees = {
    data: Employee[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    employees: PaginatedEmployees;
    filters: {
        employee_search?: string;
        employee_status?: string;
    };
};

export function CompanyEmployeesTable({ employees, filters }: Props) {
    const [unlinking, setUnlinking] = useState<Employee | null>(null);

    const updateFilters = (patch: Partial<Props['filters']>) => {
        const next = { ...filters, ...patch };
        const query: Record<string, string> = {};
        if (next.employee_search) query.employee_search = next.employee_search;
        if (next.employee_status) query.employee_status = next.employee_status;

        router.get(window.location.pathname, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['employees', 'employeeFilters'],
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
            {/* Hero band */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/20 bg-primary/5 px-6 py-6">
                <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                        <UserCheck className="size-6 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <Building2 className="size-3.5" />
                            Team
                        </div>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Employees
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Manage the people who work at your company.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-center">
                    <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm">
                        <UserCheck className="size-3.5 text-primary" />
                        <span className="font-medium tabular-nums">
                            {employees.total}
                        </span>
                        <span className="text-muted-foreground">
                            {employees.total === 1 ? 'employee' : 'employees'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CompanyEmployeesSearch
                        initialValue={filters.employee_search ?? ''}
                        onChange={(search) =>
                            updateFilters({ employee_search: search })
                        }
                    />
                    <CompanyEmployeesFilter
                        value={filters.employee_status ?? ''}
                        onChange={(status) =>
                            updateFilters({ employee_status: status })
                        }
                    />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Invited</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="w-[1%] text-right">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.data.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">
                                            {employee.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.email}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {employee.user_type}
                                        </TableCell>
                                        <TableCell>
                                            {employee.email_verified_at ? (
                                                <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                                >
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(
                                                new Date(employee.created_at),
                                                'MMM d, yyyy',
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(
                                                new Date(employee.updated_at),
                                                'MMM d, yyyy HH:mm',
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <CompanyEmployeeRowActions
                                                onUnlink={() =>
                                                    setUnlinking(employee)
                                                }
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
                        {employees.total === 0
                            ? 'No results'
                            : `Showing ${employees.from}–${employees.to} of ${employees.total}`}
                    </p>
                    <div className="flex gap-2">
                        {employees.links.map((link, i) => {
                            const isPrev = i === 0;
                            const isNext = i === employees.links.length - 1;
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
                                                only: [
                                                    'employees',
                                                    'employeeFilters',
                                                ],
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

            {unlinking && (
                <CompanyEmployeeUnlinkDialog
                    employee={unlinking}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setUnlinking(null);
                    }}
                />
            )}
        </div>
    );
}