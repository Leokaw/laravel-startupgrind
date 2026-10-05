import { Head } from '@inertiajs/react';
import { DiscountedTicketsTable } from '@/components/discounted-tickets/discounted-tickets-table';
import { dashboard } from '@/routes';

type Props = {
    tickets: {
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
        status?: string;
    };
};

export default function DiscountedTicketsIndex({ tickets, filters }: Props) {
    return (
        <>
            <Head title="Discounted Tickets" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        filters={filters}
                    />
                </div>
            </div>
        </>
    );
}

DiscountedTicketsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Discounted Tickets',
            href: '/tickets/discounted',
        },
    ],
};