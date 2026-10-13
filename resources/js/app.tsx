import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function RootProviders({ children }: { children: ReactNode }) {
    useFlashToast();

    return (
        <TooltipProvider delayDuration={0}>
            {children}
            <Toaster />
        </TooltipProvider>
    );
}

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob<ResolvedComponent>('./pages/**/*.tsx'),
        ),

    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'invite/accept':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return <RootProviders>{app}</RootProviders>;
    },

    progress: {
        color: 'red',
    },
});

initializeTheme();