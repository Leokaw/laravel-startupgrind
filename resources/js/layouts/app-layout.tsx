import { AppShell } from '@/components/app-shell';
import { OnboardingGate } from '@/components/app-onboarding';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}) {
    return (
        <>
            <AppShell variant="sidebar">
                <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                    {children}
                </AppLayoutTemplate>
            </AppShell>

            <OnboardingGate />
        </>
    );
}