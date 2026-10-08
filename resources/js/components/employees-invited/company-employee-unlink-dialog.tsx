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

type Employee = {
    id: string;
    name: string;
    email: string;
};

type Props = {
    employee: Employee;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CompanyEmployeeUnlinkDialog({
    employee,
    open,
    onOpenChange,
}: Props) {
    const { delete: destroy, processing } = useForm();

    const confirm = () => {
        destroy(`/company/employees/${employee.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${employee.name} was removed from your company.`);
                onOpenChange(false);
            },
            onError: () => {
                toast.error('Could not remove the employee. Please try again.');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove from company?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="font-medium text-foreground">
                            {employee.name}
                        </span>{' '}
                        ({employee.email}) will be removed from your company.
                        Their account will remain active as a regular user,
                        and they will no longer be linked to your company.
                        This action cannot be undone.
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
                        {processing ? 'Removing…' : 'Remove'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}