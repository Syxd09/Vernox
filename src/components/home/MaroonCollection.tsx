import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function MaroonCollection() {
  return (
    <section className="relative bg-maroon-deep text-cream py-20 lg:py-28 overflow-hidden border-y border-gold/30">
      {/* Subtle atmospheric glow behind image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-[#5A202A] border border-[#C6A15B]/30 text-[#C6A15B] text-[9px] uppercase tracking-[0.28em] font-sans font-medium">
              <Sparkles className="w-3 h-3 text-[#C6A15B]" />
              <span>Limited Atelier Release</span>
            </div>

            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#F8F3EA] font-normal leading-[1.12] tracking-tight">
              THE <span className="italic font-light text-[#C6A15B]">MAROON</span> <br />
              COLLECTION
            </h2>

            <p className="text-sm sm:text-base text-[#F8F3EA]/85 leading-relaxed font-sans max-w-lg">
              Bold forms, refined textures and timeless pieces created for expressive interiors.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-[2px] bg-[#C6A15B] hover:bg-[#B38F49] text-[#332522] text-xs uppercase tracking-[0.24em] font-sans font-semibold transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Subtle Metallurgical & Pigment Specs */}
            <div className="pt-6 border-t border-[#C6A15B]/20 grid grid-cols-2 gap-6 text-xs text-[#F8F3EA]/70 font-sans">
              <div>
                <span className="text-[#C6A15B] text-[9px] uppercase tracking-[0.2em] font-mono block">
                  Pigment Chemistry
                </span>
                <p className="mt-1 text-[11px] leading-relaxed text-[#F8F3EA]/80">
                  Mineral cadmium and natural iron oxides hand-blended with fine linen weave.
                </p>
              </div>
              <div>
                <span className="text-[#C6A15B] text-[9px] uppercase tracking-[0.2em] font-mono block">
                  Gold Inlay
                </span>
                <p className="mt-1 text-[11px] leading-relaxed text-[#F8F3EA]/80">
                  24-karat gold leaf vectors hand-gilded and sealed under matte archival varnish.
                </p>
              </div>
            </div>
          </div>

          {/* Right Artwork Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[2px] overflow-hidden border border-[#C6A15B]/40 shadow-2xl bg-[#5A202A]">
              <img
                src="/images/maroon-collection.jpg"
                alt="The Maroon Collection masterwork canvas with gold accents"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-104"
                loading="lazy"
              />

              {/* Thin gold decorative frame inside */}
              <div className="absolute inset-3 border border-[#C6A15B]/40 rounded-[1px] pointer-events-none" />
            </div>

            {/* Caption badge */}
            <div className="mt-3.5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-sans text-[#F8F3EA]/70">
              <span className="text-[#C6A15B]">Series M-04 Canvas</span>
              <span>Available in Standard & Statement Formats</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
