import { useState } from 'react';
import {
    Check,
    ChevronDown,
    Filter,
    Globe2,
    LayoutGrid,
    Search,
    Tag,
    Wallet,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type EventFilters = {
    country: string;
    type: string;
    price: string;
    tag: string;
    search: string;
};

type Option = {
    value: string;
    label: string;
    count?: number;
};

type Props = {
    filters: EventFilters;
    options: {
        countries: Option[];
        tags: Option[];
        types: Option[];
        prices: Option[];
    };
    onChange: (filters: Partial<EventFilters>) => void;
};

export function EventFilterBar({ filters, options, onChange }: Props) {
    const [searchDraft, setSearchDraft] = useState(filters.search);

    const activeCount = [
        filters.country,
        filters.type,
        filters.price,
        filters.tag,
        filters.search,
    ].filter(Boolean).length;

    const clearAll = () => {
        setSearchDraft('');
        onChange({
            country: '',
            type: '',
            price: '',
            tag: '',
            search: '',
        });
    };

    const commitSearch = () => {
        if (searchDraft !== filters.search) {
            onChange({ search: searchDraft });
        }
    };

    const labelFor = (list: Option[], value: string, fallback: string) =>
        list.find((o) => o.value === value)?.label ?? fallback;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                    <Input
                        type="text"
                        placeholder="Search events…"
                        value={searchDraft}
                        onChange={(e) => setSearchDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                commitSearch();
                            }
                        }}
                        onBlur={commitSearch}
                        className="pl-9 pr-9"
                    />
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    {searchDraft && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchDraft('');
                                onChange({ search: '' });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Country */}
                    <FilterDropdown
                        icon={Globe2}
                        label="Country"
                        activeValue={filters.country}
                        placeholder="All countries"
                        options={options.countries}
                        onChange={(value) => onChange({ country: value })}
                    />

                    {/* Type */}
                    <FilterDropdown
                        icon={LayoutGrid}
                        label="Type"
                        activeValue={filters.type}
                        placeholder="All types"
                        options={options.types}
                        onChange={(value) => onChange({ type: value })}
                    />

                    {/* Price */}
                    <FilterDropdown
                        icon={Wallet}
                        label="Price"
                        activeValue={filters.price}
                        placeholder="Any price"
                        options={options.prices}
                        onChange={(value) => onChange({ price: value })}
                    />

                    {/* Tag */}
                    <FilterDropdown
                        icon={Tag}
                        label="Category"
                        activeValue={filters.tag}
                        placeholder="All categories"
                        options={options.tags}
                        onChange={(value) => onChange({ tag: value })}
                    />

                    {activeCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" />
                            Clear
                            <Badge
                                variant="secondary"
                                className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-[10px] tabular-nums"
                            >
                                {activeCount}
                            </Badge>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Reusable dropdown                                                  */
/* ------------------------------------------------------------------ */

type FilterDropdownProps = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    activeValue: string;
    placeholder: string;
    options: Option[];
    onChange: (value: string) => void;
};

function FilterDropdown({
    icon: Icon,
    label,
    activeValue,
    placeholder,
    options,
    onChange,
}: FilterDropdownProps) {
    const active = activeValue !== '';
    const selected = options.find((o) => o.value === activeValue);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                        'gap-2',
                        active && 'border-primary/30',
                    )}
                >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="truncate">
                        {selected ? selected.label : placeholder}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup
                    value={activeValue}
                    onValueChange={(v) => onChange(v === 'all' ? '' : v)}
                >
                    <DropdownMenuRadioItem value="all">
                        <span className="text-muted-foreground">{placeholder}</span>
                    </DropdownMenuRadioItem>

                    {options.map((option) => (
                        <DropdownMenuRadioItem
                            key={option.value}
                            value={option.value}
                        >
                            <div className="flex flex-1 items-center justify-between gap-2">
                                <span>{option.label}</span>
                                {option.count !== undefined && (
                                    <span className="text-xs tabular-nums text-muted-foreground">
                                        {option.count}
                                    </span>
                                )}
                            </div>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>

                {options.length === 0 && (
                    <DropdownMenuItem disabled>
                        No options available
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}