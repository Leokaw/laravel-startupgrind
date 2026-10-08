import type { LucideIcon } from 'lucide-react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

type AppearanceOption = {
    value: Appearance;
    icon: LucideIcon;
    label: string;
    description: string;
};

const OPTIONS: AppearanceOption[] = [
    {
        value: 'light',
        icon: Sun,
        label: 'Light',
        description: 'Always use a light theme',
    },
    {
        value: 'dark',
        icon: Moon,
        label: 'Dark',
        description: 'Always use a dark theme',
    },
    {
        value: 'system',
        icon: Monitor,
        label: 'System',
        description: 'Match your device settings',
    },
];

export default function AppearanceDropdown({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const current = OPTIONS.find((o) => o.value === appearance) ?? OPTIONS[2];
    const CurrentIcon = current.icon;

    return (
        <div className={cn('inline-flex', className)} {...props}>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Appearance: ${current.label}`}
                            >
                                <CurrentIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Appearance: {current.label}</p>
                    </TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {OPTIONS.map(({ value, icon: Icon, label, description }) => {
                        const isActive = appearance === value;

                        return (
                            <DropdownMenuItem
                                key={value}
                                onSelect={() => updateAppearance(value)}
                                className="flex items-start gap-3"
                            >
                                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                                <div className="flex flex-1 flex-col">
                                    <span className="text-sm font-medium">
                                        {label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {description}
                                    </span>
                                </div>
                                {isActive && (
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}