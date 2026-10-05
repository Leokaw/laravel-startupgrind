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

type Service = {
    id: string;
    name: string;
};

type Props = {
    service: Service;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CompanyServiceDeleteDialog({
    service,
    open,
    onOpenChange,
}: Props) {
    const { delete: destroy, processing } = useForm();

    const confirm = () => {
        destroy(`/services/company/${service.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Company service deleted successfully.');
                onOpenChange(false);
            },
            onError: () => {
                toast.error('Could not delete the service. Please try again.');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete service?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the{' '}
                        <span className="font-medium text-foreground">
                            “{service.name}”
                        </span>{' '}
                        service? This action cannot be undone.
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