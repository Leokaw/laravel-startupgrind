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


export function NavMain() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/dashboard')}
                        tooltip={{ children: 'Dashboard' }}
                    >
                        <Link href="/dashboard" prefetch>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{ children: 'Create discounted ticket' }}>
                        <Link href="/tickets/discounted/create" prefetch>
                            <Ticket className="mr-2 h-4 w-4" />
                            <span>Create discounted ticket</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{ children: 'Create invite ticket' }}>
                        <Link href="/tickets/invite/create" prefetch>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Create invite ticket</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{ children: 'Create company service' }}>
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