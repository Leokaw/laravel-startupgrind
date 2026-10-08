import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tag, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    value?: string;
    categories: Record<string, string>;
    onChange: (value: string) => void;
};

export function CompanyServicesFilter({ value, categories, onChange }: Props) {
    const current = value && value !== '' ? value : 'all';
    const currentLabel =
        current === 'all' ? 'All categories' : (categories[current] ?? 'All categories');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'relative flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                        'dark:bg-input/30',
                        'sm:w-[220px]',
                    )}
                >
                    <span
                        className={cn(
                            'truncate text-left',
                            current === 'all' && 'text-muted-foreground',
                        )}
                    >
                        {currentLabel}
                    </span>

                    {/* Kept at right-9 to match the original spacing
                        (right of the value, left of the chevron). */}
                    <Tag className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 opacity-50" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
            >
                <DropdownMenuRadioGroup
                    value={current}
                    onValueChange={(next) => onChange(next === 'all' ? '' : next)}
                >
                    <DropdownMenuRadioItem value="all">All categories</DropdownMenuRadioItem>
                    {Object.entries(categories).map(([key, label]) => (
                        <DropdownMenuRadioItem key={key} value={key}>
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}