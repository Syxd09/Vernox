import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CuratedTestimonial {
  id: string;
  quote: string;
  client: string;
  role: string;
  location: string;
  product: string;
  rating: number;
  year: string;
}

const ARCHITECTURAL_TESTIMONIALS: CuratedTestimonial[] = [
  {
    id: 'test-1',
    quote: 'One piece completely changed the character of our living room. The shadow cast by the 25mm standoffs as the afternoon sun sweeps across the limestone is extraordinary.',
    client: 'Claire & Marc D.',
    role: 'Private Residence Commission',
    location: 'Paris XVIe',
    product: 'Résidence du Bois Concentric Relief (CZ108 Brass)',
    rating: 5,
    year: '2025',
  },
  {
    id: 'test-2',
    quote: 'The Cor-Ten screen brought an organic warmth to the chalet fireplace that raw stone alone could never achieve. The natural velvety oxidation is a work of art.',
    client: 'Kohl Alpine Architecture',
    role: 'Hospitality Project Lead',
    location: 'Zermatt, Switzerland',
    product: 'The Alpine Hearth Geometric Screen',
    rating: 5,
    year: '2026',
  },
  {
    id: 'test-3',
    quote: 'Uncompromising fabrication. The 3.0mm plate has genuine mass and absolute planar rigidity. Zero buckling, zero laser slag. Exactly what our studio expects.',
    client: 'Studio De Smet Interiors',
    role: 'Principal Architect',
    location: 'Antwerp Zuid',
    product: 'Nova Facet Horizon Relief',
    rating: 5,
    year: '2025',
  },
];

export function ArchitecturalProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = ARCHITECTURAL_TESTIMONIALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ARCHITECTURAL_TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ARCHITECTURAL_TESTIMONIALS.length) % ARCHITECTURAL_TESTIMONIALS.length);
  };

  return (
    <section 
      id="testimonials" 
      className="relative py-20 lg:py-28 bg-[#FAF8F5] text-dark-brown border-b border-[#EBE4D6] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 text-burgundy text-[10px] uppercase tracking-[0.28em] font-mono font-medium mb-3">
            <span className="w-5 h-px bg-burgundy/40" />
            <span>Architectural Provenance & Feedback</span>
            <span className="w-5 h-px bg-burgundy/40" />
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal tracking-tight">
            Voices from Living Spaces
          </h2>
        </div>

        {/* Large Editorial Quote Stage */}
        <div className="relative rounded-[2px] border border-[#EBE4D6] bg-white p-8 sm:p-12 md:p-16 shadow-xs">
          <Quote className="w-10 h-10 text-gold/40 mb-6" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <blockquote className="font-editorial text-xl sm:text-2xl md:text-3xl text-dark-brown font-normal leading-[1.35] tracking-tight">
                "{current.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="pt-6 border-t border-[#F0EAE0] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-700/10 border border-emerald-700/20 px-2 py-0.5 rounded-[1px] font-semibold font-sans ml-2">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                      Verified Installation
                    </span>
                  </div>

                  <div className="font-editorial text-xl text-dark-brown font-medium">
                    {current.client}
                  </div>
                  <div className="text-xs text-dark-brown/70 font-sans mt-0.5">
                    {current.role} · <span className="text-burgundy font-medium">{current.location}</span>
                  </div>
                  <div className="text-[11px] text-dark-brown/50 font-mono mt-1">
                    Commission: {current.product}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-3 rounded-[2px] border border-[#EBE4D6] hover:border-burgundy hover:text-burgundy text-dark-brown transition bg-white shadow-2xs cursor-pointer"
                    aria-label="Previous quote"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-dark-brown/60 px-1 select-none">
                    0{currentIndex + 1} / 0{ARCHITECTURAL_TESTIMONIALS.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-3 rounded-[2px] border border-[#EBE4D6] hover:border-burgundy hover:text-burgundy text-dark-brown transition bg-white shadow-2xs cursor-pointer"
                    aria-label="Next quote"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
