import type { ComponentPropsWithoutRef } from 'react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavFooter({
   

}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    
}) {
    return (
        <SidebarGroup
    
            className='group-data-[collapsible=icon]:p-0'
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
