import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Single source of truth for the brand. Rename here and it updates everywhere. */
export const BRAND = {
    first: 'found',
    second: 'ly',
    tagline: 'Where ambition meets opportunity',
} as const;

export function BrandMark({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex size-9  items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30',
                className,
            )}
        >
            <Rocket className="size-5 -rotate-45" strokeWidth={2.25} />
        </span>
    );
}

export function BrandWordmark({ className }: { className?: string }) {
    return (
        <span className={cn('text-2xl !grotesk tracking-tight', className)}>
            <span>{BRAND.first}</span>
            <span>{BRAND.second}</span>
        </span>
    );
}

export default function Brand({ className }: { className?: string }) {
    return (
        <span className={cn('inline-flex items-center !grotesk  gap-2.5', className)}>
            <BrandMark />
            <BrandWordmark />
        </span>
    );
}