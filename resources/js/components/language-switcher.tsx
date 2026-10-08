import { useEffect, useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Language = {
    code: string;
    label: string;
    flag: string;
};

const LANGUAGES: Language[] = [
    { code: 'en', label: 'English', flag: '/uk-flag.png' },
    { code: 'hu', label: 'Magyar',  flag: '/hungarian-flag.png' },
];

const STORAGE_KEY = 'app.locale';

export function LanguageSwitcher() {
    const [locale, setLocale] = useState<string>('en');

    // Read on mount — SSR-safe since this only runs client-side.
    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && LANGUAGES.some((l) => l.code === stored)) {
            setLocale(stored);
        }
    }, []);

    const change = (next: string) => {
        setLocale(next);
        window.localStorage.setItem(STORAGE_KEY, next);

        // When you wire up a real backend i18n solution later,
        // replace this with something like:
        //   router.post('/language', { locale: next });
        // or set a `locale` cookie server-side.
    };

    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                            aria-label={`Change language (currently ${current.label})`}
                        >
                            {/*
                                Flag shown inside the trigger button.
                                overflow-hidden + rounded-full keeps the PNG
                                inside the circular button, whatever aspect
                                ratio the source image has.
                            */}
                            <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full ring-1 ring-border">
                                <img
                                    src={current.flag}
                                    alt={current.label}
                                    className="h-full w-full object-cover"
                                />
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Change language</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Languages className="h-3.5 w-3.5 opacity-70" />
                    Language
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => change(lang.code)}
                        className="flex items-center gap-2"
                    >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border">
                            <img
                                src={lang.flag}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </span>
                        <span className="flex-1">{lang.label}</span>
                        {locale === lang.code && (
                            <Check className="h-4 w-4 opacity-70" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}