import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

type SharedProps = {
    sidebarOpen: boolean;
};

/**
 * Wraps authenticated pages in the sidebar provider (or a plain flex column
 * for header-variant layouts). Reads the initial open state from the shared
 * `sidebarOpen` prop, which is derived from the `sidebar_state` cookie
 * server-side — so the sidebar doesn't flash open/closed on first paint.
 */
export function AppShell({ children, variant = 'sidebar' }: Props) {
    const { sidebarOpen } = usePage<SharedProps>().props;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            {children}
        </SidebarProvider>
    );
}