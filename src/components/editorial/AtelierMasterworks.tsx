import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Filter } from 'lucide-react';
import { useCatalog } from '@/lib/catalogContext';
import { ProductCard } from '@/components/shop/ProductCard';

interface Props {
  onOpenStudio?: () => void;
}

export function AtelierMasterworks({ onOpenStudio }: Props = {}) {
  const { products } = useCatalog();
  const [activeCategory, setActiveCategory] = useState<'all' | 'frames' | 'geometric' | 'nature'>('all');

  const categories = [
    { id: 'all', label: 'All Masterworks' },
    { id: 'frames', label: 'Architectural Frames' },
    { id: 'geometric', label: 'Geometric Reliefs' },
    { id: 'nature', label: 'Botanical & Organic' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  return (
    <section id="masterworks" className="py-24 md:py-32 bg-[#0E0F12] text-[#F4F2EE] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/10 text-[#C5A880] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3">
              <span>The Atelier Catalog</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
              Featured Masterworks.
            </h2>
            <p className="text-xs sm:text-sm text-[#F4F2EE]/70 font-sans mt-2 max-w-xl leading-relaxed">
              Precision nitrogen-cut reliefs and structural frames from solid 3.0mm Belgian alloy. Available in four hand-patinated architectural finishes.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-[2px] text-[10px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white text-black shadow-md font-semibold'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (2 columns on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Bottom Banner with Actions */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-xs text-white/70 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span>All editions include 20mm brass standoff wall fixings & signed certificate.</span>
          </div>

          <div className="flex items-center gap-4">
            {onOpenStudio && (
              <button
                type="button"
                onClick={onOpenStudio}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-[#C5A880] font-semibold transition cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#C5A880]" />
                <span>Custom Dimensions</span>
              </button>
            )}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-white text-[#18181B] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-[2px] transition shadow-md"
            >
              <span>View All 24 Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
