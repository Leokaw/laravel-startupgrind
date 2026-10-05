import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

type Props = {
    onEdit?: () => void;
    onDelete?: () => void;
};

export function CompanyServiceRowActions({ onEdit, onDelete }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground data-[state=open]:bg-muted"
                    aria-label="Open actions menu"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                    onSelect={(e) => {
                        e.preventDefault();
                        onEdit?.();
                    }}
                    className="cursor-pointer p-2 m-1"
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        onDelete?.();
                    }}
                    className="cursor-pointer text-red-600 hover:bg-red-500/10 hover:text-red-700 focus:bg-red-500/10 focus:text-red-700 p-2 m-1 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300 dark:focus:bg-red-500/15 dark:focus:text-red-300"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}