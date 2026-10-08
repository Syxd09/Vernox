import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function MinimalHero() {
  return (
    <section className="relative bg-cream overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.28em] font-sans text-burgundy font-semibold">
                Vernox Atelier · 2026 Collection
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-dark-brown font-normal leading-[1.12] tracking-tight">
              ART THAT <br />
              <span className="italic font-light text-burgundy">DEFINES</span> YOUR SPACE
            </h1>

            <p className="text-sm sm:text-base text-dark-brown/80 leading-relaxed font-sans max-w-lg">
              Curated wall art and statement pieces designed to bring character, warmth and sophistication to modern interiors.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
              <Link
                to="/shop/wall-art"
                className="w-full sm:w-auto btn-burgundy"
              >
                SHOP WALL ART
              </Link>

              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans font-semibold text-dark-brown hover:text-burgundy transition-colors py-2"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-3.5 h-3.5 text-burgundy transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Subtle Brand Pillars */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#EBE4D6]/80 text-dark-brown/70 font-sans">
              <div>
                <span className="block font-editorial text-xl sm:text-2xl text-dark-brown">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-burgundy font-medium">Original Works</span>
              </div>
              <div>
                <span className="block font-editorial text-xl sm:text-2xl text-dark-brown">Handmade</span>
                <span className="text-[10px] uppercase tracking-wider text-burgundy font-medium">Atelier Craft</span>
              </div>
              <div>
                <span className="block font-editorial text-xl sm:text-2xl text-dark-brown">Worldwide</span>
                <span className="text-[10px] uppercase tracking-wider text-burgundy font-medium">Insured Transit</span>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[2px] overflow-hidden bg-white border border-[#EBE4D6] shadow-sm">
              <img
                src="/images/hero-art-lounge.jpg"
                alt="Modern luxury living room interior with Vernox wall art and sculpture"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-103"
                loading="eager"
              />
              {/* Subtle gold corner accent line */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-gold/60 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-gold/60 pointer-events-none" />
            </div>

            {/* Editorial Caption Tag */}
            <div className="mt-3.5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-sans text-dark-brown/60">
              <span>Curated Penthouse Residence</span>
              <span className="text-gold">Featuring Abstract Horizon & Golden Silence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
