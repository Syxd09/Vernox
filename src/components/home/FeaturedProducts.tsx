import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { products, ProductCategory } from '@/lib/catalog';

export function FeaturedProducts() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ProductCategory>('all');

  // Exact 8 curated products requested by user
  const featuredProductSlugs = [
    'abstract-horizon',
    'golden-silence',
    'sculptural-form',
    'maroon-geometry',
    'contemporary-bloom',
    'minimal-lines',
    'bronze-figure',
    'textured-canvas',
  ];

  const curatedProducts = products.filter(p => featuredProductSlugs.includes(p.slug));

  const filteredProducts = selectedFilter === 'all'
    ? curatedProducts
    : curatedProducts.filter(p => p.category === selectedFilter);

  const filterTabs: Array<{ id: 'all' | ProductCategory; label: string }> = [
    { id: 'all', label: 'All Curations' },
    { id: 'wall-art', label: 'Wall Art' },
    { id: 'sculptures', label: 'Sculptures' },
    { id: 'statement', label: 'Statement Pieces' },
  ];

  return (
    <section className="bg-cream py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="mb-2">
              <span className="text-[10px] uppercase tracking-[0.28em] font-sans text-burgundy font-semibold">
                Original Creations
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-dark-brown font-normal tracking-tight">
              CURATED FOR YOUR SPACE
            </h2>
            <p className="text-xs sm:text-sm text-dark-brown/70 font-sans mt-2 max-w-lg">
              Explore our selection of original paintings, cast bronze sculptures, and relief showpieces.
            </p>
          </div>

          {/* Clean Minimalist Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-sans rounded-[2px] transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-burgundy text-cream font-semibold shadow-xs'
                    : 'bg-white/80 hover:bg-white text-dark-brown/70 hover:text-dark-brown border border-[#EBE4D6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid (2 columns on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-16 pt-10 border-t border-[#EBE4D6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-dark-brown/70 font-sans">
            Every piece is accompanied by a signed Certificate of Authenticity and museum-grade hardware.
          </span>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans font-semibold text-burgundy hover:opacity-80 transition-colors"
          >
            <span>Explore All 38 Works</span>
            <ArrowRight className="w-3.5 h-3.5 text-burgundy transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
