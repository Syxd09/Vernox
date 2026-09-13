import { useState } from 'react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Hammer, ShieldCheck, ArrowRight, Layers, Eye, Cpu } from 'lucide-react';
import { ShapeThumb } from '@/components/shop/ShapeThumb';

const PROCESS_STEPS = [
  {
    phase: 'Phase I',
    title: 'The Digital Canvas',
    subtitle: 'Where vector line meets metal grid',
    desc: 'Every commission starts in our browser studio. Design parameters are fed directly into vector nests, translating raw typography or custom sketches into laser paths with micron-precision scaling.',
    icon: Sparkles,
    color: 'from-yellow-500/10 to-amber-500/10 text-amber-600 border-amber-500/20',
    detail: 'We calculate kerf compensation dynamically so interlocking parts fit snug down to 0.1mm.'
  },
  {
    phase: 'Phase II',
    title: 'Fibre Laser Slicing',
    subtitle: 'Slicing 3mm steel with pure light',
    desc: 'Heavy sheet metal is clamped onto our bed. A focused 3000W nitrogen-assist fibre laser beam slices through raw steel at high speeds, creating razor-sharp cuts without any thermal distortion.',
    icon: Flame,
    color: 'from-red-500/10 to-orange-500/10 text-orange-600 border-orange-500/20',
    detail: 'Nitrogen gas shielding prevents oxidation along the cut edges, ensuring a pristine raw surface.'
  },
  {
    phase: 'Phase III',
    title: 'Hand Dressing & Graining',
    subtitle: 'Polishing out the laser burrs',
    desc: 'Each piece is hand-deburred using specialized deburring blocks. We dress the metal surface with custom abrasive belts, building a deep brushed texture that catches the room\'s natural light.',
    icon: Hammer,
    color: 'from-blue-500/10 to-cyan-500/10 text-cyan-600 border-cyan-500/20',
    detail: 'Brushing is performed unidirectionally to follow the geometric flow and enhance reflections.'
  },
  {
    phase: 'Phase IV',
    title: 'Atelier Chemical Patination',
    subtitle: 'Oxidation recipes from the archive',
    desc: 'We treat the metal with ancient chemical oxidation recipes. From rich oxblood brass patinas to natural rusted corten textures, we accelerate aging to create organic patterns unique to each piece.',
    icon: Layers,
    color: 'from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20',
    detail: 'Patination is halted with organic oils, sealing in the deep colors and protecting it for life.'
  },
  {
    phase: 'Phase V',
    title: 'Numbered Seal & Dispatch',
    subtitle: 'Signed on reverse, crated in wood',
    desc: 'We engrave the atelier stamp, the maker\'s initials, and the edition series number on the back. The piece is wrapped in Belgian tissue paper and packed in a wood-reinforced crate.',
    icon: ShieldCheck,
    color: 'from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-500/20',
    detail: 'Each shipment includes a signed Certificate of Authenticity with the workshop seal.'
  }
];

export default function About() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased font-sans text-foreground">
      <SiteHeader />

      {/* LUXURY EDITORIAL HEADER */}
      <section className="relative overflow-hidden border-b border-oxblood/10 py-16 md:py-24 bg-card/10">
        <div className="absolute inset-0 pointer-events-none opacity-45">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-oxblood/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brass/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative text-center space-y-6">
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] text-brass font-bold"
          >
            Our Atelier & Craft
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl text-oxblood-deep leading-tight"
          >
            Metal, <span className="font-serif-italic text-gradient-brass">patiently</span> made.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto font-serif-italic leading-relaxed"
          >
            "No assembly lines. No factory warehouses. Just four makers, one nitrogen fibre laser, and a workbench in Antwerp, Belgium."
          </motion.p>
        </div>
      </section>

      {/* CORE TIMELINE / INTERACTIVE DEMONSTRATOR */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 w-full flex-1 space-y-16">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
          
          {/* STEP CONTROLLERS */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold mb-4">Workshop Workflow Steps</div>
            {PROCESS_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded border transition-all flex items-start gap-4 ${
                    isActive 
                      ? 'bg-card border-oxblood/30 shadow-soft ring-1 ring-oxblood/5' 
                      : 'border-border/60 hover:border-oxblood/20 bg-card/40'
                  }`}
                >
                  <div className={`p-2 rounded border ${step.color} shrink-0`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider text-brass uppercase">{step.phase}</div>
                    <div className="font-display text-lg text-oxblood-deep font-semibold mt-0.5">{step.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{step.subtitle}</div>
                  </div>
                  <div className="ml-auto mt-2 text-muted-foreground">
                    <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-oxblood' : 'opacity-20'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE DEMONSTRATOR INTERACTIVE CARD */}
          <div className="bg-card border border-border shadow-luxe rounded-sm p-6 sm:p-10 relative overflow-hidden min-h-[460px] flex flex-col justify-between noise-overlay">
            
            {/* Visual Laser Slicing Beam Effect (Only for Phase II) */}
            {activeStep === 1 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-red-500 to-orange-400 opacity-80 blur-[1px] animate-pulse" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full blur-sm animate-ping" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full shadow-brass" />
              </div>
            )}

            {/* Visual Chemical Patination Color Spill (Only for Phase IV) */}
            {activeStep === 3 && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5 opacity-50 blur-3xl" />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-oxblood/10 text-oxblood px-2 py-0.5 rounded font-bold uppercase">
                      {PROCESS_STEPS[activeStep].phase}
                    </span>
                    <span className="text-xs text-muted-foreground font-serif-italic">Atelier Operations</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl text-oxblood-deep mt-4">
                    {PROCESS_STEPS[activeStep].title}
                  </h3>
                  <p className="text-sm font-semibold tracking-wider text-brass uppercase font-sans mt-1">
                    {PROCESS_STEPS[activeStep].subtitle}
                  </p>

                  <p className="text-foreground/70 mt-6 leading-relaxed text-sm sm:text-base font-serif-italic">
                    {PROCESS_STEPS[activeStep].desc}
                  </p>
                </div>

                <div className="bg-background border border-border/80 p-4 rounded space-y-2 mt-8">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-brass" /> Workshop Specs
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                    {PROCESS_STEPS[activeStep].detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* METALLIC FINISHES PREVIEW SYSTEM */}
        <div className="border-t border-border/60 pt-16 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-brass font-bold">Atelier Finishes</p>
            <h3 className="font-display text-3xl sm:text-4xl text-oxblood-deep">Interactive Metallurgy Display</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Hover and move your mouse over each plate to watch how light reflection and bevel gradients react dynamically in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 'brass', label: 'Patinated Brass', desc: 'Deep brass color Stops with aged oxblood traces' },
              { id: 'copper', label: 'Warm Copper', desc: 'Soft rose glow with high-contrast edge shading' },
              { id: 'gold', label: 'Atelier Gold', desc: 'Brilliant mirror reflection with delicate warm tones' },
              { id: 'corten', label: 'Corten Steel', desc: 'Velvet rusty oxide texture with deep earth tones' }
            ].map(f => (
              <div key={f.id} className="bg-card border border-border/70 p-4 rounded flex flex-col items-center justify-between text-center gap-4 hover:border-oxblood/30 transition-all shadow-soft group">
                <div className="w-24 h-24 sm:w-28 sm:h-28">
                  <ShapeThumb shapeId="shield" finish={f.id} className="w-full h-full" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-oxblood-deep uppercase tracking-wider">{f.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 max-w-[150px] mx-auto leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESIGN CALL TO ACTION */}
        <div className="bg-oxblood-deep rounded-sm p-8 sm:p-12 text-center text-ivory space-y-6 relative overflow-hidden noise-overlay">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-brass rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-oxblood rounded-full blur-3xl opacity-30" />
          
          <div className="max-w-xl mx-auto space-y-6 relative">
            <h3 className="font-display text-3xl sm:text-4xl text-gradient-brass">Have a custom sketch?</h3>
            <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed font-serif-italic">
              Whether you need bespoke building signage, custom lighting layouts, or a custom silhouette artwork, our design studio is ready to configure.
            </p>
            <div className="pt-2">
              <Link 
                to="/customize" 
                className="inline-flex items-center gap-2 bg-brass text-oxblood-deep hover:bg-ivory hover:text-oxblood font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition shadow-soft"
              >
                Launch Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}