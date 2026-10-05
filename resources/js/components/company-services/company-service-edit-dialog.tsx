import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
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

type Service = {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    is_active: boolean;
};

type Props = {
    service: Service;
    categories: Record<string, string>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CompanyServiceEditDialog({
    service,
    categories,
    open,
    onOpenChange,
}: Props) {
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        name: service.name,
        description: service.description ?? '',
        category: service.category ?? '',
        is_active: service.is_active,
    });

    useEffect(() => {
        setData({
            name: service.name,
            description: service.description ?? '',
            category: service.category ?? '',
            is_active: service.is_active,
        });
        clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service.id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(`/services/company/${service.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Company service updated successfully.');
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
                        <DialogTitle>Edit service</DialogTitle>
                        <DialogDescription>
                            Update the details of this service.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="service-name">Name</Label>
                        <Input
                            id="service-name"
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
                        <Label htmlFor="service-description">Description</Label>
                        <Textarea
                            id="service-description"
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

                    <div className="space-y-2 w-full">
                        <Label htmlFor="service-category">Category</Label>
                        <Select
                            value={data.category}
                            onValueChange={(v) => setData('category', v)}
                        >
                            <SelectTrigger className="w-full" id="service-category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(categories).map(
                                    ([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-sm text-destructive">
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="service-status">Status</Label>
                        <Select
                            value={data.is_active ? 'true' : 'false'}
                            onValueChange={(v) =>
                                setData('is_active', v === 'true')
                            }
                        >
                            <SelectTrigger className="w-full" id="service-status">
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