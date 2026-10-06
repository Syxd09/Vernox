import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="bg-cream py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Asymmetric Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Primary tall editorial image */}
              <div className="col-span-8 relative aspect-[4/5] rounded-[2px] overflow-hidden border border-[#EBE4D6] shadow-sm bg-white">
                <img
                  src="/images/artisan-workshop.jpg"
                  alt="Vernox atelier workshop artisan handcrafting sculpture"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Offset secondary image */}
              <div className="col-span-4 relative aspect-[3/4] -mb-6 rounded-[2px] overflow-hidden border border-[#EBE4D6] shadow-md bg-white">
                <img
                  src="/images/installation-round.jpg"
                  alt="Vernox statement wall installation in modern interior"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Thin gold corner line */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold" />
              </div>
            </div>

            {/* Small Floating Label */}
            <div className="absolute -bottom-3 left-6 bg-white/95 backdrop-blur-xs border border-[#EBE4D6] px-4 py-2 rounded-[1px] shadow-xs">
              <span className="text-[9px] uppercase tracking-[0.24em] font-mono text-dark-brown">
                Est. Antwerp · Fine Craftsmanship
              </span>
            </div>
          </div>

          {/* Editorial Text Content */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] font-sans text-burgundy font-semibold">
              <span className="w-5 h-[1px] bg-gold" />
              <span className="bg-dusty-pink/20 border border-dusty-pink/30 px-2.5 py-0.5 rounded-[1px]">Editorial & Heritage</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal leading-[1.15] tracking-tight">
              ART FOR THE <br />
              <span className="italic font-light text-burgundy">WAY YOU LIVE</span>
            </h2>

            <p className="text-sm sm:text-base text-dark-brown/85 leading-relaxed font-sans">
              Vernox curates contemporary wall art and statement objects for homes, workspaces, and hospitality environments. We believe that art is not merely an ornament, but an essential component of architectural equilibrium.
            </p>

            <p className="text-xs sm:text-sm text-dark-brown/70 leading-relaxed font-sans">
              Each piece is born from a dialogue between raw material authenticity—solid bronze, Belgian linen, natural mineral pigments, and honed travertine—and the disciplined restraint of modernist form. Made to bring enduring character, warmth, and timeless poise to your everyday environment.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-6">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans font-semibold text-burgundy hover:text-dark-brown transition-colors"
              >
                <span>Read Our Atelier Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <span className="text-[#EBE4D6]">|</span>

              <Link
                to="/about#b2b"
                className="text-xs uppercase tracking-[0.24em] font-sans font-medium text-dark-brown/70 hover:text-gold transition-colors"
              >
                Trade & Hospitality Inquiries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
