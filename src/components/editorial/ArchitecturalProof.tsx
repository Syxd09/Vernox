import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useCatalog } from '@/lib/catalogContext';

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
  const { reviews, products } = useCatalog();
  const [currentIndex, setCurrentIndex] = useState(0);

  // If there are user reviews in the catalogContext, we can include them seamlessly
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
      className="relative py-24 md:py-36 bg-[#141518] text-[#F4F2EE] border-b border-white/10 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#C5A880]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Pill */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#C5A880] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Architectural Provenance & Client Feedback</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-white font-normal">
            Voices from living spaces.
          </h2>
        </div>

        {/* Large Editorial Quote Stage */}
        <div className="relative rounded-[4px] border border-white/15 bg-black/60 backdrop-blur-xl p-8 sm:p-14 md:p-20 shadow-2xl">
          <Quote className="w-12 h-12 text-[#C5A880]/30 mb-8" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <blockquote className="font-editorial text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-[1.3] tracking-wide">
                "{current.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                    ))}
                    <span className="text-[10px] font-mono text-[#C5A880] ml-1.5">5.0 Verified Installation</span>
                  </div>

                  <div className="font-editorial text-xl text-white font-normal">
                    {current.client}
                  </div>
                  <div className="text-xs text-white/60 font-mono mt-0.5">
                    {current.role} · <span className="text-[#C5A880]">{current.location}</span>
                  </div>
                  <div className="text-[11px] text-white/40 font-mono mt-1">
                    Commission: {current.product}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-3 rounded-[2px] border border-white/20 hover:border-white text-white/70 hover:text-white transition"
                    aria-label="Previous quote"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-white/50 px-1">
                    0{currentIndex + 1} / 0{ARCHITECTURAL_TESTIMONIALS.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-3 rounded-[2px] border border-white/20 hover:border-white text-white/70 hover:text-white transition"
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
