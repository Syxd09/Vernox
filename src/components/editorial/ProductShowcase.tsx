import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Eye } from 'lucide-react';
import { useCatalog } from '@/lib/catalogContext';
import { useCart } from '@/lib/cartContext';
import { finishLabels } from '@/lib/catalog';
import { toast } from 'sonner';

export function ProductShowcase() {
  const { products, storeConfig } = useCatalog();
  const { add } = useCart();
  
  // Pick curated hero pieces
  const heroPieces = products.filter(p => p.featured || p.bestseller).slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = heroPieces[activeIndex] || products[0];

  const handleQuickAdd = () => {
    if (!current) return;
    const defaultSize = current.sizes[0];
    add({
      productId: current.id,
      productName: current.name,
      productSlug: current.slug,
      shapeId: current.shapeId,
      sizeLabel: defaultSize.label,
      widthMm: defaultSize.widthMm,
      heightMm: defaultSize.heightMm,
      finish: current.finishes[0],
      unitPrice: current.price,
      quantity: 1,
    });
    toast.success(`${current.name} added to your collection`);
  };

  if (!current) return null;

  return (
    <section 
      id="showcase" 
      className="relative py-24 md:py-36 bg-[#0B0B0B] text-[#F4F2EE] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3.5">
              <span>Curated Atelier Highlights</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight">
              Masterwork <br />
              <span className="italic font-light text-[#E8E5DF]/70">Sculptural Showcase.</span>
            </h2>
          </div>

          {/* Piece Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {heroPieces.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2.5 rounded-[2px] text-xs uppercase tracking-wider font-mono transition-all whitespace-nowrap ${
                  activeIndex === idx
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/25'
                }`}
              >
                0{idx + 1} · {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Master Showcase Display Grid */}
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
          {/* Left: Massive Dominated Product Imagery */}
          <div className="relative group">
            <Link to={`/product/${current.slug}`} className="block relative aspect-[4/3] rounded-[4px] overflow-hidden border border-white/15 bg-black/50 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id}
                  src={current.imageUrl || '/images/hero-penthouse-brass.jpg'}
                  alt={current.name}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </AnimatePresence>

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Artwork Scale Stamp (Bottom Right) */}
              <div className="absolute bottom-5 right-5 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-[2px] border border-white/15 text-[10px] font-mono tracking-widest text-[#E8E5DF]">
                {current.sizes?.[0]?.label || '1,200 mm'} · Solid 3.0mm Plate
              </div>

              {/* Exhibition Tag */}
              <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-[2px] border border-white/15 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-mono font-semibold">
                Featured Artwork
              </div>
            </Link>
          </div>

          {/* Right: Editorial Metadata & Actions */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-semibold">
                HANDCRAFTED · METAL ART · SOLID PLATE
              </div>
              <h3 className="font-editorial text-4xl sm:text-5xl text-white font-normal leading-[1.08]">
                {current.name}
              </h3>
              <p className="font-editorial italic text-xl text-[#E8E5DF]/75">
                "{current.tagline}"
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#F4F2EE]/75 leading-relaxed font-sans">
              {current.description}
            </p>

            {/* Alloy Spec */}
            <div className="p-4 rounded-[2px] bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40 uppercase tracking-wider">Certified Alloy</span>
                <span className="text-[#D4AF37] font-medium">{current.alloySpec || 'Solid 3.0mm Belgian CZ108 Brass'}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40 uppercase tracking-wider">Available Finishes</span>
                <span className="text-white">{current.finishes.length} Atelier Patinas</span>
              </div>
            </div>

            {/* Price & Primary CTAs */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 block font-mono">
                  Atelier Price
                </span>
                <div className="text-2xl sm:text-3xl font-editorial text-white font-normal mt-0.5">
                  {storeConfig.currency || '₹'}{current.price.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/product/${current.slug}`}
                  className="flex-1 sm:flex-none px-7 py-3.5 rounded-[2px] bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E8E5DF] transition flex items-center justify-center gap-2"
                >
                  View Artwork
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="p-3.5 rounded-[2px] border border-white/20 hover:border-white text-white hover:text-[#D4AF37] transition flex items-center justify-center"
                  title="Quick Add to Collection"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
