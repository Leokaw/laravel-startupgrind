import { Play } from 'lucide-react';

// Data array containing all the attendees from your screenshot
const speakers = [
  { name: 'Alexandr Wang', image: 'alexandr', link: '#' },
  { name: 'Biz Stone', image: 'biz', link: '#' },
  { name: 'Chamath Palihapitiya', image: 'cham', link: 'https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=ncjum-bkW98&feature=youtu.be' },
  { name: 'Doug Leone', image: 'doug', link: '#' },
  { name: 'Eric Yuan', image: 'eric', link: '#' },
  { name: 'Dr. Fei-Fei Li', image: 'fei', link: '#' },
  { name: 'Garry Tan', image: 'garry', link: '#' },
  { name: 'Jessica Livingston', image: 'jessica', link: '#' },
  { name: 'Kevin Systrom', image: 'kevin', link: '#' },
  { name: 'Marc Andreessen', image: 'marc', link: '#' },
  { name: 'Naval Ravikant', image: 'naval', link: '#' },
  { name: 'Patrick Collison', image: 'patrick', link: '#' },
  { name: 'Sam Altman', image: 'sam', link: 'https://www.youtube.com/watch?list=PL6AD_bWsx2JXgS-fXlF66ifpgFK3j55jw&v=kVKaMHgOTP4&feature=youtu.be' },
  { name: 'Eric Schmidt', image: 'schmidt', link: '#' },
  { name: 'Stacey Abrams', image: 'stacey', link: '#' },
  { name: 'Stan', image: 'stan', link: '#' },
  { name: 'Stewart Butterfield', image: 'stewart', link: '#' },
  { name: 'Vinod Khosla', image: 'vinoda', link: '#' },
];

export default function SpeakersGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {speakers.map((speaker) => (
        <a
          key={speaker.image}
          href={speaker.link}
          target="_blank"
          rel="noopener noreferrer"
          // The "group" class lets child elements react to hovering the card
          className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-muted/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <img
              src={`/attendees/${speaker.image}.png`}
              alt={speaker.name}
              loading="lazy"
              // grayscale makes it black and white. group-hover:grayscale-0 removes it smoothly.
              className="h-full w-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
            />
            
            {/* Play Icon Overlay (fades in on hover) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl backdrop-blur-sm">
                <Play className="ml-1 size-5 fill-current" />
              </div>
            </div>
          </div>

          {/* Name Tag */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
            <p className="text-sm font-medium text-white shadow-sm">
              {speaker.name}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}