import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

export function EditorialHero({ onOpenStudio }: { onOpenStudio?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] lg:min-h-screen w-full overflow-hidden bg-[#0B0B0B] text-[#F4F2EE] flex flex-col justify-between noise-overlay"
    >
      {/* MASSIVE HERO ARCHITECTURAL VISUAL WITH SUBTLE ZOOM */}
      <motion.div
        style={{ scale, y: yImage }}
        className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none"
      >
        <img
          src="/images/hero-penthouse-brass.jpg"
          alt="Bespoke solid brushed brass architectural wall relief in luxury residence"
          className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.08]"
        />
        {/* Cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-[#0B0B0B]/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70" />
      </motion.div>

      {/* TOP ATELIER METADATA BAR */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-10 sm:pt-14 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A880]/90">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
          <span>Antwerp Atelier · Solid 3.0mm Metallurgy</span>
        </div>
        <div className="hidden sm:block text-white/50">
          Series No. 2026-V · Limited Commissions
        </div>
      </div>

      {/* MAIN ASYMMETRIC EDITORIAL STATEMENT & CTAs */}
      <motion.div
        style={{ opacity: opacityText }}
        className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col justify-end"
      >
        <div className="max-w-3xl space-y-6">
          {/* Editorial Category Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-[0.25em] text-[#E8E5DF]"
          >
            <span>Sculptural Metal Reliefs</span>
            <span className="text-[#C5A880]">·</span>
            <span>Laser Sliced Plate</span>
          </motion.div>

          {/* MASSIVE EDITORIAL HEADLINE */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-normal tracking-tight text-white leading-[0.92]"
            >
              Art That Defines Space.
            </motion.h1>
          </div>

          {/* EDITORIAL SUPPORTING COPY */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="text-sm sm:text-base md:text-lg text-white/75 font-sans leading-relaxed max-w-xl font-light"
          >
            Contemporary architectural metal wall art, precision-cut by 3kW nitrogen laser from solid 3.0mm Belgian metallurgical plate, then hand-grained and patinated for living spaces.
          </motion.p>

          {/* ACTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <Link
              to="/shop"
              data-cursor="EXPLORE"
              className="inline-flex items-center justify-center gap-3 bg-[#F4F2EE] hover:bg-white text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-[2px] transition-all shadow-2xl hover:scale-[1.01]"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 text-[#0B0B0B]" />
            </Link>

            <button
              onClick={onOpenStudio}
              data-cursor="OPEN"
              className="inline-flex items-center justify-center gap-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/25 text-[#F4F2EE] text-xs uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-[2px] transition-all hover:border-[#C5A880] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              Launch CAD Studio
            </button>
          </motion.div>
        </div>

        {/* BOTTOM METRIC RIBBON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-14 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-white/70"
        >
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] block font-sans">Gauge</span>
            <span className="text-white font-medium">Solid 3.0mm Belgian Plate</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] block font-sans">Tolerance</span>
            <span className="text-white font-medium">±0.05mm Laser Precision</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] block font-sans">Mounting</span>
            <span className="text-white font-medium">20mm Concealed Brass Float</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] block font-sans">Freight</span>
            <span className="text-white font-medium">Reinforced Timber Crate</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
