import { usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

/**
 * Compact avatar-only user menu for the app header.
 *
 * Reuses `UserMenuContent` — the same dropdown body the sidebar's NavUser
 * renders — so any change to the menu lives in one place. On the header,
 * only the trigger differs: a small avatar instead of the full name/email
 * strip.
 */
export function HeaderUserMenu() {
    const { auth } = usePage().props;
    const isMobile = useIsMobile();

    const user = auth.user;

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open user menu"
                    className={cn(
                        'focus-visible:ring-ring focus-visible:ring-offset-background rounded-full outline-none transition-transform',
                        'focus-visible:ring-2 focus-visible:ring-offset-2',
                        'hover:ring-2 hover:ring-primary/40',
                        'data-[state=open]:ring-2 data-[state=open]:ring-primary/60',
                    )}
                >
                    <Avatar className="size-8">
                        {user.has_custom_profile_photo ? (
                            <AvatarImage
                                src={user.profile_photo_url}
                                alt={user.name}
                            />
                        ) : null}

                        {/* Gray placeholder when the user has no uploaded
                            photo. Also serves as the fallback if the image
                            URL fails to load at runtime. */}
                        <AvatarFallback className="bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                            <UserRound className="size-4" />
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                side={isMobile ? 'bottom' : 'bottom'}
                className="w-56 rounded-lg"
            >
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}