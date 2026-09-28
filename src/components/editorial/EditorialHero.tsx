import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export function EditorialHero({ onOpenStudio }: { onOpenStudio?: () => void }) {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full overflow-hidden bg-[#0B0B0B] text-[#F4F2EE] flex flex-col justify-between">
      {/* Background Architectural Photography */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
        <img
          src="/images/hero-penthouse-brass.jpg"
          alt="Bespoke solid brushed brass architectural wall relief in luxury residence"
          className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.05]"
          priority="true"
        />
        {/* Architectural subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-[#0B0B0B]/70" />
      </div>

      {/* Top Provenance Stamp */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-10 sm:pt-14 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] font-mono text-white/60">
        <div>
          <span>Antwerp Atelier</span>
          <span className="mx-2 text-white/30">/</span>
          <span>Solid 3.0mm Metallurgy</span>
        </div>
        <div className="hidden sm:block text-white/40">
          Series No. 2026-V · Limited Commissions
        </div>
      </div>

      {/* Main Editorial Statement & CTAs */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col justify-end">
        <div className="max-w-3xl space-y-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-semibold">
            Architectural Metal Reliefs · Solid Plate
          </div>

          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-white leading-[0.94]">
            Art that defines space.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/70 font-sans leading-relaxed max-w-xl font-light">
            Sculptured metal wall art, precision-cut by 3kW nitrogen laser from solid 3.0mm Belgian plate, then hand-grained and patinated for living spaces.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-[#F4F2EE] hover:bg-white text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-[2px] transition-all shadow-xl"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 text-[#0B0B0B]" />
            </Link>

            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex items-center justify-center gap-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-[#F4F2EE] text-xs uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-[2px] transition-all hover:border-white cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              Launch Bespoke Studio
            </button>
          </div>
        </div>

        {/* Bottom Technical Specifications Strip */}
        <div className="mt-14 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono text-white/70">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-sans mb-0.5">Gauge</span>
            <span className="text-white font-medium">Solid 3.0mm Belgian Plate</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-sans mb-0.5">Tolerance</span>
            <span className="text-white font-medium">±0.05mm Laser Precision</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-sans mb-0.5">Mounting</span>
            <span className="text-white font-medium">20mm Concealed Brass Float</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-sans mb-0.5">Freight</span>
            <span className="text-white font-medium">Reinforced Timber Crate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
