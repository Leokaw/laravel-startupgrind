import { router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Camera, Trash2, Mail, ImageOff, User, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { UserInteractModal } from './user-interact-modal';

type User = {
    id: string;
    name: string;
    email: string;
    user_type: 'company' | 'user' | 'freelancer' | 'employee';
    profile_photo_url: string;
    has_custom_profile_photo: boolean;
    company: { id: string; name: string } | null;
    email_verified_at: string | null;
    approved_at: string | null;
    // new:
    services: {
        id: string;
        name: string;
        description: string | null;
        price: number | string;
        category: string | null;
    }[];
    tickets: {
        id: string;
        name: string;
        description: string | null;
        discount_percentage: number | string | null;
        discount_amount: number | string | null;
    }[];
};


type Props = {
    user: User;
};

const userTypeStyles: Record<
    User['user_type'],
    { label: string; className: string }
> = {
    company: { label: 'Company', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    freelancer: { label: 'Freelancer', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20' },
    user: { label: 'Community', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    employee: { label: 'Employee', className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20' },
};

export function UserCard({ user }: Props) {
    const { auth } = usePage().props as unknown as {
        auth: { user: { id: string } | null };
    };
    const isCurrentUser = auth?.user?.id === user.id;

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [interactOpen, setInteractOpen] = useState(false);
    const [openingInteract, setOpeningInteract] = useState(false);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setProcessing(true);

        const formData = new FormData();
        formData.append('photo', file);

        router.post('/profile/photo', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile photo updated.');
                setPreview(null);
                if (fileInput.current) fileInput.current.value = '';
            },
            onError: (errors) => {
                const firstError =
                    Object.values(errors)[0] ?? 'Could not upload the photo.';
                toast.error(String(firstError));
                setPreview(null);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleDelete = () => {
        setProcessing(true);
        router.delete('/profile/photo', {
            preserveScroll: true,
            onSuccess: () => toast.success('Profile photo removed.'),
            onError: () => toast.error('Could not remove the photo.'),
            onFinish: () => setProcessing(false),
        });
    };

    const handleOpenInteract = () => {
        // Brief visual beat so the click registers before the modal mounts.
        // When services/tickets are fetched from the server on open later,
        // keep the spinner until that request resolves.
        setOpeningInteract(true);
        setTimeout(() => {
            setInteractOpen(true);
            setOpeningInteract(false);
        }, 150);
    };

    const badge = userTypeStyles[user.user_type];
    const showTrash =
        isCurrentUser && hovering && user.has_custom_profile_photo && !processing;

    return (
        <>
            <Card
                className={cn(
                    'relative overflow-hidden pt-0 transition-shadow hover:shadow-md',
                    isCurrentUser && 'ring-2 ring-rose-300 dark:ring-rose-900',
                )}
            >
                {/* Image + overlays */}
                <div
                    className="group relative aspect-square overflow-hidden"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                >
                    {preview || user.has_custom_profile_photo ? (
                        <img
                            src={preview ?? user.profile_photo_url}
                            alt={user.name}
                            className={cn(
                                'h-full w-full object-cover transition-transform duration-300',
                                showTrash && 'scale-105',
                            )}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 transition-colors dark:bg-zinc-800">
                            <ImageOff className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                        </div>
                    )}

                    {showTrash && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            aria-label="Remove profile photo"
                            className="absolute inset-0 z-30 flex items-center justify-center bg-red-600/50 backdrop-blur-[2px] transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-xl transition-transform duration-300 hover:scale-110">
                                <Trash2 className="h-6 w-6" />
                            </div>
                        </button>
                    )}

                    <Badge
                        variant="outline"
                        className={cn(
                            'absolute left-3 top-3 z-20 border backdrop-blur-sm',
                            badge.className,
                        )}
                    >
                        {badge.label}
                    </Badge>

                    {isCurrentUser && (
                        <Badge
                            variant="secondary"
                            className="absolute left-3 top-11 z-20 bg-rose-500/90 text-white shadow-sm hover:bg-rose-500/90"
                        >
                            You
                        </Badge>
                    )}

                    {isCurrentUser && (
                        <>
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={handleFile}
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => fileInput.current?.click()}
                                        disabled={processing}
                                        aria-label="Update profile picture"
                                        className="absolute right-3 top-3 z-40 flex h-7 w-7 items-center dark:bg-gray-300 dark:text-gray-900 bg-gray-700 text-gray-200 dark:hover:bg-gray-200 justify-center rounded-full text-foreground shadow-md backdrop-blur-sm transition disabled:opacity-50"
                                    >
                                        <Camera className="h-3.5 w-3.5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    Update profile picture
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>

                {/* Info */}
                <CardHeader>
                    <CardTitle className="truncate">{user.name}</CardTitle>
                    <CardDescription className="truncate">
                        {user.email}
                    </CardDescription>
                </CardHeader>

                {/* Footer button — disabled on your own card */}
                <CardFooter>
                    {isCurrentUser ? (
                        <Button className="w-full" variant="secondary" disabled>
                            <User className="mr-2 h-4 w-4" />
                            This is you
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handleOpenInteract}
                            disabled={openingInteract}
                        >
                            {openingInteract ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Interact
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Modal — mounted only when open, so state resets on close */}
            {interactOpen && (
                <UserInteractModal
                    user={user}
                    open={interactOpen}
                    onOpenChange={setInteractOpen}
                    services={user.services ?? []}
                    tickets={user.tickets ?? []}
                />
            )}
        </>
    );
}