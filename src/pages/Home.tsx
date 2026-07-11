import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Wrench, Truck } from 'lucide-react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { products, categories } from '@/lib/catalog';

export default function Home() {
  const featured = products.filter(p => p.featured);
  const bestsellers = products.filter(p => p.bestseller);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><path d=%22M0 30h60M30 0v60%22 stroke=%22%23222%22 stroke-width=%220.5%22/></svg>')]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-6">Handcrafted · Est. 2019</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">
              Metal art,<br />
              <span className="text-gradient-gold">forged for your wall.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              Laser-cut, hand-finished pieces in brass, copper, and blackened steel.
              Shop our collection or design a one-of-one in the studio.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground font-semibold px-7 py-3 rounded-full hover:shadow-luxe transition-shadow"
              >
                Shop the Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 border border-border hover:border-gold px-7 py-3 rounded-full transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Design Your Own
              </Link>
            </div>
          </div>
          <div className="relative aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-metal rounded-full blur-3xl opacity-30" />
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <ShapeThumb shapeId="starburst" finish="gold" className="w-full h-full drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Wrench, title: 'Made-to-order', body: 'Cut and finished per piece in our workshop.' },
            { icon: Sparkles, title: 'Custom artwork', body: 'Upload your image and preview it live.' },
            { icon: Truck, title: 'Free US shipping', body: 'On orders over $150. Worldwide options available.' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <f.icon className="w-6 h-6 text-gold mt-1" />
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Browse</p>
            <h2 className="font-display text-4xl">Collections</h2>
          </div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-gold">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(c => (
            <Link
              key={c.id}
              to={`/shop/${c.id}`}
              className="group aspect-square rounded-lg border border-border/60 bg-card hover:border-gold/60 hover:bg-card/80 transition-all flex flex-col items-center justify-center gap-3 p-4"
            >
              <div className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity">
                <ShapeThumb shapeId={products.find(p => p.category === c.id)?.shapeId ?? 'circle'} finish="brass" className="w-full h-full" />
              </div>
              <div className="text-sm font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Editor's picks</p>
            <h2 className="font-display text-4xl">Featured pieces</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Loved by many</p>
            <h2 className="font-display text-4xl">Bestsellers</h2>
          </div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-gold">Shop all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Studio CTA */}
      <section className="relative overflow-hidden my-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl bg-gradient-metal p-12 md:p-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Design Studio</p>
                <h2 className="font-display text-4xl md:text-5xl mb-4 text-white">One-of-one, made your way.</h2>
                <p className="text-white/80 mb-8 max-w-md">
                  Pick a shape, choose a metal, upload artwork or a monogram, and see it come to life
                  in a live metallic preview. Order production when you're ready.
                </p>
                <Link
                  to="/customize"
                  className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-7 py-3 rounded-full hover:shadow-luxe"
                >
                  Open Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden md:flex justify-center">
                <ShapeThumb shapeId="shield" finish="gold" className="w-72 h-72 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}