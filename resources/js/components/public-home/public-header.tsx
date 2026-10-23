import { useState, useEffect, type MouseEvent } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Menu, SendHorizontal, SquareArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import AppLogo from '@/components/app-logo';
import { LanguageSwitcher } from '../language-switcher';
import { cn } from '@/lib/utils';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

type Props = {
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    };
};

const NAV_ITEMS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Speakers', href: '#speakers' },
    { label: 'FAQ', href: '#faq' },
];

export default function PublicHeader({ auth }: Props) {
    const [activeSection, setActiveSection] = useState('#home');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Scroll Spy: Detect which section is currently in view
    useEffect(() => {
        const sections = document.querySelectorAll('section[id], div[id]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(`#${entry.target.id}`);
                    }
                });
            },
            {
                rootMargin: '-20% 0px -60% 0px'
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    // Core scroll logic
    const performScroll = (href: string) => {
        if (href === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);

        if (element) {
            const offset = 100; // Accounts for sticky header height
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    // Handler that manages drawer state + smooth scrolling
    const handleScroll = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
        e.preventDefault();

        if (isDrawerOpen) {
            // 1. Close the drawer
            setIsDrawerOpen(false);
            
            // 2. Wait for Vaul to unlock the body scroll (approx 250ms for closing animation)
            setTimeout(() => {
                performScroll(href);
            }, 250);
        } else {
            // Desktop: scroll immediately
            performScroll(href);
        }
    };

    return (
        <header className="sticky  top-0 z-50 w-full">
            {/* Top Red Banner */}
            <div className="bg-red-600 text-white">
                <div className="flex min-h-12 flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2 text-center text-sm">
                    <span>
                        Does your business have a monthly revenue of over 50,000 €? Take advantage of exclusive conditions!
                    </span>
                    <Button size="sm" variant="default">
                        Talk to us! <SendHorizontal size={56} strokeWidth={1.75} />
                    </Button>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="w-full border-b border-border/40 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
                <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    
                    {/* Logo */}
                    <div className="flex shrink-0 items-center">
                        <Link href="/" onClick={(e) => handleScroll(e, '#home')}>
                            {/* Desktop Image */}
                            <img
                                src="/branding/logo-big.png"
                                alt="Startup Grind"
                                className="hidden h-7 w-auto object-contain md:block"
                            />
                            {/* Mobile AppLogo */}
                            <div className="block md:hidden">
                                <AppLogo />
                            </div>
                        </Link>
                    </div>

                    {/* Center Links (Desktop) */}
                    <nav className="hidden items-center gap-2 md:flex">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeSection === item.href;
                            return (
                                <Button
                                    key={item.label}
                                    variant={isActive ? 'default' : 'outline'}
                                    size="sm"
                                    className={cn(!isActive && "dark:text-gray-100")}
                                    asChild
                                >
                                    <a
                                        href={item.href}
                                        onClick={(e) => handleScroll(e, item.href)}
                                    >
                                        {item.label}
                                    </a>
                                </Button>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center gap-2 md:flex">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" size="sm" asChild className="dark:text-gray-100">
                                        <Link href={login()}>
                                            Login <ChevronRight className="h-4 w-4" />
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

                        {/* Desktop Language Switcher */}
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Drawer Menu */}
                        <div className="flex items-center gap-2 md:hidden">
                            <LanguageSwitcher />
                            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                                <DrawerTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="h-full w-[300px]">
                                    <DrawerHeader className="border-b text-left">
                                        <DrawerTitle>Menu</DrawerTitle>
                                    </DrawerHeader>
                                    
                                    <div className="flex flex-col gap-6 overflow-y-auto p-4">
                                        {/* Mobile Navigation Links */}
                                        <nav className="flex flex-col gap-2">
                                            {NAV_ITEMS.map((item) => {
                                                const isActive = activeSection === item.href;
                                                return (
                                                    <Button
                                                        key={item.label}
                                                        variant={isActive ? 'default' : 'ghost'}
                                                        className={cn(
                                                            "w-full justify-start",
                                                            !isActive && "dark:text-gray-100"
                                                        )}
                                                        onClick={(e) => handleScroll(e, item.href)}
                                                    >
                                                        {item.label}
                                                    </Button>
                                                );
                                            })}
                                        </nav>

                                        <div className="h-px w-full bg-border" />

                                        {/* Mobile Auth Buttons */}
                                        <div className="flex flex-col gap-3">
                                            {auth.user ? (
                                                <DrawerClose asChild>
                                                    <Button className="w-full" asChild>
                                                        <Link href={dashboard()}>Dashboard</Link>
                                                    </Button>
                                                </DrawerClose>
                                            ) : (
                                                <>
                                                    <DrawerClose asChild>
                                                        <Button variant="outline" className="w-full dark:text-gray-100" asChild>
                                                            <Link href={login()}>
                                                                Login <ChevronRight className="ml-2 h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </DrawerClose>
                                                    <DrawerClose asChild>
                                                        <Button className="w-full" asChild>
                                                            <Link href={register()}>
                                                                Register <SquareArrowUpRight className="ml-2 h-4 w-4" strokeWidth={1.75} />
                                                            </Link>
                                                        </Button>
                                                    </DrawerClose>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}