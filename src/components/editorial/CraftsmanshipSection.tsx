import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Flame, Hammer, CheckCircle2, Truck, ArrowRight } from 'lucide-react';

interface Stage {
  step: string;
  phase: string;
  title: string;
  tagline: string;
  description: string;
  specPill: string;
  tolerance: string;
  icon: typeof Cpu;
}

const STAGES: Stage[] = [
  {
    step: '01',
    phase: 'DESIGN',
    tabLabel: 'CAD Engine',
    title: 'Parametric CAD & Kerf Computation',
    tagline: 'Vector mathematics balanced for structural rigidity.',
    description: 'Every relief begins in our CAD engine where vector silhouettes are proofed against finite element metal stress, thermal deflection, and laser lead-in paths before a single sheet is drawn.',
    specPill: 'Parametric DXF / DWG Engineering',
    tolerance: '±0.05 mm Structural Kerf Offset',
    icon: Cpu,
  },
  {
    step: '02',
    phase: 'CUT',
    tabLabel: 'Fibre Laser',
    title: '3000W Nitrogen-Shielded Fibre Laser',
    tagline: 'Zero edge oxidation through high-pressure inert gas.',
    description: 'Operating under 18-bar ultra-pure nitrogen assist, our 3kW fibre lasers slice through solid 3.0mm Belgian plate without burning, micro-cracking, or leaving slag along intricate geometric contours.',
    specPill: '18-Bar Ultra-Pure N₂ Shield',
    tolerance: '0.10 mm Slicing Accuracy',
    icon: Flame,
  },
  {
    step: '03',
    phase: 'FORM',
    tabLabel: 'Plate Forming',
    title: 'Solid 3.0mm Structural Plate Forming',
    tagline: 'Substantial mass with architectural permanence.',
    description: 'We never stamp thin foil. Relief components are formed from certified structural alloys—CZ108 brass, marine 316L stainless, and Cor-Ten steel—giving each piece weight and absolute planar stability.',
    specPill: 'Certified 3.0mm Belgian Plate',
    tolerance: 'Zero Buckle · Zero Warpage',
    icon: Hammer,
  },
  {
    step: '04',
    phase: 'FINISH',
    tabLabel: 'Hand Patina',
    title: 'Hand Graining & Archival Patination',
    tagline: 'The timeless warmth of master artisan hands.',
    description: 'Our finishers hand-grain raw metal with directional abrasives before immersing pieces in archival chemical baths—liver-of-sulphur, French bronzing acids, and hot microcrystalline wax sealant.',
    specPill: 'Hand-Grained & Chemical Bath',
    tolerance: 'Museum-Grade Microcrystalline Wax',
    icon: CheckCircle2,
  },
  {
    step: '05',
    phase: 'INSPECT',
    tabLabel: 'Hallmark',
    title: 'Optical Tolerance & Atelier Hallmark',
    tagline: 'Permanently cataloged with unique registry credentials.',
    description: 'Each completed artwork undergoes optical micrometer checks for planar precision, is stamped with the Vernox hallmark and edition code on the reverse, and paired with a signed Certificate of Authenticity.',
    specPill: 'Antwerp Hallmark Stamping',
    tolerance: '100% Dimensional Verification',
    icon: CheckCircle2,
  },
  {
    step: '06',
    phase: 'DELIVER',
    tabLabel: 'Crated Transit',
    title: 'Reinforced Timber Crated Transit',
    tagline: 'Arrives in pristine gallery condition, anywhere in the world.',
    description: 'Artwork is enclosed in custom wood-reinforced crates with custom-cut polyethylene foam damping, complete with 316 stainless steel standoff wall mounts and template drill guides.',
    specPill: 'Wood-Reinforced Crated Transit',
    tolerance: 'Full Insured Doorstep Delivery',
    icon: Truck,
  },
];

export function CraftsmanshipSection() {
  const [activeStage, setActiveStage] = useState(0);
  const current = STAGES[activeStage];
  const IconComponent = current.icon;

  return (
    <section 
      id="craftsmanship" 
      className="relative py-24 md:py-32 bg-[#0E0E0E] text-[#F4F2EE] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-semibold mb-2">
            Atelier Fabrication Protocol
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight">
            Precision begins long before <br />
            <span className="italic font-light text-[#E8E5DF]/70">the artwork reaches your wall.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#F4F2EE]/65 font-sans leading-relaxed mt-4 max-w-xl">
            From algorithmic vector CAD proofing to 18-bar nitrogen laser slicing and hand-rubbed archival patinas, explore our uncompromising 6-stage fabrication cycle.
          </p>
        </div>

        {/* 6-Stage Interactive Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10 border-b border-white/10 pb-6">
          {STAGES.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`p-3.5 rounded-[2px] text-left transition-all duration-300 relative ${
                activeStage === idx
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5 text-white/50 hover:text-white/80'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#D4AF37] mb-1 font-semibold">
                <span>{s.step}</span>
                <span className="text-[9px] text-white/40 uppercase">{s.phase}</span>
              </div>
              <div className="font-editorial text-sm text-white truncate">
                {s.tabLabel}
              </div>

              {/* Active Indicator Underline */}
              {activeStage === idx && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Stage Presentation Card */}
        <div className="rounded-[4px] border border-white/15 bg-black/60 backdrop-blur-xl p-8 sm:p-12 md:p-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[2px] border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                  Phase {current.step} / 06 · {current.phase}
                </div>
                <div className="text-xs text-white/60 font-mono">
                  {current.specPill}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <h3 className="font-editorial text-3xl sm:text-4xl text-white font-normal leading-tight">
                  {current.title}
                </h3>
                <p className="font-editorial italic text-lg sm:text-xl text-[#D4AF37]">
                  "{current.tagline}"
                </p>
                <p className="text-xs sm:text-sm text-[#F4F2EE]/75 leading-relaxed font-sans max-w-xl">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Engineering Standard</span>
                <span className="text-white font-semibold">{current.specPill}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Precision Metric</span>
                <span className="text-[#D4AF37] font-semibold">{current.tolerance}</span>
              </div>
            </div>
          </div>

          {/* Right Workshop Imagery Context */}
          <div className="relative rounded-[2px] overflow-hidden border border-white/15 aspect-[4/3] group shadow-xl">
            <img
              src="/images/artisan-workshop.jpg"
              alt="Atelier Vernox Craftsmanship"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-[2px] bg-black/80 backdrop-blur-md border border-white/10 text-xs">
              <div className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-mono">
                Antwerp Atelier Studio
              </div>
              <div className="font-editorial text-sm text-white mt-0.5">
                Kloosterstraat Master Craft Workshop
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
