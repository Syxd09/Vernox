import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCatalog } from '@/lib/catalogContext';
import { ProductCategory } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Search, SlidersHorizontal, X, Sparkles, Shield, Hammer, Award } from 'lucide-react';

export default function Shop() {
  const { products, categories, storeConfig } = useCatalog();
  const { category } = useParams<{ category?: string }>();
  
  const maxCatalogPrice = useMemo(() => {
    const highest = Math.max(...products.map(p => p.price), 350);
    return Math.ceil(highest / 50) * 50;
  }, [products]);

  // Filtering & Sorting States
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'bestsellers' | 'new'>('featured');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(maxCatalogPrice);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const activeCategory = categories.find(c => c.id === (category as ProductCategory));
  
  // Available finishes for filtering
  const availableFinishes = [
    { id: 'gold', label: 'Warm Gold', swatch: 'linear-gradient(135deg, #ECC880, #B48834)' },
    { id: 'brass', label: 'Antique Brass', swatch: 'linear-gradient(135deg, #C5A880, #8A6E46)' },
    { id: 'steel', label: 'Blackened Steel', swatch: 'linear-gradient(135deg, #4A4A4F, #222226)' },
    { id: 'copper', label: 'Aged Copper', swatch: 'linear-gradient(135deg, #D48464, #8F4932)' },
    { id: 'stainless', label: 'Stainless Plate', swatch: 'linear-gradient(135deg, #E2E4E8, #A0A5AE)' },
    { id: 'corten', label: 'Weathered Corten', swatch: 'linear-gradient(135deg, #B55229, #6B2912)' },
  ];

  const handleFinishToggle = (f: string) => {
    setSelectedFinishes(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setMaxPrice(maxCatalogPrice);
    setSelectedFinishes([]);
  };

  const activeFiltersCount = (search.trim() ? 1 : 0) + 
    (maxPrice < maxCatalogPrice ? 1 : 0) + 
    selectedFinishes.length;

  // Filtered & sorted products list
  const filteredList = useMemo(() => {
    let l = category ? products.filter(p => p.category === category) : products;
    
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      l = l.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.tagline.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.alloySpec && p.alloySpec.toLowerCase().includes(q))
      );
    }

    // Price filter
    l = l.filter(p => p.price <= maxPrice);

    // Finishes filter
    if (selectedFinishes.length > 0) {
      l = l.filter(p => p.finishes.some(f => selectedFinishes.includes(f)));
    }

    // Sort options
    const sorted = [...l];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'bestsellers') sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    else if (sort === 'new') sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sort === 'featured') sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return sorted;
  }, [category, search, maxPrice, selectedFinishes, sort, products]);

  const getSortLabel = (s: typeof sort) => {
    switch (s) {
      case 'featured': return 'Featured Creations';
      case 'price-asc': return 'Price · Low to High';
      case 'price-desc': return 'Price · High to Low';
      case 'bestsellers': return 'Curator Bestsellers';
      case 'new': return 'New Arrivals';
      default: return 'Featured Creations';
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA]">
      <SiteHeader />
      
      {/* Editorial Hero Header */}
      <section className="border-b border-[#EBE4D6] bg-gradient-to-b from-[#F5EFE4] to-[#F8F3EA] pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans text-[#6B2732] font-semibold mb-3">
              <span className="w-6 h-[1.5px] bg-[#C6A15B]" />
              <span>{activeCategory ? 'Curated Collection' : 'Permanent Atelier Catalog'}</span>
            </div>
            
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#332522] tracking-tight leading-[1.05] font-normal mb-4">
              {activeCategory ? activeCategory.name.toUpperCase() : 'WORKS OF ART & SCULPTURES'}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-[15px] text-[#332522]/75 font-sans leading-relaxed max-w-2xl">
              {activeCategory
                ? activeCategory.description
                : 'A curated dialogue of original canvas compositions, heavy bronze castings, tactile mineral reliefs, and precision-cut metal wall sculptures for refined modern interiors.'}
            </p>
          </div>

          {/* Clean Category Tabs / Horizontal Filter Navigation */}
          <div className="mt-10 sm:mt-12 pt-6 border-t border-[#EBE4D6] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Link
              to="/shop"
              className={cn(
                'px-4 py-2 rounded-[2px] text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-2',
                !category
                  ? 'bg-maroon-deep text-cream font-semibold shadow-xs'
                  : 'bg-white/80 hover:bg-white text-[#332522]/80 hover:text-[#332522] border border-[#EBE4D6]'
              )}
            >
              <span>All Works</span>
              <span className={cn('text-[9px] font-mono px-1.5 py-0.2 rounded-full', !category ? 'bg-white/20 text-cream' : 'bg-[#EBE4D6]/60 text-[#332522]/60')}>
                {categoryCounts.all || products.length}
              </span>
            </Link>

            {categories.map(c => {
              const isActive = category === c.id;
              const count = categoryCounts[c.id] || 0;
              return (
                <Link
                  key={c.id}
                  to={`/shop/${c.id}`}
                  className={cn(
                    'px-4 py-2 rounded-[2px] text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-2',
                    isActive
                      ? 'bg-maroon-deep text-cream font-semibold shadow-xs'
                      : 'bg-white/80 hover:bg-white text-[#332522]/80 hover:text-[#332522] border border-[#EBE4D6]'
                  )}
                >
                  <span>{c.name}</span>
                  <span className={cn('text-[9px] font-mono px-1.5 py-0.2 rounded-full', isActive ? 'bg-white/20 text-cream' : 'bg-[#EBE4D6]/60 text-[#332522]/60')}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        
        {/* Top Control Bar: Search, Filters Toggle, Items Count, and Sort Dropdown */}
        <div className="bg-white border border-[#EBE4D6] rounded-[2px] p-3 sm:p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          
          {/* Left: Search & Filter Toggle */}
          <div className="flex items-center flex-wrap gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[260px] flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search artwork, medium, motif..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] pl-9 pr-8 py-2 text-xs text-[#332522] placeholder:text-[#332522]/40 outline-none focus:border-[#6B2732] focus:bg-white transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#332522]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#332522]/40 hover:text-[#332522] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFilterPanelOpen(prev => !prev)}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] text-xs uppercase tracking-[0.16em] font-sans font-medium transition-colors border cursor-pointer',
                filterPanelOpen || activeFiltersCount > 0
                  ? 'border-[#6B2732] bg-[#6B2732]/5 text-[#6B2732]'
                  : 'border-[#EBE4D6] bg-[#FAF8F5] text-[#332522] hover:bg-white'
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Refine</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6B2732] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear All Link if filters active */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#6B2732] hover:text-[#6B2732] underline cursor-pointer ml-1"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Right: Works count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EBE4D6]">
            <span className="text-xs text-[#332522]/60 font-sans">
              Showing <strong className="text-[#332522] font-semibold">{filteredList.length}</strong> works
            </span>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="bg-[#FAF8F5] hover:bg-white border border-[#EBE4D6] rounded-[2px] px-3.5 py-2 flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-sans font-medium text-[#332522] cursor-pointer transition-colors"
              >
                <span className="text-[#332522]/60 text-[10px]">Sort:</span>
                <span>{getSortLabel(sort)}</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-[#C6A15B] transition-transform duration-200',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#EBE4D6] rounded-[2px] shadow-lg z-30 w-52 overflow-hidden py-1">
                    {(['featured', 'bestsellers', 'new', 'price-asc', 'price-desc'] as const).map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSort(option);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] font-sans transition-colors flex items-center justify-between cursor-pointer',
                          sort === option
                            ? 'bg-[#6B2732] text-white font-semibold'
                            : 'text-[#332522] hover:bg-[#F8F3EA]'
                        )}
                      >
                        <span>{getSortLabel(option)}</span>
                        {sort === option && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Refine Panel */}
        {filterPanelOpen && (
          <div className="bg-white border border-[#EBE4D6] rounded-[2px] p-6 mb-8 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#EBE4D6] pb-3 mb-5">
              <h3 className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#332522] flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Refine by Specification & Price</span>
              </h3>
              <button
                type="button"
                onClick={() => setFilterPanelOpen(false)}
                className="text-xs text-[#332522]/60 hover:text-[#332522] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Finishes & Materials */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.24em] font-sans font-semibold text-[#6B2732] block mb-3">
                  Material Finish & Patina
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFinishes.map(f => {
                    const isChecked = selectedFinishes.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleFinishToggle(f.id)}
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-xs font-sans transition-all cursor-pointer border',
                          isChecked
                            ? 'bg-[#6B2732] text-white border-[#6B2732] font-semibold shadow-xs'
                            : 'bg-[#FAF8F5] text-[#332522] border-[#EBE4D6] hover:bg-white'
                        )}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ background: f.swatch }}
                        />
                        <span>{f.label}</span>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Ceiling */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase tracking-[0.24em] font-sans font-semibold text-[#6B2732]">
                    Maximum Investment
                  </label>
                  <span className="font-mono text-sm font-semibold text-[#332522]">
                    ${maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={maxCatalogPrice}
                  step={10}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#6B2732] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#332522]/50 font-mono mt-1">
                  <span>$100</span>
                  <span>${maxCatalogPrice}</span>
                </div>

                {/* Quick Price Shortcuts */}
                <div className="flex gap-2 mt-3">
                  {[200, 300, maxCatalogPrice].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMaxPrice(val)}
                      className={cn(
                        'px-2.5 py-1 text-[10px] font-sans rounded-[1px] border cursor-pointer transition-colors',
                        maxPrice === val
                          ? 'border-[#6B2732] bg-[#6B2732]/10 text-[#6B2732] font-semibold'
                          : 'border-[#EBE4D6] bg-white text-[#332522]/70 hover:text-[#332522]'
                      )}
                    >
                      {val === maxCatalogPrice ? 'All Prices' : `Under $${val}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white border border-[#EBE4D6] rounded-[2px] max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#C6A15B] mx-auto mb-3 opacity-80" />
            <h3 className="font-editorial text-2xl text-[#332522] font-normal mb-2">
              No Pieces Match Your Current Selection
            </h3>
            <p className="text-xs text-[#332522]/70 font-sans mb-6 leading-relaxed">
              We couldn't find any artwork matching your active search keywords or filter criteria.
            </p>
            <button 
              type="button"
              onClick={clearFilters}
              className="bg-maroon-deep hover:opacity-90 text-cream px-6 py-2.5 rounded-[2px] text-xs uppercase tracking-[0.2em] font-sans font-semibold transition cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredList.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Bottom Editorial Atelier Callout */}
        <div className="mt-20 pt-12 border-t border-[#EBE4D6]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex items-start gap-3.5">
              <Hammer className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#332522] mb-1">
                  Solid Metallurgical Precision
                </h4>
                <p className="text-xs text-[#332522]/70 font-sans leading-relaxed">
                  Every work is crafted in 3.0mm Belgian alloy plate or cast noble bronze, hand-patinated in our Antwerp workshop.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Award className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#332522] mb-1">
                  Signed & Authenticated
                </h4>
                <p className="text-xs text-[#332522]/70 font-sans leading-relaxed">
                  Numbered hallmark seal, signed certificate of authenticity, and museum-grade concealed hanging standoffs included.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Shield className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#332522] mb-1">
                  Architect & Trade Inquiries
                </h4>
                <p className="text-xs text-[#332522]/70 font-sans leading-relaxed">
                  Custom scale commissions, 3D CAD models, DXF vector files, and trade trade tier terms available upon request.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>
      
      <SiteFooter />
    </div>
  );
}