import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCatalog } from '@/lib/catalogContext';
import { ProductCategory } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Search, SlidersHorizontal, X } from 'lucide-react';

export default function Shop() {
  const { products, categories, storeConfig } = useCatalog();
  const { category } = useParams<{ category?: string }>();
  
  // Filtering & Sorting States
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'bestsellers' | 'new'>('featured');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const active = categories.find(c => c.id === (category as ProductCategory));
  
  // Available finishes for filtering
  const availableFinishes = ['steel', 'stainless', 'brass', 'copper', 'gold', 'corten'];
  const finishLabels: Record<string, string> = {
    steel: 'Blackened Steel',
    stainless: 'Brushed Stainless',
    brass: 'Antique Brass',
    copper: 'Aged Copper',
    gold: 'Warm Gold',
    corten: 'Corten Patina'
  };

  const handleFinishToggle = (f: string) => {
    setSelectedFinishes(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setMaxPrice(300);
    setSelectedFinishes([]);
  };

  const list = useMemo(() => {
    let l = category ? products.filter(p => p.category === category) : products;
    
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      l = l.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.tagline.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
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
      case 'featured': return 'Featured';
      case 'price-asc': return 'Price · Low to High';
      case 'price-desc': return 'Price · High to Low';
      case 'bestsellers': return 'Bestsellers';
      case 'new': return 'New Arrivals';
      default: return 'Featured';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      {/* Shop Banner */}
      <section className="border-b border-border/60 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-brass mb-2.5 font-semibold">{active ? 'Collection' : 'Full catalog'}</p>
          <h1 className="font-display text-4xl sm:text-5xl mb-2.5 text-oxblood-deep">{active ? active.name : 'The Shop'}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {active ? active.description : 'Every piece is cut, finished, and inspected in-house in our Antwerp workshop before it ships.'}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid lg:grid-cols-[260px_1fr] gap-8">
        
        {/* SIDEBAR: Filters (Desktop View) */}
        <aside className="hidden lg:block space-y-6 border-r border-border/40 pr-6 h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-oxblood-deep flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brass" /> Filter Options
            </h3>
            {(search || maxPrice < 300 || selectedFinishes.length > 0) && (
              <button 
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-widest text-destructive hover:underline font-bold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Search Collection</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Artwork name, motif, finish..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-card border border-border/80 rounded-sm pl-3 pr-8 py-2 text-xs outline-none focus:border-oxblood"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Price Range Limit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              <span>Max Price</span>
              <span className="font-mono text-oxblood font-bold">{storeConfig.currency}{maxPrice}</span>
            </div>
            <input
              type="range"
              min={50}
              max={300}
              step={10}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-oxblood"
            />
            <div className="flex justify-between text-[8px] text-muted-foreground font-mono">
              <span>{storeConfig.currency}50</span>
              <span>{storeConfig.currency}300</span>
            </div>
          </div>

          {/* Finishes Checkbox Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block">Metal Finish</label>
            <div className="space-y-1.5">
              {availableFinishes.map(f => {
                const isChecked = selectedFinishes.includes(f);
                return (
                  <label key={f} className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer select-none hover:text-oxblood font-medium">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleFinishToggle(f)}
                      className="rounded border-border text-oxblood focus:ring-oxblood w-3.5 h-3.5"
                    />
                    <span>{finishLabels[f]}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Sort/Categories Bar + Products List */}
        <div className="space-y-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
            
            {/* Category Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/shop" className={cn('px-4 py-2 rounded-sm border text-[10px] uppercase tracking-widest transition-colors font-semibold',
                !category ? 'bg-oxblood text-ivory border-oxblood shadow-soft' : 'border-border/80 bg-card text-muted-foreground hover:border-oxblood/50 hover:text-foreground')}>
                All Artworks
              </Link>
              {categories.map(c => (
                <Link key={c.id} to={`/shop/${c.id}`} className={cn('px-4 py-2 rounded-sm border text-[10px] uppercase tracking-widest transition-colors font-semibold',
                  category === c.id ? 'bg-oxblood text-ivory border-oxblood shadow-soft' : 'border-border/80 bg-card text-muted-foreground hover:border-oxblood/50 hover:text-foreground')}>
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Mobile Filters Toggle & Sort Options */}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(prev => !prev)}
                className="lg:hidden flex items-center gap-1.5 bg-card border border-border rounded px-3 py-2 text-[10px] uppercase tracking-widest font-semibold hover:border-oxblood text-oxblood-deep"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 text-xs relative">
                <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold">Sort</span>
                <button 
                  type="button"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="bg-card border border-border rounded px-3.5 py-2 flex items-center gap-2 hover:border-oxblood/40 hover:shadow-soft transition text-[10px] uppercase tracking-wider font-semibold text-oxblood-deep"
                >
                  <span>{getSortLabel(sort)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brass transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 bg-card border border-border rounded shadow-luxe z-20 w-48 overflow-hidden animate-fade-in noise-overlay">
                      {(['featured', 'price-asc', 'price-desc', 'bestsellers', 'new'] as const).map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSort(option);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-between",
                            sort === option 
                              ? "bg-oxblood text-ivory" 
                              : "text-foreground/80 hover:bg-muted hover:text-oxblood"
                          )}
                        >
                          {getSortLabel(option)}
                          {sort === option && <Check className="w-3 h-3 text-ivory" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE FILTERS COLLAPSIBLE PANEL */}
          {mobileFiltersOpen && (
            <div className="lg:hidden bg-card border border-border rounded-md p-5 space-y-5 noise-overlay shadow-soft animate-fade-in">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-oxblood-deep">Mobile Filters</h4>
                <div className="flex items-center gap-3">
                  {(search || maxPrice < 300 || selectedFinishes.length > 0) && (
                    <button onClick={clearFilters} className="text-[9px] uppercase tracking-widest text-destructive font-bold underline">
                      Clear All
                    </button>
                  )}
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Search Sign</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Keyword..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-background border border-border rounded pl-3 pr-8 py-2 text-xs outline-none"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                  <span>Max Price</span>
                  <span className="font-mono text-oxblood font-bold">{storeConfig.currency}{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={300}
                  step={10}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-oxblood"
                />
              </div>

              {/* Mobile Finishes */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold block">Metal Finish</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableFinishes.map(f => {
                    const isChecked = selectedFinishes.includes(f);
                    return (
                      <label key={f} className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer select-none hover:text-oxblood font-medium">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFinishToggle(f)}
                          className="rounded border-border text-oxblood w-3.5 h-3.5"
                        />
                        <span>{finishLabels[f]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {list.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border/80 rounded bg-card/25 noise-overlay">
              <p className="text-muted-foreground font-serif italic text-sm">No metal signs matched your search filters.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 bg-oxblood text-ivory px-5 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-oxblood-deep transition font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {list.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}