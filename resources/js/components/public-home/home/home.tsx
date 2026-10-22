
import BottomFeatures from './bottom-features';
import FAQ from './faq';
import Features from './features';
import Footer from './footer';
import Hero from './hero';
import Partnership from './partnership';
import SpeakersGrid from './speakers-grid';
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
            <SpeakersGrid />
            <FAQ />
            <Footer/>
        </div>
    );
}