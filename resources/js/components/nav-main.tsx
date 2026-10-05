import { Link } from '@inertiajs/react';
import { LayoutDashboard, Ticket, UserPlus, Building2 } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';

const activeClasses =
    'data-[active=true]:border data-[active=true]:border-rose-300 ' +
    'data-[active=true]:bg-rose-50 data-[active=true]:text-rose-700 ' +
    'data-[active=true]:hover:bg-rose-100 data-[active=true]:hover:text-rose-800 ' +
    'dark:data-[active=true]:border-rose-900 ' +
    'dark:data-[active=true]:bg-rose-950/40 dark:data-[active=true]:text-rose-300 ' +
    'dark:data-[active=true]:hover:bg-rose-950/60 dark:data-[active=true]:hover:text-rose-200';

export function NavMain() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/dashboard')}
                        tooltip={{ children: 'Dashboard' }}
                        className={activeClasses}
                    >
                        <Link href="/dashboard" prefetch>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/tickets/discounted/create')}
                        tooltip={{ children: 'Create discounted ticket' }}
                        className={activeClasses}
                    >
                        <Link href="/tickets/discounted/create" prefetch>
                            <Ticket className="mr-2 h-4 w-4" />
                            <span>Create discounted ticket</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/tickets/invite/create')}
                        tooltip={{ children: 'Create invite ticket' }}
                        className={activeClasses}
                    >
                        <Link href="/tickets/invite/create" prefetch>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Create invite ticket</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/services/company/create')}
                        tooltip={{ children: 'Create company service' }}
                        className={activeClasses}
                    >
                        <Link href="/services/company/create" prefetch>
                            <Building2 className="mr-2 h-4 w-4" />
                            <span>Create company service</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}