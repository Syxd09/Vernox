import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

interface CraftingStudioSectionProps {
  onOpenStudio?: () => void;
}

export function CraftingStudioSection({ onOpenStudio }: CraftingStudioSectionProps) {
  return (
    <section className="bg-white py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-16">
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-[0.28em] font-sans text-burgundy font-semibold">
              Bespoke Fabrication & Architectural Commissions
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal leading-tight tracking-tight">
            CUSTOM WORKS FOR <br />
            <span className="italic font-light text-burgundy">PRIVATE & ARCHITECTURAL SPACES</span>
          </h2>

          <p className="text-xs sm:text-sm text-dark-brown/75 font-sans mt-3 leading-relaxed max-w-2xl">
            When an interior demands exact spatial proportions, noble patinas, or unique silhouettes outside our catalog, the Vernox atelier works in direct collaboration with collectors, interior architects, and design practices worldwide.
          </p>
        </div>

        {/* 2-Column Bespoke Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Authentic Atelier Workshop Photography & Quality Specifications */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/11] bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] overflow-hidden shadow-sm group">
              <img
                src="/images/artisan-workshop.jpg"
                alt="Vernox master artisans hand-finishing architectural metal relief in the atelier"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Photo provenance badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-[#EBE4D6] px-3 py-1.5 rounded-[2px] text-[10px] font-mono uppercase tracking-wider text-dark-brown font-medium">
                Antwerp Atelier · Hand-Dressed Patina
              </div>

              {/* Photo caption footer */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-sans font-medium text-white/90">
                  Master Finishing & Directional Scotch-Brite Linishing
                </div>
                <div className="text-[10px] font-sans text-white/70 mt-0.5">
                  Solid 3.0mm Belgian alloy plate undergoing hand-burnishing and archival chemical oxidation.
                </div>
              </div>
            </div>

            {/* Inset architectural detail card */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3.5 bg-cream border border-[#EBE4D6] rounded-[2px]">
                <div className="text-[9px] uppercase tracking-widest text-burgundy font-sans font-semibold">
                  Alloy Standards
                </div>
                <div className="text-xs font-medium text-dark-brown font-sans mt-1">
                  Solid 3.0mm Plate
                </div>
                <div className="text-[10px] text-dark-brown/60 font-sans mt-0.5">
                  Never pressed foil
                </div>
              </div>

              <div className="p-3.5 bg-cream border border-[#EBE4D6] rounded-[2px]">
                <div className="text-[9px] uppercase tracking-widest text-burgundy font-sans font-semibold">
                  Laser Tolerance
                </div>
                <div className="text-xs font-medium text-dark-brown font-sans mt-1">
                  ±0.05mm Precision
                </div>
                <div className="text-[10px] text-dark-brown/60 font-sans mt-0.5">
                  20-bar nitrogen kerf
                </div>
              </div>

              <div className="p-3.5 bg-cream border border-[#EBE4D6] rounded-[2px]">
                <div className="text-[9px] uppercase tracking-widest text-burgundy font-sans font-semibold">
                  Authentication
                </div>
                <div className="text-xs font-medium text-dark-brown font-sans mt-1">
                  Numbered Hallmark
                </div>
                <div className="text-[10px] text-dark-brown/60 font-sans mt-0.5">
                  Signed studio seal
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Step Bespoke Commission Process & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-burgundy font-sans font-semibold mb-2">
                Atelier Commission Process
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-dark-brown font-normal leading-snug">
                FROM CONCEPT SKETCH TO PERMANENT WALL INSTALLATION
              </h3>
            </div>

            {/* 3 Process Steps */}
            <div className="space-y-6">
              <div className="border-l-2 border-gold/40 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-burgundy">01</span>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
                    Spatial Concept & Scale Specification
                  </h4>
                </div>
                <p className="text-xs text-dark-brown/70 font-sans mt-1.5 leading-relaxed">
                  Provide your wall dimensions, interior elevations, or architectural vector files (DXF, DWG, PDF). Our team produces 1:1 scale shop drawings and structural weight calculations.
                </p>
              </div>

              <div className="border-l-2 border-gold/40 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-burgundy">02</span>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
                    Noble Metallurgy & Historic Patination
                  </h4>
                </div>
                <p className="text-xs text-dark-brown/70 font-sans mt-1.5 leading-relaxed">
                  Choose from architectural brass (CZ108), oxidized copper, structural blackened steel, or weathered Corten — matured with archival French chemical baths and sealed with microcrystalline wax.
                </p>
              </div>

              <div className="border-l-2 border-gold/40 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-burgundy">03</span>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
                    Laser Fabrication & Insured Crated Transit
                  </h4>
                </div>
                <p className="text-xs text-dark-brown/70 font-sans mt-1.5 leading-relaxed">
                  Cut under 3000W nitrogen-shielded lasers, hand-dressed by artisans, stamped with your edition hallmark, and dispatched in custom reinforced timber crates with concealed mounting standoffs.
                </p>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="pt-2 space-y-3">
              {onOpenStudio ? (
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="w-full py-4 px-6 rounded-[2px] bg-burgundy hover:bg-burgundy-hover text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2.5 cursor-pointer border border-transparent hover:border-dusty-pink"
                >
                  <Compass className="w-4 h-4 text-dusty-pink" />
                  <span>Launch Interactive Crafting Studio</span>
                </button>
              ) : (
                <Link
                  to="/customize"
                  className="w-full py-4 px-6 rounded-[2px] bg-burgundy hover:bg-burgundy-hover text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2.5 text-center border border-transparent hover:border-dusty-pink"
                >
                  <Compass className="w-4 h-4 text-dusty-pink" />
                  <span>Launch Interactive Crafting Studio</span>
                </Link>
              )}

              <Link
                to="/about#b2b"
                className="w-full py-3.5 px-6 rounded-[2px] bg-white hover:bg-cream border border-[#EBE4D6] hover:border-burgundy/40 text-dark-brown text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors flex items-center justify-center gap-2 text-center"
              >
                <span>Architectural & Trade Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Architectural Quality Benchmarks at Bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#EBE4D6]">
          <div className="border-t border-[#EBE4D6] pt-4 space-y-1">
            <span className="font-mono text-xs text-gold font-medium block">01</span>
            <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
              Certified European Alloys
            </h4>
            <p className="text-xs text-dark-brown/70 font-sans leading-relaxed">
              Solid 3.0mm structural plate sourced from certified Belgian metallurgical mills.
            </p>
          </div>

          <div className="border-t border-[#EBE4D6] pt-4 space-y-1">
            <span className="font-mono text-xs text-gold font-medium block">02</span>
            <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
              Zero Oxidation Cut Edges
            </h4>
            <p className="text-xs text-dark-brown/70 font-sans leading-relaxed">
              18-bar nitrogen assist guarantees mirror-smooth contours with zero slag or edge discolouration.
            </p>
          </div>

          <div className="border-t border-[#EBE4D6] pt-4 space-y-1">
            <span className="font-mono text-xs text-gold font-medium block">03</span>
            <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
              Concealed Standoff Mounts
            </h4>
            <p className="text-xs text-dark-brown/70 font-sans leading-relaxed">
              20mm floating wall mounts create dramatic ambient drop shadows on your wall.
            </p>
          </div>

          <div className="border-t border-[#EBE4D6] pt-4 space-y-1">
            <span className="font-mono text-xs text-gold font-medium block">04</span>
            <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
              Reinforced Timber Crates
            </h4>
            <p className="text-xs text-dark-brown/70 font-sans leading-relaxed">
              Foam-damped custom transit boxes engineered for zero deflection during worldwide air freight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
