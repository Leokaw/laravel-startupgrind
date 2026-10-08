import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    initialValue?: string;
    onChange: (value: string) => void;
};

export function CompanyEmployeesSearch({ initialValue = '', onChange }: Props) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value !== initialValue) {
                onChange(value);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [value, initialValue, onChange]);

    return (
        <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Filter employees by name or email..."
                className="pl-9"
            />
        </div>
    );
}