import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SpaceItem {
  name: string;
  subtitle: string;
  image: string;
  link: string;
  artHighlighted: string;
}

const spaces: SpaceItem[] = [
  {
    name: 'LIVING ROOM',
    subtitle: 'Expansive focal canvases and bronze coffee table accents for refined gatherings.',
    image: '/images/hero-art-lounge.jpg',
    link: '/shop/wall-art',
    artHighlighted: 'Abstract Horizon & Golden Silence',
  },
  {
    name: 'BEDROOM',
    subtitle: 'Muted earth palettes, textured linen reliefs, and quiet meditative silhouettes.',
    image: '/images/space-bedroom.jpg',
    link: '/shop/wall-art',
    artHighlighted: 'Textured Canvas & Minimal Lines',
  },
  {
    name: 'HOME OFFICE',
    subtitle: 'Stimulating geometric wall structures and cast brass desk showpieces.',
    image: '/images/hero-penthouse-brass.jpg',
    link: '/shop/office',
    artHighlighted: 'Maroon Geometry & Bronze Figure',
  },
  {
    name: 'CORPORATE OFFICE',
    subtitle: 'Commanding boardroom installations and entrance lobby architectural centerpieces.',
    image: '/images/office-decor.jpg',
    link: '/shop/office',
    artHighlighted: 'Architectural Executive Relief',
  },
];

export function ShopBySpace() {
  return (
    <section className="bg-[#FFFFFF] py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="brand-pill">
              Architectural Context
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal tracking-tight">
            FIND ART FOR YOUR SPACE
          </h2>
          <p className="text-xs sm:text-sm text-dark-brown/70 font-sans mt-3 leading-relaxed">
            Artwork comes alive when harmonized with natural light, organic materials, and intentional spatial proportions.
          </p>
        </div>

        {/* 4 Large Editorial Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {spaces.map((space) => (
            <Link
              key={space.name}
              to={space.link}
              className="group relative flex flex-col bg-cream border border-[#EBE4D6] rounded-[2px] overflow-hidden transition-all duration-500 hover:border-gold hover:shadow-lg cursor-pointer"
            >
              {/* Full Editorial Lifestyle Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EBE4D6]">
                <img
                  src={space.image}
                  alt={`${space.name} interior featuring Vernox art`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                  loading="lazy"
                />

                {/* Subtle vignette and hover veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Space Title Overlay on Image */}
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-mono block mb-1">
                      Space Inspiration
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal tracking-wide">
                      {space.name}
                    </h3>
                  </div>

                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-burgundy group-hover:text-cream transition-all duration-300">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Editorial Description & Highlight */}
              <div className="p-6 bg-cream flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-dark-brown/80 font-sans leading-relaxed max-w-md">
                  {space.subtitle}
                </p>

                <div className="text-right sm:border-l sm:border-[#EBE4D6] sm:pl-5 shrink-0">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-burgundy block font-mono font-semibold">
                    Featured
                  </span>
                  <span className="text-xs font-editorial text-dark-brown block mt-0.5">
                    {space.artHighlighted}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
