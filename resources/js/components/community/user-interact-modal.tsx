import { useState } from 'react';
import {
    MessageSquare,
    Briefcase,
    Ticket,
    ImageOff,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

type Props = {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    services?: Service[];
    tickets?: DiscountTicket[];
    messageCost?: number;
    ticketCost?: number;
};

type TabValue = 'message' | 'services' | 'tickets';

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
    messageCost = 50,
    ticketCost = 50,
}: Props) {
    const badge = userTypeStyles[user.user_type];
    const [activeTab, setActiveTab] = useState<TabValue>('message');

    const handleClose = () => onOpenChange(false);

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Interact with {user.name}</DialogTitle>
                    <DialogDescription>
                        Send a message, purchase a service, or grab a discount ticket.
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
                            onValueChange={(v) => setActiveTab(v as TabValue)}
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}