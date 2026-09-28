import { motion } from 'framer-motion';

export function EditorialStatement() {
  return (
    <section className="relative bg-[#0B0B0B] text-[#F4F2EE] py-24 sm:py-36 px-6 border-b border-white/10 noise-overlay overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Editorial Subheader */}
        <div className="flex items-center gap-4 text-xs font-mono tracking-[0.3em] uppercase text-[#C5A880]">
          <span className="w-8 h-[1px] bg-[#C5A880]" />
          <span>The Atelier Manifesto</span>
        </div>

        {/* Huge Typography Statement */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-tight max-w-5xl text-white"
          >
            Not decoration.
            <br />
            <span className="font-serif-italic text-[#C5A880] font-normal">A statement.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-xl md:text-2xl text-white/70 font-sans leading-relaxed max-w-3xl font-light pt-4"
          >
            Designed to transform empty walls into architectural moments. We reject paper prints, stamped foil, and disposable décor. Metal is an enduring medium that holds mass, absorbs light, and anchors human spaces for generations.
          </motion.p>
        </div>

        {/* Triple Philosophical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12 border-t border-white/10 text-xs text-white/60 font-sans">
          <div className="space-y-2">
            <span className="font-mono text-[#C5A880] text-[10px] uppercase tracking-widest block">01 / MASS & GRAVITY</span>
            <p className="leading-relaxed">
              Cut from solid 3.0mm Belgian steel, CZ108 brass, or 304 marine stainless. Each sculpture possesses genuine metallurgical weight (approx. 24kg/m²).
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[#C5A880] text-[10px] uppercase tracking-widest block">02 / LIGHT & SHADOW</span>
            <p className="leading-relaxed">
              Mounted with concealed 20mm rear float standoffs, casting a dynamic, shifting shadow line that evolves as natural sunlight moves across your room.
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[#C5A880] text-[10px] uppercase tracking-widest block">03 / PROVENANCE</span>
            <p className="leading-relaxed">
              Every edition is individually numbered, hand-passivated in Antwerp, and delivered in an archival timber crate with a signed certificate of authenticity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
