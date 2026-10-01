import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, CheckCircle2, Sliders, Maximize2, ShieldCheck } from 'lucide-react';

interface CraftingStudioSectionProps {
  onOpenStudio?: () => void;
}

type ShapeOption = 'arch' | 'horizon' | 'mandala' | 'monogram';
type FinishOption = 'gold' | 'brass' | 'steel' | 'copper';

const finishes: Array<{ id: FinishOption; name: string; hex: string; desc: string }> = [
  { id: 'gold', name: 'Brushed Gold', hex: '#C6A15B', desc: 'Hand-burnished matte gold with warm luster' },
  { id: 'brass', name: 'Antique Brass', hex: '#D4AF37', desc: 'Satin CZ108 architectural brass' },
  { id: 'steel', name: 'Blackened Steel', hex: '#2A2A2E', desc: 'Deep gunmetal patina on 3mm hot-rolled plate' },
  { id: 'copper', name: 'Aged Copper', hex: '#B87333', desc: 'Warm reddish bronze with gentle chemical aging' },
];

const shapes: Array<{ id: ShapeOption; name: string; basePrice: number }> = [
  { id: 'arch', name: 'Modernist Arch', basePrice: 245 },
  { id: 'horizon', name: 'Geometric Horizon', basePrice: 280 },
  { id: 'mandala', name: 'Concentric Ring', basePrice: 320 },
  { id: 'monogram', name: 'Architectural Monogram', basePrice: 195 },
];

export function CraftingStudioSection({ onOpenStudio }: CraftingStudioSectionProps) {
  const [selectedShape, setSelectedShape] = useState<ShapeOption>('horizon');
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>('gold');
  const [widthMm, setWidthMm] = useState(900);
  const [heightMm, setHeightMm] = useState(600);

  const activeShape = shapes.find(s => s.id === selectedShape) || shapes[0];
  const activeFinish = finishes.find(f => f.id === selectedFinish) || finishes[0];

  // Dynamic calculated pricing preview based on area and alloy
  const areaFactor = (widthMm * heightMm) / (900 * 600);
  const finishMultiplier = selectedFinish === 'gold' || selectedFinish === 'brass' ? 1.15 : 1.0;
  const estimatedPrice = Math.round(activeShape.basePrice * areaFactor * finishMultiplier);

  return (
    <section className="bg-[#FFFFFF] py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans text-maroon-light font-semibold mb-2">
            <span className="w-5 h-[1px] bg-gold" />
            <span>Interactive Custom Craftsmanship</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal leading-tight tracking-tight">
            THE BESPOKE <br />
            <span className="italic font-light text-maroon-deep">CRAFTING STUDIO</span>
          </h2>

          <p className="text-xs sm:text-sm text-dark-brown/75 font-sans mt-3 leading-relaxed max-w-2xl">
            Design your own wall art, architectural sculpture, or custom monogram directly in our interactive CAD studio. Adjust exact millimeter dimensions, experiment with noble metal patinas, and see instant pricing.
          </p>
        </div>

        {/* Studio Interactive Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: Interactive Live Vector Canvas Simulation */}
          <div className="lg:col-span-7 bg-[#F8F3EA] border border-[#EBE4D6] rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE4D6] text-xs font-mono text-dark-brown/70">
              <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-maroon-deep font-semibold">
                <Compass className="w-3.5 h-3.5 text-gold" /> Live CAD Simulation
              </span>
              <span className="text-[11px]">
                {widthMm}mm × {heightMm}mm · 3.0mm Plate
              </span>
            </div>

            {/* Simulated Gallery Wall with dynamic artwork */}
            <div className="relative my-8 sm:my-10 aspect-[16/10] bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] flex items-center justify-center p-8 overflow-hidden shadow-inner">
              {/* Subtle ambient wall shadow */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.06] pointer-events-none" />

              {/* Dynamic SVG Artwork representation */}
              <div 
                className="relative transition-all duration-700 ease-out flex items-center justify-center"
                style={{
                  width: `${Math.min(320, widthMm / 3.2)}px`,
                  height: `${Math.min(220, heightMm / 3.2)}px`,
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))',
                }}
              >
                {selectedShape === 'arch' && (
                  <svg viewBox="0 0 200 280" className="w-full h-full">
                    <path
                      d="M20 270 V100 A80 80 0 0 1 180 100 V270 Z"
                      fill={activeFinish.hex}
                      stroke={selectedFinish === 'gold' ? '#FFE8A3' : '#FFFFFF'}
                      strokeWidth="2"
                    />
                    <path
                      d="M50 270 V120 A50 50 0 0 1 150 120 V270 Z"
                      fill="#FAF8F5"
                      opacity="0.9"
                    />
                    <circle cx="100" cy="70" r="16" fill={activeFinish.hex} />
                  </svg>
                )}

                {selectedShape === 'horizon' && (
                  <svg viewBox="0 0 320 200" className="w-full h-full">
                    <rect x="10" y="10" width="300" height="180" rx="2" fill={activeFinish.hex} />
                    <line x1="20" y1="100" x2="300" y2="100" stroke="#FAF8F5" strokeWidth="4" />
                    <circle cx="160" cy="70" r="35" fill="#FAF8F5" opacity="0.85" />
                    <line x1="40" y1="140" x2="280" y2="140" stroke="#FAF8F5" strokeWidth="2" strokeDasharray="6 6" />
                  </svg>
                )}

                {selectedShape === 'mandala' && (
                  <svg viewBox="0 0 260 260" className="w-full h-full">
                    <circle cx="130" cy="130" r="115" fill={activeFinish.hex} />
                    <circle cx="130" cy="130" r="90" fill="#FAF8F5" />
                    <circle cx="130" cy="130" r="65" fill={activeFinish.hex} opacity="0.9" />
                    <circle cx="130" cy="130" r="38" fill="#FAF8F5" />
                    <circle cx="130" cy="130" r="16" fill={activeFinish.hex} />
                  </svg>
                )}

                {selectedShape === 'monogram' && (
                  <svg viewBox="0 0 220 260" className="w-full h-full">
                    <rect x="15" y="15" width="190" height="230" rx="2" fill="none" stroke={activeFinish.hex} strokeWidth="6" />
                    <text
                      x="110"
                      y="160"
                      textAnchor="middle"
                      fill={activeFinish.hex}
                      fontFamily="Italiana, serif"
                      fontSize="110"
                      fontWeight="bold"
                    >
                      V
                    </text>
                    <line x1="40" y1="205" x2="180" y2="205" stroke={activeFinish.hex} strokeWidth="3" />
                  </svg>
                )}
              </div>

              {/* Floor base line indicator */}
              <div className="absolute bottom-2 left-10 right-10 h-[1px] bg-dark-brown/15" />
            </div>

            {/* Quick Dimension Range Controls */}
            <div className="pt-4 border-t border-[#EBE4D6] space-y-3">
              <div className="flex items-center justify-between text-xs font-sans text-dark-brown">
                <span className="text-[10px] uppercase tracking-wider text-dark-brown/70 font-semibold">
                  Scale & Dimensions
                </span>
                <span className="font-mono text-maroon-deep font-semibold">
                  {widthMm} mm Width × {heightMm} mm Height
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-dark-brown/60 mb-1">
                    <span>Width</span>
                    <span>{widthMm}mm</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1800"
                    step="50"
                    value={widthMm}
                    onChange={(e) => setWidthMm(Number(e.target.value))}
                    className="w-full accent-[#6B2732]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-dark-brown/60 mb-1">
                    <span>Height</span>
                    <span>{heightMm}mm</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1200"
                    step="50"
                    value={heightMm}
                    onChange={(e) => setHeightMm(Number(e.target.value))}
                    className="w-full accent-[#6B2732]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Studio Customization Palette & Launch CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-white border border-[#EBE4D6] p-6 sm:p-8 rounded-[2px] shadow-xs">
            <div className="space-y-6">
              {/* Select Geometric Shape */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.24em] font-sans font-semibold text-dark-brown mb-3">
                  01 · Select Motif / Silhouette
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {shapes.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setSelectedShape(shape.id)}
                      className={`p-3 text-left rounded-[2px] border text-xs transition-all cursor-pointer ${
                        selectedShape === shape.id
                          ? 'border-maroon-deep bg-[#F8F3EA] text-maroon-deep font-semibold shadow-xs'
                          : 'border-[#EBE4D6] hover:border-gold/60 text-dark-brown/80'
                      }`}
                    >
                      <span className="block font-medium truncate">{shape.name}</span>
                      <span className="text-[10px] text-dark-brown/60 font-mono block mt-0.5">
                        From ${shape.basePrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Noble Metal Alloy */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.24em] font-sans font-semibold text-dark-brown mb-3">
                  02 · Select Noble Metal Patina
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFinish(f.id)}
                      className={`p-3 text-left rounded-[2px] border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                        selectedFinish === f.id
                          ? 'border-maroon-deep bg-[#F8F3EA] text-maroon-deep font-semibold shadow-xs'
                          : 'border-[#EBE4D6] hover:border-gold/60 text-dark-brown/80'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0 mt-0.5"
                        style={{ backgroundColor: f.hex }}
                      />
                      <div className="truncate">
                        <span className="block font-medium text-[11px] truncate">{f.name}</span>
                        <span className="text-[9px] text-dark-brown/60 block line-clamp-1">{f.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Price & Specs */}
              <div className="p-4 rounded-[2px] bg-[#FAF8F5] border border-[#EBE4D6] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-dark-brown/70 font-sans">
                    Estimated Atelier Price
                  </span>
                  <span className="font-editorial text-2xl text-dark-brown font-normal">
                    ${estimatedPrice}
                  </span>
                </div>
                <div className="text-[10px] text-dark-brown/60 font-sans leading-relaxed flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Includes laser kerf cutting, hand patination & wood-crated shipping.</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#EBE4D6]">
              {onOpenStudio ? (
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="w-full py-4 rounded-[2px] bg-maroon-deep hover:opacity-90 text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-gold"
                >
                  <Compass className="w-4 h-4 text-gold" />
                  <span>OPEN CRAFTING STUDIO</span>
                </button>
              ) : (
                <Link
                  to="/customize"
                  className="w-full py-4 rounded-[2px] bg-maroon-deep hover:opacity-90 text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 text-center border border-transparent hover:border-gold"
                >
                  <Compass className="w-4 h-4 text-gold" />
                  <span>OPEN CRAFTING STUDIO</span>
                </Link>
              )}

              <Link
                to="/customize"
                className="w-full py-3 rounded-[2px] bg-white hover:bg-[#F8F3EA] border border-[#EBE4D6] hover:border-gold/60 text-dark-brown text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors flex items-center justify-center gap-2 text-center"
              >
                <span>Upload Custom DXF / Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Step Process Footer Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 pt-12 border-t border-[#EBE4D6]">
          <div className="flex items-start gap-4">
            <span className="font-editorial text-2xl text-maroon-deep">01</span>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
                Choose Form & Scale
              </h4>
              <p className="text-xs text-dark-brown/70 font-sans mt-1 leading-relaxed">
                Start from pure geometric arches, frames, and botanicals, or enter precise millimeters for your wall niche.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-editorial text-2xl text-maroon-deep">02</span>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
                Sculpt & Personalize
              </h4>
              <p className="text-xs text-dark-brown/70 font-sans mt-1 leading-relaxed">
                Add monograms, family crests, text engravings, negative-space light channels, or layer multiple alloys.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-editorial text-2xl text-maroon-deep">03</span>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold text-dark-brown">
                Laser Cut & Hand-Burnished
              </h4>
              <p className="text-xs text-dark-brown/70 font-sans mt-1 leading-relaxed">
                Sliced from solid 3.0mm European plate, chemical-patinated by hand in Antwerp, and delivered in archival crates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
