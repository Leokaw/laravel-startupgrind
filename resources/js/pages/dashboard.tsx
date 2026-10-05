import { Head } from '@inertiajs/react';
import { CompanyServicesTable } from '@/components/company-services/company-services-table';
import { DiscountedTicketsTable } from '@/components/discounted-tickets/discounted-tickets-table';
import { dashboard } from '@/routes';

type Props = {
    services: {
        data: any[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: {
        search?: string;
        category?: string;
    };
    serviceCategories: Record<string, string>;
    tickets: {
        data: any[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
    ticketFilters: {
        ticket_search?: string;
        ticket_status?: string;
    };
};

export default function Dashboard({
    services,
    filters,
    serviceCategories,
    tickets,
    ticketFilters,
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