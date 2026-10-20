import BottomFeatures from './bottom-features';
import Features from './features';
import Hero from './hero';
import Partnership from './partnership';
import SponsorsMarquee from './sponsors';
import StoryAndCommunity from './story-and-comunity';

export default function Home() {
    return (
        <div className="flex flex-1 flex-col">
            <Hero />
            <SponsorsMarquee />
            <Partnership />
            <Features />
            <BottomFeatures />
            <StoryAndCommunity />
        </div>
    );
}