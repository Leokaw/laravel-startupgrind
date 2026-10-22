import { Link } from '@inertiajs/react';
import { 
  ArrowUp, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter 
} from 'lucide-react';
import { type MouseEvent } from 'react';

export default function Footer() {
    // Smooth scroll handler with offset for the sticky header
    const handleScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();

        if (href === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);

        if (element) {
            const offset = 100; // Accounts for the sticky header height
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <footer className="relative border-t border-border bg-background">
            <div className="mx-auto max-w-7xl border-x border-border">
                
                {/* Row 1: Links */}
                <div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 md:px-8">
                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Company
                        </h3>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <a 
                                    href="#home" 
                                    onClick={(e) => handleScroll(e, '#home')} 
                                    className="transition-colors hover:text-primary"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#about" 
                                    onClick={(e) => handleScroll(e, '#about')} 
                                    className="transition-colors hover:text-primary"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#features" 
                                    onClick={(e) => handleScroll(e, '#features')} 
                                    className="transition-colors hover:text-primary"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#speakers" 
                                    onClick={(e) => handleScroll(e, '#speakers')} 
                                    className="transition-colors hover:text-primary"
                                >
                                    Speakers
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#faq" 
                                    onClick={(e) => handleScroll(e, '#faq')} 
                                    className="transition-colors hover:text-primary"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Legal
                        </h3>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <Link href="/terms" className="transition-colors hover:text-primary">
                                    Terms of use
                                </Link>
                            </li>
                            <li>
                                <Link href="/code-of-conduct" className="transition-colors hover:text-primary">
                                    Code of conduct
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Row 2: Logo & Socials */}
                <div className="flex items-center justify-between border-y border-border px-6 py-6 md:px-8">
                    <a href="#home" onClick={(e) => handleScroll(e, '#home')}>
                        <img 
                            src="/branding/logo-big.png" 
                            alt="Startup Grind" 
                            className="h-7 w-auto object-contain " 
                        />
                    </a>
                    
                    <div className="flex items-center gap-4 text-foreground">
                        <a href="#" className="transition-colors hover:text-primary" aria-label="Twitter">
                            <Twitter className="h-[18px] w-[18px] fill-current" />
                        </a>
                        <a href="#" className="transition-colors hover:opacity-70" aria-label="YouTube">
                            <img 
                                src="/home/youtube_logo.svg" 
                                alt="YouTube" 
                                className="h-[20px] transition-colors w-[20px] object-contain" 
                            />
                        </a>
                        <a href="#" className="transition-colors hover:text-primary" aria-label="Facebook">
                            <Facebook className="h-[18px] w-[18px] fill-current" />
                        </a>
                        <a href="#" className="transition-colors hover:text-primary" aria-label="Instagram">
                            <Instagram className="h-[18px] w-[18px]" />
                        </a>
                        <a href="#" className="transition-colors hover:text-primary" aria-label="LinkedIn">
                            <Linkedin className="h-[18px] w-[18px] fill-current" />
                        </a>
                    </div>
                </div>

                {/* Row 3: Copyright & Credits */}
                <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground md:flex-row md:px-8">
                    <p>© 2026 Startup Grind. All Rights Reserved.</p>
                    
                    <p>
                        Provided and maintained by{' '}
                        <a href="#" className="font-medium text-[#E33D42] hover:underline">
                            Leo Reus
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-[#E33D42] hover:underline">
                            Balázs Horváth
                        </a>
                    </p>

                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E33D42] text-white transition-colors hover:bg-[#c93438]"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-4 w-4" strokeWidth={3} />
                    </button>
                </div>

            </div>
        </footer>
    );
}