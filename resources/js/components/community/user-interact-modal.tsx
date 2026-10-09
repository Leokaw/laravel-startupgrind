import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    MessageSquare,
    Briefcase,
    Ticket,
    Users,
    ImageOff,
    Crown,
    ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HaloToggleGroup } from '@/components/ui/halo-toggle-group';
import { cn } from '@/lib/utils';
import { SendMessageForm } from './send-message-form';
import { PurchaseServiceForm } from './purchase-service-form';
import { PurchaseTicketForm } from './purchase-ticket-form';

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
};

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    category: string | null;
};

type DiscountTicket = {
    id: string;
    name: string;
    description: string | null;
    discount_percentage: number | string | null;
    discount_amount: number | string | null;
};

type Employee = {
    id: string;
    name: string;
    email: string;
    profile_photo_url: string;
    has_custom_profile_photo: boolean;
    email_verified_at: string | null;
    created_at: string | null;
};

type Props = {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    services?: Service[];
    tickets?: DiscountTicket[];
    employees?: Employee[];
    /** Whether the current authenticated user has Pro tier or higher. */
    canViewTeam?: boolean;
    messageCost?: number;
    ticketCost?: number;
};

type TabValue = 'message' | 'services' | 'tickets' | 'employees';

const userTypeStyles: Record<
    User['user_type'],
    { label: string; className: string }
> = {
    company:    { label: 'Company',    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    freelancer: { label: 'Freelancer', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20' },
    user:       { label: 'Community',  className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    employee:   { label: 'Employee',   className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20' },
};

export function UserInteractModal({
    user,
    open,
    onOpenChange,
    services = [],
    tickets = [],
    employees = [],
    canViewTeam = false,
    messageCost = 50,
    ticketCost = 50,
}: Props) {
    const badge = userTypeStyles[user.user_type];
    const [activeTab, setActiveTab] = useState<TabValue>('message');
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

    const handleClose = () => onOpenChange(false);

    const isCompany = user.user_type === 'company';

    /**
     * Intercept tab changes: if the user lacks Pro and clicks the Team
     * tab, show the upgrade prompt instead of switching. The toggle thumb
     * stays on the previous tab, which is exactly what we want — the
     * click "does nothing" visually, and the dialog explains why.
     */
    const handleTabChange = (next: string) => {
        if (next === 'employees' && !canViewTeam) {
            setUpgradeDialogOpen(true);
            return;
        }

        setActiveTab(next as TabValue);
    };

    const goToBilling = () => {
        setUpgradeDialogOpen(false);
        handleClose();
        router.visit('/billing');
    };

    const tabs = [
        {
            value: 'message',
            label: (
                <span className="inline-flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Message</span>
                </span>
            ),
        },
        {
            value: 'services',
            label: (
                <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="hidden sm:inline">Services</span>
                </span>
            ),
        },
        {
            value: 'tickets',
            label: (
                <span className="inline-flex items-center gap-2">
                    <Ticket className="h-4 w-4" />
                    <span className="hidden sm:inline">Tickets</span>
                </span>
            ),
        },
    ];

    if (isCompany) {
        tabs.push({
            value: 'employees',
            label: (
                <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Team</span>
                    {canViewTeam && employees.length > 0 && (
                        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-semibold tabular-nums">
                            {employees.length}
                        </span>
                    )}
                    {!canViewTeam && (
                        <Crown className="h-3 w-3 text-amber-500" />
                    )}
                </span>
            ),
        });
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Interact with {user.name}</DialogTitle>
                        <DialogDescription>
                            {isCompany
                                ? 'Send a message, purchase a service, grab a discount ticket, or meet the team.'
                                : 'Send a message, purchase a service, or grab a discount ticket.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                        {/* Left column — profile photo (or placeholder) */}
                        <div className="flex flex-col gap-3">
                            <div className="relative aspect-square overflow-hidden rounded-xl">
                                {user.has_custom_profile_photo ? (
                                    <img
                                        src={user.profile_photo_url}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                        <ImageOff className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <p className="truncate text-sm font-semibold">
                                    {user.name}
                                </p>
                                <Badge
                                    variant="outline"
                                    className={cn('text-xs', badge.className)}
                                >
                                    {badge.label}
                                </Badge>
                            </div>
                        </div>

                        {/* Right column — halo tabs + content */}
                        <div className="w-full space-y-4">
                            <HaloToggleGroup
                                items={tabs}
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="!w-full"
                            />

                            {activeTab === 'message' && (
                                <SendMessageForm
                                    user={user}
                                    messageCost={messageCost}
                                    onSuccess={handleClose}
                                />
                            )}

                            {activeTab === 'services' && (
                                <PurchaseServiceForm
                                    services={services}
                                    onSuccess={handleClose}
                                />
                            )}

                            {activeTab === 'tickets' && (
                                <PurchaseTicketForm
                                    tickets={tickets}
                                    ticketCost={ticketCost}
                                    onSuccess={handleClose}
                                />
                            )}

                            {activeTab === 'employees' && canViewTeam && (
                                <CompanyTeamList employees={employees} />
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upgrade prompt */}
            <AlertDialog
                open={upgradeDialogOpen}
                onOpenChange={setUpgradeDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mb-1 flex size-11 items-center justify-center rounded-2xl bg-amber-500/15">
                            <Crown className="size-5 text-amber-500" />
                        </div>
                        <AlertDialogTitle>
                            Unlock Team View with Pro
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Seeing a company's employees is a Pro feature.
                            Upgrade to browse everyone on{' '}
                            <span className="font-medium text-foreground">
                                {user.name}
                            </span>
                            's team.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ul className="space-y-2 py-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <Users className="size-4 shrink-0 text-primary" />
                            See up to 5 employees per company
                        </li>
                        <li className="flex items-center gap-2">
                            <Crown className="size-4 shrink-0 text-primary" />
                            Unlock every Pro perk, including +500 bonus credits
                        </li>
                    </ul>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Not now</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={goToBilling}
                            className="gap-1.5"
                        >
                            View plans
                            <ArrowRight className="size-4" />
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Team list                                                          */
/* ------------------------------------------------------------------ */

function CompanyTeamList({ employees }: { employees: Employee[] }) {
    if (employees.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
                <Users className="h-6 w-6 opacity-50" />
                <span>No team members yet.</span>
            </div>
        );
    }

    return (
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {employees.map((employee) => {
                const isActive = employee.email_verified_at !== null;

                return (
                    <div
                        key={employee.id}
                        className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                    >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            {employee.has_custom_profile_photo ? (
                                <img
                                    src={employee.profile_photo_url}
                                    alt={employee.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                    <ImageOff className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {employee.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {employee.email}
                            </p>
                        </div>

                        <Badge
                            variant="outline"
                            className={cn(
                                'shrink-0 text-[10px] font-semibold uppercase tracking-wider',
                                isActive
                                    ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                    : 'border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-400',
                            )}
                        >
                            {isActive ? 'Active' : 'Pending'}
                        </Badge>
                    </div>
                );
            })}
        </div>
    );
}