import { ShieldCheck, X, Check, Award, Flame, Box, Sparkles, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function QualityBenchmark() {
  const comparisons = [
    {
      feature: 'Plate Thickness & Rigidity',
      vernox: 'Certified 3.0mm Solid Plate (24 kg/m²). Absolute planar flatness, heavy acoustic dampening, guaranteed never to flex or warp.',
      commercial: '0.4mm – 0.8mm stamped tin or imported sheet foil. Warps under climate shifts and rattles in room air currents.',
    },
    {
      feature: 'Edge Precision & Cutting Tech',
      vernox: '3000W Nitrogen-Shielded Fibre Laser (±0.05mm kerf). 20-bar inert gas leaves mirror-smooth, oxidation-free edges ready for bonding.',
      commercial: 'Mechanical punch die or cheap air-plasma. Jagged edge burrs, thermal discoloration, and ragged kerf profiles.',
    },
    {
      feature: 'Architectural Standoff Float',
      vernox: '20mm–25mm Concealed Floating Mounts in solid brass/stainless. Projects dynamic natural sunlight shadow lines across the wall.',
      commercial: 'Flush drywall nails or visible stamped keyholes. Sits dead flat with zero depth, casting no architectural relief shadow.',
    },
    {
      feature: 'Hand Patination & Wax Seal',
      vernox: 'Historic chemical oxidation recipes (liver-of-sulphur, natural bronzing acids) sealed with archival French microcrystalline wax.',
      commercial: 'Mass industrial spray lacquer or synthetic gloss paint. Prone to chipping, artificial plastic appearance, and fading.',
    },
    {
      feature: 'Archival Transit Protection',
      vernox: 'Custom foam-damped reinforced timber crates with heavy-duty mounting hardware and drill template. 100% transit insurance.',
      commercial: 'Single-wall cardboard sleeve with bubble wrap. High transit puncture rate and bent corners on arrival.',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] text-[#18181B] border-b border-[#E6E2D8] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#18181B]/5 border border-[#18181B]/10 text-[#C5A880] text-[9px] uppercase tracking-[0.3em] font-semibold">
            <Award className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>The Vernox Benchmark</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#18181B] font-normal leading-tight">
            Engineered for permanence, <br />
            <span className="font-serif-italic text-[#8C7355] font-normal">never disposable decor.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#18181B]/70 font-sans leading-relaxed">
            Why architects and private collectors invest in solid 3mm Belgian plate over commercial stamped sheet metal.
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="rounded-[4px] border border-[#E6E2D8] bg-white shadow-soft overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_1.4fr] border-b border-[#E6E2D8] bg-[#F7F4EE] text-xs font-mono text-[#18181B]">
            <div className="p-4 sm:p-5 font-semibold uppercase tracking-wider text-[10px] text-[#18181B]/60">
              Engineering Criterion
            </div>
            <div className="p-4 sm:p-5 font-bold uppercase tracking-wider text-[11px] text-[#18181B] flex items-center gap-2 bg-[#EFEBE2] border-x border-[#E6E2D8]">
              <span className="w-2 h-2 rounded-full bg-[#234B36]" />
              <span>The Vernox Standard</span>
            </div>
            <div className="p-4 sm:p-5 font-medium uppercase tracking-wider text-[10px] text-[#18181B]/50 hidden md:block">
              Commercial Metal Décor
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((row, idx) => (
            <div
              key={row.feature}
              className={`grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_1.4fr] border-b border-[#E6E2D8]/70 text-xs ${
                idx % 2 === 1 ? 'bg-[#FCFBF8]' : 'bg-white'
              }`}
            >
              <div className="p-4 sm:p-5 font-semibold text-[#18181B] flex items-center gap-2">
                <span className="text-[#C5A880] font-mono text-[10px]">0{idx + 1}</span>
                <span>{row.feature}</span>
              </div>

              <div className="p-4 sm:p-5 bg-[#FAF7F0] border-x border-[#E6E2D8] text-[#18181B] leading-relaxed flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#234B36]/10 text-[#234B36] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{row.vernox}</span>
              </div>

              <div className="p-4 sm:p-5 text-[#18181B]/60 leading-relaxed flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-2.5 h-2.5" />
                </div>
                <span>{row.commercial}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Seal Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-[4px] bg-[#121316] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <div className="font-editorial text-lg text-white font-normal">
                Lifetime Structural & Metallurgy Guarantee
              </div>
              <div className="text-xs text-white/65 font-sans mt-0.5">
                Solid 3.0mm Belgian alloy never warps, degrades, or loses structural tension. Accompanied by numbered atelier certificate.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 text-xs font-mono text-[#C5A880]">
            <div>
              <span className="text-white/40 block text-[9px] uppercase">Trial Window</span>
              <span className="font-semibold text-white">30 Days In-Home</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-white/40 block text-[9px] uppercase">Transit Coverage</span>
              <span className="font-semibold text-white">100% Insured Crate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
