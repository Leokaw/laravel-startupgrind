import { Head, usePage } from '@inertiajs/react';
import Hero from '@/components/public-home/home/home';
import PublicHeader from '@/components/public-home/public-header';
import Home from '@/components/public-home/home/home';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="flex min-h-screen flex-col bg-background text-foreground force-light">
                <PublicHeader auth={auth} />
                <main className="flex-1">
                    <Home />
                </main>
            </div>
        </>
    );
}