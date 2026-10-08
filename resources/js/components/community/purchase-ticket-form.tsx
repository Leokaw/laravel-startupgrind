import { useForm } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Ticket, Loader2, Coins, Tag, CheckCircle2, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type DiscountTicket = {
    id: string;
    name: string;
    description: string | null;
    discount_percentage: number | string | null;
    discount_amount: number | string | null;
};

type Props = {
    tickets: DiscountTicket[];
    ticketCost?: number;
    onSuccess?: () => void;
};

const PAGE_SIZE = 3;

export function PurchaseTicketForm({
    tickets,
    ticketCost = 50,
    onSuccess,
}: Props) {
    const form = useForm({
        ticket_id: '',
    });

    const [pendingTicket, setPendingTicket] = useState<DiscountTicket | null>(null);
    const [confirmingPurchase, setConfirmingPurchase] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    /* ---------------------------------------------------------------- */
    /* Pagination                                                        */
    /* ---------------------------------------------------------------- */

    const totalPages = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const pagedTickets = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return tickets.slice(start, start + PAGE_SIZE);
    }, [tickets, safePage]);

    const pageNumbers = useMemo<(number | 'ellipsis')[]>(() => {
        const pages: (number | 'ellipsis')[] = [];
        const window = 1;

        for (let i = 1; i <= totalPages; i++) {
            const isEdge = i === 1 || i === totalPages;
            const isNear = Math.abs(i - safePage) <= window;

            if (isEdge || isNear) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== 'ellipsis') {
                pages.push('ellipsis');
            }
        }
        return pages;
    }, [totalPages, safePage]);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === safePage) return;
        setCurrentPage(page);
    };

    /* ---------------------------------------------------------------- */
    /* Selection flow                                                    */
    /* ---------------------------------------------------------------- */

    const handleRadioChange = (ticketId: string) => {
        const ticket = tickets.find((t) => t.id === ticketId);
        if (!ticket) return;
        setPendingTicket(ticket);
    };

    const handleConfirmSelection = () => {
        if (pendingTicket) {
            form.setData('ticket_id', pendingTicket.id);
            if (form.errors.ticket_id) {
                form.clearErrors('ticket_id');
            }
        }
        setPendingTicket(null);
    };

    const handleCancelSelection = () => {
        setPendingTicket(null);
    };

    /* ---------------------------------------------------------------- */
    /* Submit                                                            */
    /* ---------------------------------------------------------------- */

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!form.data.ticket_id) {
            form.setError('ticket_id', 'Please pick a ticket first.');
            return;
        }

        setConfirmingPurchase(true);
    };

    const handleConfirmPurchase = () => {
        setConfirmingPurchase(false);

        form.post(`/tickets/${form.data.ticket_id}/purchase`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Ticket purchased', {
                    description: `−${ticketCost} credits`,
                });
                form.reset();
                onSuccess?.();
            },
            onError: (errors) => {
                const first =
                    Object.values(errors)[0] ??
                    'Could not complete the purchase. Please try again.';
                toast.error('Purchase failed', {
                    description: String(first),
                });
            },
        });
    };

    if (tickets.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                No discount tickets available.
            </div>
        );
    }

    const selectedTicket = tickets.find((t) => t.id === form.data.ticket_id);

    const discountLabel = (ticket: DiscountTicket): string => {
        if (
            ticket.discount_percentage !== null &&
            ticket.discount_percentage !== undefined
        ) {
            return `${Number(ticket.discount_percentage).toFixed(0)}% off`;
        }
        if (
            ticket.discount_amount !== null &&
            ticket.discount_amount !== undefined
        ) {
            return `${Number(ticket.discount_amount).toFixed(2)} credits off`;
        }
        return 'Discount';
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <RadioGroup
                    value={form.data.ticket_id}
                    onValueChange={handleRadioChange}
                    className="flex flex-col gap-3"
                >
                    {pagedTickets.map((ticket) => {
                        const isSelected = form.data.ticket_id === ticket.id;

                        return (
                            <FieldLabel
                                key={ticket.id}
                                htmlFor={`ticket-${ticket.id}`}
                                className="cursor-pointer"
                            >
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>{ticket.name}</FieldTitle>
                                        <FieldDescription>
                                            {ticket.description ??
                                                'No description provided.'}
                                        </FieldDescription>
                                    </FieldContent>
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant="secondary"
                                            className="whitespace-nowrap"
                                        >
                                            {discountLabel(ticket)}
                                        </Badge>
                                        <span className="inline-flex items-center gap-1 text-sm font-medium tabular-nums">
                                            <Coins className="h-4 w-4" />
                                            {ticketCost}
                                        </span>
                                        <RadioGroupItem
                                            value={ticket.id}
                                            id={`ticket-${ticket.id}`}
                                            disabled={form.processing}
                                        />
                                    </div>
                                </Field>
                            </FieldLabel>
                        );
                    })}
                </RadioGroup>

                {/* Pagination — only when there's more than one page */}
                {totalPages > 1 && (
                    <div className="flex flex-col gap-2 pt-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        aria-disabled={safePage === 1}
                                        className={cn(
                                            safePage === 1 &&
                                                'pointer-events-none opacity-50',
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPage(safePage - 1);
                                        }}
                                    />
                                </PaginationItem>

                                {pageNumbers.map((p, i) =>
                                    p === 'ellipsis' ? (
                                        <PaginationItem key={`gap-${i}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                href="#"
                                                isActive={p === safePage}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    goToPage(p);
                                                }}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ),
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        aria-disabled={safePage === totalPages}
                                        className={cn(
                                            safePage === totalPages &&
                                                'pointer-events-none opacity-50',
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPage(safePage + 1);
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>

                        <p className="text-center text-xs text-muted-foreground">
                            Showing {pagedTickets.length} of {tickets.length}{' '}
                            tickets — page {safePage} of {totalPages}
                        </p>
                    </div>
                )}

                {/* Selected card stays visible across pages */}
                {selectedTicket && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Currently selected
                        </p>
                        <p className="text-sm font-medium text-foreground">
                            {selectedTicket.name}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                            <Percent className="h-3 w-3" />
                            {discountLabel(selectedTicket)}
                        </p>
                    </div>
                )}

                {form.errors.ticket_id && (
                    <p className="text-sm text-destructive">
                        {form.errors.ticket_id}
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    Purchasing this ticket costs{' '}
                    <span className="font-medium text-foreground">
                        {ticketCost} credits
                    </span>
                    .
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onSuccess?.()}
                        disabled={form.processing}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Purchasing
                            </>
                        ) : (
                            <>
                                <Ticket className="mr-2 h-4 w-4" />
                                Purchase
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Stage 1 — ticket info dialog */}
            <AlertDialog
                open={!!pendingTicket}
                onOpenChange={(open) => {
                    if (!open) handleCancelSelection();
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingTicket?.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Review the details of this discount ticket before
                            selecting it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {pendingTicket && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Description
                                </p>
                                <p className="text-sm text-foreground">
                                    {pendingTicket.description ??
                                        'No description provided.'}
                                </p>
                            </div>

                            <div className="space-y-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Discount
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                                    <Percent className="h-5 w-5" />
                                    {discountLabel(pendingTicket)}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant="outline"
                                    className="gap-1 border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                >
                                    <CheckCircle2 className="h-3 w-3" />
                                    Available
                                </Badge>
                            </div>

                            <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Purchase cost
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-lg font-semibold tabular-nums text-primary">
                                    <Coins className="h-5 w-5" />
                                    {ticketCost} credits
                                </p>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelSelection}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSelection}>
                            Select this ticket
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Stage 2 — purchase confirmation */}
            <AlertDialog
                open={confirmingPurchase}
                onOpenChange={setConfirmingPurchase}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm purchase?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You&apos;re about to purchase{' '}
                            <span className="font-medium text-foreground">
                                {selectedTicket?.name ?? 'this ticket'}
                            </span>
                            . The cost will be deducted from your credit
                            balance immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {selectedTicket && (
                        <div className="space-y-2">
                            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    You&apos;ll get
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                                    <Percent className="h-5 w-5" />
                                    {discountLabel(selectedTicket)}
                                </p>
                            </div>

                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Total
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-lg font-semibold tabular-nums text-primary">
                                    <Coins className="h-5 w-5" />
                                    {ticketCost} credits
                                </p>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={form.processing}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmPurchase();
                            }}
                            disabled={form.processing}
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Purchasing…
                                </>
                            ) : (
                                <>
                                    <Ticket className="mr-2 h-4 w-4" />
                                    Confirm purchase
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}