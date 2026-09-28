import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Maximize2, Sun, Moon, ArrowRight, Check, Compass } from 'lucide-react';
import { useCatalog } from '@/lib/catalogContext';
import { finishLabels } from '@/lib/catalog';
import { ShapeThumb } from '@/components/shop/ShapeThumb';

interface RoomEnvironment {
  id: string;
  name: string;
  category: string;
  bgImage: string;
  wallColor: string;
  wallTextureClass: string;
  recommendedSize: string;
  lightingType: string;
}

const ROOMS: RoomEnvironment[] = [
  {
    id: 'penthouse-living',
    name: 'Penthouse Living Room',
    category: 'Residential',
    bgImage: '/images/hero-penthouse-brass.jpg',
    wallColor: '#1c1b1a',
    wallTextureClass: 'bg-stone-900/60',
    recommendedSize: '1,400 × 900 mm',
    lightingType: 'Honed French Limestone · Natural West Light',
  },
  {
    id: 'collector-gallery',
    name: 'Private Collector Gallery',
    category: 'Museum / Exhibition',
    bgImage: '/images/installation-round.jpg',
    wallColor: '#252321',
    wallTextureClass: 'bg-neutral-900/70',
    recommendedSize: '1,200 × 1,200 mm',
    lightingType: 'Archival Chalk Plaster · 3000K Directional Track',
  },
  {
    id: 'alpine-hearth',
    name: 'Alpine Hearth & Lounge',
    category: 'Hospitality',
    bgImage: '/images/installation-corten.jpg',
    wallColor: '#2b231d',
    wallTextureClass: 'bg-amber-950/60',
    recommendedSize: '1,800 × 900 mm',
    lightingType: 'Charred Swiss Larch & Granite · Warm Firelight',
  },
  {
    id: 'executive-office',
    name: 'Executive Studio & Study',
    category: 'Commercial & Trade',
    bgImage: '/images/artisan-workshop.jpg',
    wallColor: '#16191f',
    wallTextureClass: 'bg-slate-900/70',
    recommendedSize: '1,000 × 600 mm',
    lightingType: 'Board-Formed Architectural Concrete',
  },
];

const FINISH_OPTIONS = [
  { id: 'brass', name: 'Solid CZ108 Brass', hex: '#c29b38', accent: 'Gold & Warm Reflections' },
  { id: 'black', name: 'Obsidian Velvet Black', hex: '#1c1d21', accent: 'Matte Deep Shadow' },
  { id: 'silver', name: '316L Marine Stainless', hex: '#a6b0bb', accent: 'Satin Architectural Brush' },
  { id: 'corten', name: 'Weathered Cor-Ten', hex: '#994f28', accent: 'Terracotta Rust Patina' },
  { id: 'copper', name: 'French Chemical Bronze', hex: '#4e3323', accent: 'Smoky Charcoal & Bronze' },
];

export function RoomVisualizer({ onOpenStudio }: { onOpenStudio?: () => void }) {
  const { products, storeConfig } = useCatalog();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState('brass');
  const [lighting, setLighting] = useState<'day' | 'night'>('day');
  const [standoffElevation, setStandoffElevation] = useState(true);

  // Take top curated artworks
  const showcaseProducts = products.slice(0, 5);
  const currentProduct = showcaseProducts[selectedProductIndex] || products[0];
  const currentRoom = ROOMS[selectedRoomIndex];

  return (
    <section 
      id="visualizer" 
      className="relative py-24 md:py-36 bg-[#0B0B0B] text-[#F4F2EE] overflow-hidden border-t border-b border-white/10"
      data-cursor="EXPLORE"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#B98B48]/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#800020]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3.5">
              <Compass className="w-3 h-3 text-[#D4AF37]" />
              <span>Spatial Scale Simulation · See It In Your Space</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight">
              Visualize artwork on <br />
              <span className="italic font-light text-[#E8E5DF]/70">architectural interiors.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#F4F2EE]/60 max-w-md font-sans leading-relaxed">
            Metal wall art interacts with architectural light, cast shadows, and surface textures. Test proportions and alloy reflectivity against genuine limestone, concrete, and blackened oak.
          </p>
        </div>

        {/* The Spatial Stage / Canvas */}
        <div className="relative rounded-[4px] border border-white/15 bg-black overflow-hidden shadow-2xl">
          {/* Main Visual Stage */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden flex items-center justify-center">
            {/* Background Room Photography */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoom.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={currentRoom.bgImage}
                  alt={currentRoom.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    lighting === 'night' ? 'brightness-75 contrast-125' : 'brightness-95'
                  }`}
                />
                {/* Lighting overlay */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                    lighting === 'night' 
                      ? 'bg-gradient-to-t from-black/80 via-black/40 to-black/20' 
                      : 'bg-black/35 backdrop-brightness-95'
                  }`} 
                />
              </motion.div>
            </AnimatePresence>

            {/* Simulated Artwork Floating On Wall */}
            <div className="relative z-10 max-w-[50%] max-h-[60%] flex items-center justify-center select-none pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentProduct?.id}-${selectedFinish}-${standoffElevation}`}
                  initial={{ opacity: 0, scale: 0.88, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {/* Floating Standoff Drop Shadow Simulation */}
                  {standoffElevation && (
                    <div 
                      className={`absolute inset-0 transform translate-y-7 translate-x-3 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                        lighting === 'night' 
                          ? 'bg-black/90 scale-95 opacity-90' 
                          : 'bg-black/60 scale-90 opacity-70'
                      }`}
                    />
                  )}

                  {/* Artwork Shape Renderer */}
                  <div className="w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 relative">
                    <ShapeThumb
                      shapeId={currentProduct?.shapeId ?? 'circle'}
                      finish={selectedFinish}
                      className="w-full h-full filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)]"
                    />
                  </div>

                  {/* Laser Dimension Callout Flag */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-[2px] text-[9px] font-mono tracking-widest text-[#E8E5DF] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                    <span>{currentProduct?.sizes?.[0]?.label || '1,200 mm'} · 3.0mm Plate</span>
                    <span className="text-white/40">|</span>
                    <span className="text-[#D4AF37]">25mm Standoff</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Room Environment Tag (Top Left) */}
            <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-[2px]">
              <div className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                {currentRoom.category}
              </div>
              <div className="font-editorial text-sm text-white tracking-wide mt-0.5">
                {currentRoom.name}
              </div>
              <div className="text-[10px] text-white/50 font-mono mt-0.5">
                {currentRoom.lightingType}
              </div>
            </div>

            {/* Lighting & Elevation Control (Top Right) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLighting(l => l === 'day' ? 'night' : 'day')}
                className="p-2.5 rounded-[2px] bg-black/80 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:border-[#D4AF37] transition flex items-center gap-2 text-xs"
                title="Toggle Ambient Sun / Evening Directional Lighting"
              >
                {lighting === 'day' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
                <span className="text-[10px] uppercase tracking-widest font-mono hidden sm:inline">
                  {lighting === 'day' ? 'Day Light' : 'Evening Track'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStandoffElevation(s => !s)}
                className={`p-2.5 rounded-[2px] bg-black/80 backdrop-blur-md border transition flex items-center gap-2 text-xs ${
                  standoffElevation ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/20 text-white/60'
                }`}
                title="Toggle 25mm Architectural Wall Standoff Shadow"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-mono hidden sm:inline">
                  25mm Standoff
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Interactive Dashboard */}
          <div className="p-6 md:p-8 bg-[#111111] border-t border-white/10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.1fr] gap-8 items-center">
            {/* Column 1: Room Selector */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-3">
                1. Select Architectural Environment
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROOMS.map((r, idx) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoomIndex(idx)}
                    className={`p-2.5 rounded-[2px] text-left border transition-all text-xs ${
                      selectedRoomIndex === idx
                        ? 'border-[#D4AF37] bg-white/10 text-white shadow-sm'
                        : 'border-white/10 hover:border-white/30 text-white/60 hover:text-white bg-black/40'
                    }`}
                  >
                    <div className="text-[8px] uppercase tracking-wider text-[#D4AF37] font-mono">
                      0{idx + 1}
                    </div>
                    <div className="font-editorial text-xs truncate mt-0.5">
                      {r.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Alloy & Finish Selector */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-3">
                2. Select Metal Alloy & Finish
              </div>
              <div className="flex flex-wrap gap-2.5">
                {FINISH_OPTIONS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFinish(f.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-[2px] border text-xs transition ${
                      selectedFinish === f.id
                        ? 'border-[#D4AF37] bg-white/10 text-white shadow-sm'
                        : 'border-white/10 hover:border-white/30 text-white/70 bg-black/40'
                    }`}
                    title={f.accent}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" 
                      style={{ background: f.hex }} 
                    />
                    <span className="text-[10px] tracking-wider uppercase font-medium">{f.name.split(' ')[0]}</span>
                    {selectedFinish === f.id && <Check className="w-3 h-3 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Artwork Switcher & Primary Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-4">
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-mono">
                  Current Artwork
                </div>
                <div className="font-editorial text-xl text-white font-normal truncate mt-0.5">
                  {currentProduct?.name || 'Nova Facet Relief'}
                </div>
                <div className="text-xs font-mono text-[#D4AF37] font-semibold mt-0.5">
                  {storeConfig.currency || '₹'}{(currentProduct?.price || 18500).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/product/${currentProduct?.slug}`}
                  className="px-5 py-3 rounded-[2px] bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E8E5DF] transition flex items-center justify-center gap-2"
                >
                  Configure
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {onOpenStudio && (
                  <button
                    type="button"
                    onClick={onOpenStudio}
                    className="p-3 rounded-[2px] border border-white/25 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition"
                    title="Launch Bespoke CAD Studio"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
