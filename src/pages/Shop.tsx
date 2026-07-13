import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { products, categories, ProductCategory } from '@/lib/catalog';
import { cn } from '@/lib/utils';

export default function Shop() {
  const { category } = useParams<{ category?: string }>();
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const active = categories.find(c => c.id === (category as ProductCategory));
  const list = useMemo(() => {
    let l = category ? products.filter(p => p.category === category) : products;
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [category, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="border-b border-border/60 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-brass mb-3">{active ? 'Collection' : 'Full catalog'}</p>
          <h1 className="font-display text-5xl mb-3">{active ? active.name : 'The Shop'}</h1>
          <p className="text-muted-foreground max-w-2xl">
            {active ? active.description : 'Every piece is cut, finished, and inspected in-house before it ships.'}
          </p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Link to="/shop" className={cn('px-4 py-1.5 text-xs uppercase tracking-widest rounded-full border transition-colors',
            !category ? 'bg-oxblood text-primary-foreground border-oxblood' : 'border-border hover:border-oxblood')}>All</Link>
          {categories.map(c => (
            <Link key={c.id} to={`/shop/${c.id}`} className={cn('px-4 py-1.5 text-xs uppercase tracking-widest rounded-full border transition-colors',
              category === c.id ? 'bg-oxblood text-primary-foreground border-oxblood' : 'border-border hover:border-oxblood')}>{c.name}</Link>
          ))}
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="featured">Featured</option>
              <option value="price-asc">Price · Low to High</option>
              <option value="price-desc">Price · High to Low</option>
            </select>
          </div>
        </div>
        {list.length === 0 ? (
          <p className="text-muted-foreground text-center py-24">Nothing here yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}