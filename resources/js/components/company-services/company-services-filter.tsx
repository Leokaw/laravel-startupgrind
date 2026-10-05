import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tag } from 'lucide-react';

type Props = {
    value?: string;
    categories: Record<string, string>;
    onChange: (value: string) => void;
};

export function CompanyServicesFilter({ value, categories, onChange }: Props) {
    return (
        <Select
            value={value ?? 'all'}
            onValueChange={(next) => onChange(next === 'all' ? '' : next)}
        >
            <SelectTrigger className="relative w-full sm:w-[220px]">
                <SelectValue placeholder="All categories" />
                <Tag className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.entries(categories).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}