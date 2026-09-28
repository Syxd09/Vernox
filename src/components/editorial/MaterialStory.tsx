import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Shield, Compass, Check } from 'lucide-react';

interface MaterialSpec {
  id: string;
  name: string;
  alloyFamily: string;
  thickness: string;
  density: string;
  gradient: string;
  accentColor: string;
  tagline: string;
  description: string;
  specDetails: {
    standard: string;
    finishType: string;
    resistance: string;
    tactileFeel: string;
  };
}

const MATERIALS: MaterialSpec[] = [
  {
    id: 'brass',
    name: 'CZ108 Architectural Brass',
    alloyFamily: 'Copper-Zinc (CuZn37)',
    thickness: '3.0 mm Solid Plate',
    density: '8.44 g/cm³',
    gradient: 'from-[#C29B38] via-[#E5C158] to-[#9E7A23]',
    accentColor: '#D4AF37',
    tagline: 'Warm golden reflectivity with directional satin grain.',
    description: 'Cold-rolled solid brass milled with abrasive fleece belts to create continuous linear graining. Sealed in microcrystalline archival wax to retard uncontrolled tarnish while allowing natural depth to mature.',
    specDetails: {
      standard: 'EN 12163 / CW508L',
      finishType: 'Hand-Milled Linear Satin + Wax',
      resistance: 'Interior & Sheltered Exterior',
      tactileFeel: 'Silky, substantial, cool to touch',
    },
  },
  {
    id: 'stainless',
    name: '316L Marine Stainless Steel',
    alloyFamily: 'Austenitic Chromium-Nickel-Moly',
    thickness: '3.0 mm Solid Plate',
    density: '8.00 g/cm³',
    gradient: 'from-[#A6B0BB] via-[#D5DEE7] to-[#7B8590]',
    accentColor: '#E2E8F0',
    tagline: 'Pristine surgical clarity immune to atmospheric humidity.',
    description: 'Stabilized with 2.5% molybdenum, 316L resists chloride pitting and coastal saline air. Finished with a non-directional orbital satin brush that disperses light without harsh mirror glare.',
    specDetails: {
      standard: 'AISI 316L / DIN 1.4404',
      finishType: 'Orbital Satin Micro-Etch',
      resistance: 'Immune to Salt, Humidity & UV',
      tactileFeel: 'Smooth architectural matte',
    },
  },
  {
    id: 'corten',
    name: 'Cor-Ten Weathering Steel',
    alloyFamily: 'Atmospheric Corrosion Resistant Alloy',
    thickness: '3.0 mm Solid Plate',
    density: '7.85 g/cm³',
    gradient: 'from-[#994F28] via-[#B86235] to-[#733516]',
    accentColor: '#C05621',
    tagline: 'A living, self-regenerating oxide patina of terracotta and amber.',
    description: 'Engineered with copper, chromium, and nickel that triggers a dense, protective oxide skin over 90 days. Sealed with matte polyurethane fixative to prevent rub-off on white gallery walls.',
    specDetails: {
      standard: 'EN 10025-5 / Corten A',
      finishType: 'Accelerated Oxidation + Clear Barrier',
      resistance: 'Self-Healing Weathering Skin',
      tactileFeel: 'Subtle velvety texture',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian Velvet Black',
    alloyFamily: 'Laser-Cut Hardened Steel Alloy',
    thickness: '3.0 mm Solid Plate',
    density: '7.82 g/cm³',
    gradient: 'from-[#1A1A1D] via-[#2A2B32] to-[#0E0E10]',
    accentColor: '#94A3B8',
    tagline: 'Deep light-absorbing shadow silhouette with zero glare.',
    description: 'Electrostatically bonded with architectural polyester TGIC-free powder coating cured at 200°C. Delivers a zero-sheen micro-stipple finish that dramatizes positive and negative wall relief.',
    specDetails: {
      standard: 'Qualicoat Class 2 Architectural',
      finishType: 'Electrostatic Cured Powder Coat',
      resistance: 'Scratch & Mar Resistant',
      tactileFeel: 'Fine sand-cast micro-texture',
    },
  },
  {
    id: 'bronze',
    name: 'French Patina Bronze',
    alloyFamily: 'Chemical Conversion on Solid Brass',
    thickness: '3.0 mm Solid Plate',
    density: '8.40 g/cm³',
    gradient: 'from-[#4A3525] via-[#634833] to-[#2B1D12]',
    accentColor: '#B7791F',
    tagline: 'Smoky charcoal with burnished warm bronze undertones.',
    description: 'Submerged in successive liver-of-sulphur chemical baths to induce deep oxidation, then hand-relieved with pumice paste to expose high points before sealing with museum carnauba wax.',
    specDetails: {
      standard: 'Atelier Proprietary Conversion',
      finishType: 'Hot Chemical Bath + Pumice Relief',
      resistance: 'Interior Heirloom Longevity',
      tactileFeel: 'Aged sculptural depth',
    },
  },
];

export function MaterialStory() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSpec>(MATERIALS[0]);

  return (
    <section 
      id="materials" 
      className="relative py-24 md:py-36 bg-[#0B0B0B] text-[#F4F2EE] border-b border-white/10 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#D4AF37]/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3.5">
              <Layers className="w-3 h-3 text-[#D4AF37]" />
              <span>Metallurgical Archives</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight">
              Metal becomes art. <br />
              <span className="italic font-light text-[#E8E5DF]/70">Solid plate, never foil.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#F4F2EE]/60 max-w-md font-sans leading-relaxed">
            Every millimeter of thickness imparts mass, acoustic weight, and cast shadow depth. Explore the molecular character and finishing processes of our noble metal repertoire.
          </p>
        </div>

        {/* Material Selection Pills */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {MATERIALS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMaterial(m)}
              className={`flex items-center gap-3 px-5 py-3 rounded-[2px] border transition-all duration-300 text-xs ${
                selectedMaterial.id === m.id
                  ? 'border-[#D4AF37] bg-white/10 text-white shadow-sm'
                  : 'border-white/10 hover:border-white/30 text-white/60 hover:text-white bg-black/40'
              }`}
            >
              <div 
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${m.gradient} border border-white/30 shrink-0`} 
              />
              <span className="tracking-wider uppercase font-medium">{m.name.split(' ')[0]}</span>
              {selectedMaterial.id === m.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
            </button>
          ))}
        </div>

        {/* Detailed Material Showcase Panel */}
        <div className="rounded-[4px] border border-white/15 bg-[#121212] p-8 sm:p-12 md:p-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                {selectedMaterial.alloyFamily} · {selectedMaterial.thickness}
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl text-white font-normal leading-tight">
                {selectedMaterial.name}
              </h3>
              <p className="font-editorial italic text-lg sm:text-xl text-[#D4AF37]">
                "{selectedMaterial.tagline}"
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#F4F2EE]/75 leading-relaxed font-sans max-w-xl">
              {selectedMaterial.description}
            </p>

            {/* Specifications Matrix */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-5 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Alloy Standard</span>
                <span className="text-white font-semibold">{selectedMaterial.specDetails.standard}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Surface Protocol</span>
                <span className="text-white font-semibold">{selectedMaterial.specDetails.finishType}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Environmental Grade</span>
                <span className="text-white font-semibold">{selectedMaterial.specDetails.resistance}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Density & Mass</span>
                <span className="text-[#D4AF37] font-semibold">{selectedMaterial.density}</span>
              </div>
            </div>
          </div>

          {/* Right Macro Texture Simulation / Plate Elevation */}
          <div className="relative rounded-[3px] p-8 border border-white/15 bg-black/60 flex flex-col items-center justify-center text-center shadow-inner group">
            {/* Visual Alloy Swatch Slab */}
            <div 
              className={`w-full aspect-[16/10] rounded-[2px] bg-gradient-to-tr ${selectedMaterial.gradient} shadow-2xl relative overflow-hidden border border-white/20 transition-transform duration-700 group-hover:scale-[1.02]`}
            >
              {/* Brushed Texture Lines Overlay */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20" />
              
              {/* Corner Hallmark Tag */}
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-[1px] border border-white/20 text-[8px] font-mono uppercase tracking-widest text-[#D4AF37]">
                3.0mm Plate Verified
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between w-full text-xs font-mono text-white/60">
              <span>Tactile Feedback:</span>
              <span className="text-white italic">{selectedMaterial.specDetails.tactileFeel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
