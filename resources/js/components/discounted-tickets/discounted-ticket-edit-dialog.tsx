import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const inputLikeClasses =
    'flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive';

type DiscountTicket = {
    id: string;
    name: string;
    description: string | null;
    discount_percentage: string | null;
    valid_from: string;
    valid_until: string;
    usage_limit: number | null;
    is_active: boolean;
};

type Props = {
    ticket: DiscountTicket;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DiscountTicketEditDialog({ ticket, open, onOpenChange }: Props) {
    const [validFrom, setValidFrom] = useState<Date | undefined>(
        ticket.valid_from ? new Date(ticket.valid_from) : undefined,
    );
    const [validUntil, setValidUntil] = useState<Date | undefined>(
        ticket.valid_until ? new Date(ticket.valid_until) : undefined,
    );

    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        name: ticket.name,
        description: ticket.description ?? '',
        discount_percentage: ticket.discount_percentage ?? '',
        valid_from: ticket.valid_from
            ? format(new Date(ticket.valid_from), 'yyyy-MM-dd')
            : '',
        valid_until: ticket.valid_until
            ? format(new Date(ticket.valid_until), 'yyyy-MM-dd')
            : '',
        is_active: ticket.is_active,
    });

    useEffect(() => {
        setData({
            name: ticket.name,
            description: ticket.description ?? '',
            discount_percentage: ticket.discount_percentage ?? '',
            valid_from: ticket.valid_from
                ? format(new Date(ticket.valid_from), 'yyyy-MM-dd')
                : '',
            valid_until: ticket.valid_until
                ? format(new Date(ticket.valid_until), 'yyyy-MM-dd')
                : '',
            is_active: ticket.is_active,
        });
        setValidFrom(ticket.valid_from ? new Date(ticket.valid_from) : undefined);
        setValidUntil(
            ticket.valid_until ? new Date(ticket.valid_until) : undefined,
        );
        clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticket.id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(`/tickets/discounted/${ticket.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Discounted ticket updated successfully.');
                onOpenChange(false);
            },
            onError: () => {
                toast.error('Please fix the errors and try again.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Edit discounted ticket</DialogTitle>
                        <DialogDescription>
                            Update the details of this discount ticket.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="ticket-name">Name</Label>
                        <Input
                            id="ticket-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            maxLength={50}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ticket-description">
                            Description
                        </Label>
                        <Textarea
                            id="ticket-description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            maxLength={200}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ticket-discount">
                            Discount Percentage
                        </Label>
                        <Input
                            id="ticket-discount"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={data.discount_percentage}
                            onChange={(e) =>
                                setData('discount_percentage', e.target.value)
                            }
                        />
                        {errors.discount_percentage && (
                            <p className="text-sm text-destructive">
                                {errors.discount_percentage}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="valid_from">Valid From</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    id="valid_from"
                                    className={cn(
                                        inputLikeClasses,
                                        'relative h-9 cursor-pointer items-center text-left',
                                        !validFrom && 'text-muted-foreground',
                                    )}
                                >
                                    {validFrom
                                        ? format(validFrom, 'PPP')
                                        : 'Pick a date'}
                                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={validFrom}
                                    onSelect={(d) => {
                                        setValidFrom(d);
                                        setData(
                                            'valid_from',
                                            d ? format(d, 'yyyy-MM-dd') : '',
                                        );
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.valid_from && (
                            <p className="text-sm text-destructive">
                                {errors.valid_from}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="valid_until">Valid Until</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    id="valid_until"
                                    className={cn(
                                        inputLikeClasses,
                                        'relative h-9 cursor-pointer items-center text-left',
                                        !validUntil && 'text-muted-foreground',
                                    )}
                                >
                                    {validUntil
                                        ? format(validUntil, 'PPP')
                                        : 'Pick a date'}
                                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={validUntil}
                                    onSelect={(d) => {
                                        setValidUntil(d);
                                        setData(
                                            'valid_until',
                                            d ? format(d, 'yyyy-MM-dd') : '',
                                        );
                                    }}
                                    disabled={{ before: validFrom ?? new Date() }}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.valid_until && (
                            <p className="text-sm text-destructive">
                                {errors.valid_until}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ticket-status">Status</Label>
                        <Select
                            value={data.is_active ? 'true' : 'false'}
                            onValueChange={(v) =>
                                setData('is_active', v === 'true')
                            }
                        >
                            <SelectTrigger className="w-full" id="ticket-status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.is_active && (
                            <p className="text-sm text-destructive">
                                {errors.is_active}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}