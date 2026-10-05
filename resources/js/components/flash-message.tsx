import { usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export function FlashMessage() {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    if (!flash?.success) return null;

    return (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{flash.success}</span>
        </div>
    );
}