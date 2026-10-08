import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Loader2, Coins, Tag, CheckCircle2 } from 'lucide-react';
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
import { BorderBeamButton } from '../ui/border-beam-button';

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    category: string | null;
};

type Props = {
    services: Service[];
    serviceCost?: number;
    onSuccess?: () => void;
};

const PAGE_SIZE = 3;

export function PurchaseServiceForm({
    services,
    serviceCost = 100,
    onSuccess,
}: Props) {
    const form = useForm({
        service_id: '',
    });

    const [pendingService, setPendingService] = useState<Service | null>(null);
    const [confirmingPurchase, setConfirmingPurchase] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    /* ---------------------------------------------------------------- */
    /* Pagination                                                        */
    /* ---------------------------------------------------------------- */

    const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));

    // Clamp in case services shrinks while the modal is open.
    const safePage = Math.min(currentPage, totalPages);

    const pagedServices = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return services.slice(start, start + PAGE_SIZE);
    }, [services, safePage]);

    // Build a compact page list: first, last, current, neighbours, and
    // ellipses where gaps occur. Same shape as shadcn's Pagination docs.
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

    const handleRadioChange = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId);
        if (!service) return;
        setPendingService(service);
    };

    const handleConfirmSelection = () => {
        if (pendingService) {
            form.setData('service_id', pendingService.id);
            if (form.errors.service_id) {
                form.clearErrors('service_id');
            }
        }
        setPendingService(null);
    };

    const handleCancelSelection = () => {
        setPendingService(null);
    };

    /* ---------------------------------------------------------------- */
    /* Submit                                                            */
    /* ---------------------------------------------------------------- */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.service_id) {
            form.setError('service_id', 'Please pick a service first.');
            return;
        }

        setConfirmingPurchase(true);
    };

    const handleConfirmPurchase = () => {
        setConfirmingPurchase(false);

        form.post(`/services/${form.data.service_id}/purchase`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Service purchased', {
                    description: `−${serviceCost} credits`,
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

    if (services.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                No services available.
            </div>
        );
    }

    const selectedService = services.find(
        (s) => s.id === form.data.service_id,
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <RadioGroup
                    value={form.data.service_id}
                    onValueChange={handleRadioChange}
                    className="flex flex-col gap-3"
                >
                    {pagedServices.map((service) => {
                        const isSelected = form.data.service_id === service.id;

                        return (
                            <FieldLabel
                                key={service.id}
                                htmlFor={`service-${service.id}`}
                                className="cursor-pointer"
                            >
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>{service.name}</FieldTitle>
                                        <FieldDescription>
                                            {service.description ??
                                                'No description provided.'}
                                        </FieldDescription>
                                    </FieldContent>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1 text-sm font-medium tabular-nums">
                                            <Coins className="h-4 w-4" />
                                            {serviceCost}
                                        </span>
                                        <RadioGroupItem
                                            value={service.id}
                                            id={`service-${service.id}`}
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


                    </div>
                )}

                {/* Selected card stays visible across pages */}
                {selectedService && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Currently selected
                        </p>
                        <p className="text-sm font-medium text-foreground">
                            {selectedService.name}
                        </p>
                    </div>
                )}

                {form.errors.service_id && (
                    <p className="text-sm text-destructive">
                        {form.errors.service_id}
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    Purchasing this service costs{' '}
                    <span className="font-medium text-foreground">
                        {serviceCost} credits
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
                    <BorderBeamButton
                        variant="secondary"
                        colorVariant="colorful"
                        beamSize="md" type="submit" disabled={form.processing}>
                        {form.processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Purchasing
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Purchase
                            </>
                        )}
                    </BorderBeamButton>
                </div>
            </form>

            {/* Stage 1 — service info dialog */}
            <AlertDialog
                open={!!pendingService}
                onOpenChange={(open) => {
                    if (!open) handleCancelSelection();
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingService?.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Review the details of this service before
                            selecting it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {pendingService && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Description
                                </p>
                                <p className="text-sm text-foreground">
                                    {pendingService.description ??
                                        'No description provided.'}
                                </p>
                            </div>

                            {pendingService.category && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Category
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="gap-1 capitalize"
                                    >
                                        <Tag className="h-3 w-3" />
                                        {pendingService.category}
                                    </Badge>
                                </div>
                            )}

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
                                    Cost
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-lg font-semibold tabular-nums text-primary">
                                    <Coins className="h-5 w-5" />
                                    {serviceCost} credits
                                </p>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelSelection}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSelection}>
                            Select this service
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
                        <AlertDialogTitle>
                            Confirm purchase?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You&apos;re about to purchase{' '}
                            <span className="font-medium text-foreground">
                                {selectedService?.name ?? 'this service'}
                            </span>
                            . The cost will be deducted from your credit
                            balance immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Total
                        </p>
                        <p className="inline-flex items-center gap-1.5 text-lg font-semibold tabular-nums text-primary">
                            <Coins className="h-5 w-5" />
                            {serviceCost} credits
                        </p>
                    </div>

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
                                    <Loader2 className=" h-4 w-4 animate-spin" />
                                    Purchasing…
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className=" h-4 w-4" />
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