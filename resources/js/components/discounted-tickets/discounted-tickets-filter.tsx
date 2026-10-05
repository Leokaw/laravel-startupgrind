import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CircleDot } from 'lucide-react';

type Props = {
    value?: string;
    onChange: (value: string) => void;
};

export function DiscountedTicketsFilter({ value, onChange }: Props) {
    return (
        <Select
            value={value || 'all'}
            onValueChange={(next) => onChange(next === 'all' ? '' : next)}
        >
            <SelectTrigger className="relative w-full sm:w-[220px]">
                <SelectValue placeholder="All statuses" />
                <CircleDot className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
        </Select>
    );
}