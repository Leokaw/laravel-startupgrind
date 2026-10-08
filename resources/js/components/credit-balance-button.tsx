import { Link, usePage } from '@inertiajs/react';
import { CircleDollarSign, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type PageProps = {
    auth?: {
        user?: {
            id: string;
            membership?: {
                credits_balance: number;
            } | null;
        } | null;
    };
};

export function CreditBalanceButton() {
    const { auth } = usePage().props as unknown as PageProps;
    const credits = auth?.user?.membership?.credits_balance ?? 0;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="relative rounded-full"
                    aria-label={`${credits} credits remaining`}
                >
                    <Link href="/billing">
                        <CircleDollarSign size={33} />
              
                        <Badge
                            variant="default"
                            className="absolute -right-1.5 -top-1.5 h-5 min-w-5 justify-center rounded-full px-1 text-[10px] tabular-nums"
                        >
                            {credits}
                        </Badge>
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {credits} credit{credits === 1 ? '' : 's'} remaining
            </TooltipContent>
        </Tooltip>
    );
}