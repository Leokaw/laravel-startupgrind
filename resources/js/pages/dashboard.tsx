import { Head } from '@inertiajs/react';
import { CompanyServicesTable } from '@/components/company-services/company-services-table';
import { DiscountedTicketsTable } from '@/components/discounted-tickets/discounted-tickets-table';

import { dashboard } from '@/routes';
import { CompanyEmployeesTable } from '@/components/employees-invited/company-employees-table';

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    services: Paginated<any>;
    filters: {
        search?: string;
        category?: string;
    };
    serviceCategories: Record<string, string>;
    tickets: Paginated<any>;
    ticketFilters: {
        ticket_search?: string;
        ticket_status?: string;
    };
    // Null when the authenticated user is not a company.
    employees: Paginated<any> | null;
    employeeFilters: {
        employee_search?: string;
        employee_status?: string;
    } | null;
};

export default function Dashboard({
    services,
    filters,
    serviceCategories,
    tickets,
    ticketFilters,
    employees,
    employeeFilters,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Company Services */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <div className="mb-6">
                        <h1 className="text-lg font-semibold">Your Services</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the company services you have created.
                        </p>
                    </div>

                    <CompanyServicesTable
                        services={services}
                        filters={filters}
                        categories={serviceCategories}
                    />
                </div>

                {/* Employees — only visible for company accounts */}
                {employees && employeeFilters && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <div className="mb-6">
                            <h1 className="text-lg font-semibold">
                                Your Employees
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                People you have invited to your company.
                            </p>
                        </div>

                        <CompanyEmployeesTable
                            employees={employees}
                            filters={employeeFilters}
                        />
                    </div>
                )}

                {/* Discounted Tickets */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <div className="mb-6">
                        <h1 className="text-lg font-semibold">
                            Your Discounted Tickets
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the discount tickets you have created.
                        </p>
                    </div>

                    <DiscountedTicketsTable
                        tickets={tickets}
                        filters={{
                            search: ticketFilters.ticket_search,
                            status: ticketFilters.ticket_status,
                        }}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};