import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight, Forward, Languages, MapPinPlusInsideIcon, MessageSquare, SendHorizontal, SquareArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import AppLogo from '@/components/app-logo'; // Make sure this path matches your project
import { LanguageSwitcher } from '../language-switcher';
import AppearanceDropdown from '../appearance-dropdown';

type Props = {
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    };
};

export default function PublicHeader({ auth }: Props) {
    return (
        <header className="relative z-50 w-full">
            {/* Top Red Banner */}
            <div className="bg-red-600 text-white">
                <div className="flex min-h-12 flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2 text-center text-sm">
                    <span>
                        Does your business have a monthly revenue of over 50,000 €? Take advantage of exclusive conditions!
                    </span>
                    {/* Default Shadcn secondary button */}
                    <Button size="sm" variant="default" >
                        Talk to us! <SendHorizontal size={56} strokeWidth={1.75} />
                    </Button>
                </div>
            </div>

            {/* Main Navigation Bar - Liquid Glass Effect */}
            <div className="sticky top-0 w-full border-b border-border/40 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <div className="flex shrink-0 items-center">
                        <Link href="/">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Center Links - Shadcn Ghost Buttons */}
                    <nav className="hidden items-center gap-2 md:flex">
                        <Button variant="outline" className="dark:text-gray-100" size="sm" asChild>
                            <Link href="/">Home</Link>
                        </Button>
                        <Button variant="outline" className="dark:text-gray-100" size="sm" asChild>
                            <Link href="#features">Features</Link>
                        </Button>
                        <Button variant="outline" className="dark:text-gray-100" size="sm" asChild>
                            <Link href="#about">About</Link>
                        </Button>
                        <Button variant="outline" className="dark:text-gray-100" size="sm" asChild>
                            <Link href="#faq">FAQ</Link>
                        </Button>
                    </nav>

                    {/* Right Actions - Preserved exactly as you styled them */}
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Button asChild>
                                <Link href={dashboard()}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <LanguageSwitcher />
                           <AppearanceDropdown />
                                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex dark:text-gray-100">
                                    <Link href={login()}>
                                        Login <ChevronRight className=" h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>
                                        Register <SquareArrowUpRight size={56} strokeWidth={1.75} />
                                    </Link>
                                </Button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </header>
    );
}