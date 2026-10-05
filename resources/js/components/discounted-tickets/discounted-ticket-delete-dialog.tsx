import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type DiscountTicket = {
    id: string;
    name: string;
};

type Props = {
    ticket: DiscountTicket;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DiscountTicketDeleteDialog({
    ticket,
    open,
    onOpenChange,
}: Props) {
    const { delete: destroy, processing } = useForm();

    const confirm = () => {
        destroy(`/tickets/discounted/${ticket.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Discounted ticket deleted successfully.');
                onOpenChange(false);
            },
            onError: () => {
                toast.error('Could not delete the ticket. Please try again.');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete ticket?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the{' '}
                        <span className="font-medium text-foreground">
                            “{ticket.name}”
                        </span>{' '}
                        ticket? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={confirm}
                        disabled={processing}
                    >
                        {processing ? 'Deleting…' : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}