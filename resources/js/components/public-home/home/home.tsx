import Hero from './hero';
import SponsorsMarquee from './sponsors';
import Partnership from './partnership';

export default function Home() {
    return (
        <div className="flex flex-1 flex-col">
            <Hero />
            <SponsorsMarquee />
            <Partnership />
        </div>
    );
}