import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Renders a modal whenever Inertia's `flash.error` prop is set.
 *
 * Mount this once in the app layout — every controller that uses
 * `->with('error', '...')` will trigger it. The dialog "consumes" the
 * message by keeping it in local state and ignoring subsequent renders
 * with the same value; the flash itself clears on the next navigation.
 */
export function FlashErrorDialog() {
    const { flash } = usePage().props as {
        flash?: { error?: string | null };
    };

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.error) {
            setMessage(flash.error);
        }
    }, [flash?.error]);

    return (
        <AlertDialog
            open={!!message}
            onOpenChange={(open) => {
                if (!open) setMessage(null);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <AlertCircle />
                    </AlertDialogMedia>
                    <AlertDialogTitle>
                        Something went wrong
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => setMessage(null)}
                    >
                        Got it
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}