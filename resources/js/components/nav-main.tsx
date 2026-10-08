import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Ticket,
    UserPlus,
    Building2,
    Users,
    Bell,
    CreditCard,
    CalendarDays,
} from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

const activeClasses =
    'data-[active=true]:border data-[active=true]:border-primary/30 ' +
    'data-[active=true]:bg-primary/10 data-[active=true]:text-primary ' +
    'data-[active=true]:hover:bg-primary/15 data-[active=true]:hover:text-primary ' +
    'dark:data-[active=true]:border-primary/40 ' +
    'dark:data-[active=true]:bg-primary/15 dark:data-[active=true]:text-primary ' +
    'dark:data-[active=true]:hover:bg-primary/20 dark:data-[active=true]:hover:text-primary';

// Only color transitions — no layout shift.
const itemMotion =
    'transition-colors duration-200 ease-out ' +
    'motion-reduce:transition-none';

export function NavMain() {
    const { isCurrentUrl } = useCurrentUrl();

    const { unreadNotificationsCount } = usePage().props as unknown as {
        unreadNotificationsCount: number;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/dashboard')}
                        tooltip={{ children: 'Dashboard' }}
                        className={cn(activeClasses, itemMotion)}
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
                        className={cn(activeClasses, itemMotion)}
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
                        className={cn(activeClasses, itemMotion)}
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
                        className={cn(activeClasses, itemMotion)}
                    >
                        <Link href="/services/company/create" prefetch>
                            <Building2 className="mr-2 h-4 w-4" />
                            <span>Create company service</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/community')}
                        tooltip={{ children: 'Community' }}
                        className={cn(activeClasses, itemMotion)}
                    >
                        <Link href="/community" prefetch>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Community</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl('/notifications')}
                        tooltip={{ children: 'Notifications' }}
                        className={cn(activeClasses, itemMotion)}
                    >
                        <Link href="/notifications" prefetch>
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                            {unreadNotificationsCount > 0 && (
                                <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                                    {unreadNotificationsCount > 99
                                        ? '99+'
                                        : unreadNotificationsCount}
                                </span>
                            )}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

               
                <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isCurrentUrl('/events')}
                    tooltip={{ children: 'Events' }}
                    className={cn(activeClasses, itemMotion)}
                >
                    <Link href="/events" prefetch>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span>Events</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
            
        </SidebarGroup>
    );
}