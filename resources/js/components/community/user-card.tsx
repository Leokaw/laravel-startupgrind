import { router, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    Camera,
    Trash2,
    Mail,
    ImageOff,
    User,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    CutoutCard,
    CutoutCardAction,
    CutoutCardContent,
    CutoutCardImage,
    CutoutCardMedia,
    CutoutCardOverlay,
    CutoutCardPin,
    cutoutCardSurfaceClassName,
    CutoutCorner,
    useCutoutContentStaggerVariants,
} from '@/components/ui/cutout-card';
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
    employees: {
        id: string;
        name: string;
        email: string;
        profile_photo_url: string;
        has_custom_profile_photo: boolean;
        email_verified_at: string | null;
        created_at: string | null;
    }[];
};

type Props = {
    user: User;
};

const userTypeStyles: Record<
    User['user_type'],
    { label: string; pinClass: string; cornerClass: string }
> = {
    company: {
        label: 'Company',
        pinClass: 'bg-blue-500 text-white',
        cornerClass: 'text-blue-500',
    },
    freelancer: {
        label: 'Freelancer',
        pinClass: 'bg-amber-500 text-white',
        cornerClass: 'text-amber-500',
    },
    user: {
        label: 'Community',
        pinClass: 'bg-emerald-500 text-white',
        cornerClass: 'text-emerald-500',
    },
    employee: {
        label: 'Employee',
        pinClass: 'bg-purple-500 text-white',
        cornerClass: 'text-purple-500',
    },
};

export function UserCard({ user }: Props) {
    const { auth, can_view_team } = usePage().props as unknown as {
        auth: { user: { id: string } | null };
        can_view_team: boolean;
    };
    const isCurrentUser = auth?.user?.id === user.id;

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [interactOpen, setInteractOpen] = useState(false);
    const [openingInteract, setOpeningInteract] = useState(false);

    const stagger = useCutoutContentStaggerVariants();

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
            <CutoutCard
                className={cn(
                    cutoutCardSurfaceClassName,
                    isCurrentUser && 'ring-2 ring-primary/60 dark:ring-primary/50',
                )}
            >
                <CutoutCardMedia
                    className="aspect-square"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                >
                    {preview || user.has_custom_profile_photo ? (
                        <CutoutCardImage
                            src={preview ?? user.profile_photo_url}
                            alt={user.name}
                            className={cn(showTrash && 'scale-105')}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 transition-colors dark:bg-zinc-800">
                            <ImageOff className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                        </div>
                    )}

                    <CutoutCardOverlay />

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

                    <CutoutCardPin
                        className={cn(
                            'top-0 right-0 rounded-bl-[16px] px-3 py-1.5 text-xs font-semibold shadow-md',
                            badge.pinClass,
                        )}
                    >
                        {badge.label}
                        <CutoutCorner
                            className={cn(
                                'absolute top-0 -left-[23px] -rotate-90',
                                badge.cornerClass,
                            )}
                            size={24}
                        />
                        <CutoutCorner
                            className={cn(
                                'absolute right-0 -bottom-[23px] -rotate-90',
                                badge.cornerClass,
                            )}
                            size={24}
                        />
                    </CutoutCardPin>

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
                                        onClick={() =>
                                            fileInput.current?.click()
                                        }
                                        disabled={processing}
                                        aria-label="Update profile picture"
                                        className="absolute left-3 top-3 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-sm transition hover:bg-black/70 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Update profile picture
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </CutoutCardMedia>

                <CutoutCardContent className="pb-16">
                    <motion.div
                        className="contents"
                        initial="hidden"
                        animate="show"
                        variants={stagger.container}
                    >
                        <motion.div
                            variants={stagger.item}
                            className="mb-1 flex items-center gap-2"
                        >
                            <h3 className="text-card-foreground min-w-0 flex-1 truncate text-base leading-snug font-semibold">
                                {user.name}
                            </h3>
                            {isCurrentUser && (
                                <span className="bg-primary text-white inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                                    You
                                </span>
                            )}
                        </motion.div>

                        <motion.p
                            variants={stagger.item}
                            className="text-muted-foreground truncate text-sm"
                        >
                            {user.email}
                        </motion.p>
                    </motion.div>
                </CutoutCardContent>

                {isCurrentUser ? (
                    <div className="absolute bottom-5 left-5 right-5">
                        <Button
                            className="w-full"
                            variant="secondary"
                            disabled
                        >
                            <User className="mr-2 h-4 w-4" />
                            This is you
                        </Button>
                    </div>
                ) : (
                    <CutoutCardAction className="right-5 bottom-5">
                        <Button
                            size="sm"
                            onClick={handleOpenInteract}
                            disabled={openingInteract}
                            className="gap-1.5 rounded-full px-4 py-2 shadow-md"
                        >
                            {openingInteract ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Loading
                                </>
                            ) : (
                                <>
                                    <Mail className="size-3.5" />
                                    Interact
                                </>
                            )}
                        </Button>
                    </CutoutCardAction>
                )}
            </CutoutCard>

            {interactOpen && (
                <UserInteractModal
                    user={user}
                    open={interactOpen}
                    onOpenChange={setInteractOpen}
                    services={user.services ?? []}
                    tickets={user.tickets ?? []}
                    employees={user.employees ?? []}
                    canViewTeam={can_view_team}
                />
            )}
        </>
    );
}