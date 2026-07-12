import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Sparkles, Flame, Hammer, Compass } from 'lucide-react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { products, categories } from '@/lib/catalog';

export default function Home() {
  const featured = products.filter(p => p.featured);
  const bestsellers = products.filter(p => p.bestseller);
  const [studioOpen, setStudioOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader onOpenStudio={() => setStudioOpen(true)} />

      {/* HERO — editorial ivory */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-oxblood/8 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="divider-serif mb-8 max-w-xs">
              <span className="text-xs uppercase tracking-[0.4em] text-oxblood">Antwerp Atelier · Est. 2019</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-8xl leading-[0.9] mb-6 text-oxblood-deep">
              Metal, <span className="font-serif-italic text-gradient-brass">quietly</span><br />
              held on the wall.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="text-lg md:text-xl text-foreground/70 max-w-lg mb-10 leading-relaxed">
              Wall pieces cut from Belgian steel, finished by hand in oxblood-patinated
              brass and warm copper. Ready-made, or shape one that is entirely yours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="flex flex-wrap gap-4">
              <Link to="/shop"
                className="group inline-flex items-center gap-3 bg-oxblood text-ivory font-medium tracking-wide px-8 py-4 rounded-full hover:bg-oxblood-deep hover:shadow-luxe transition">
                Enter the atelier
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button onClick={() => setStudioOpen(true)}
                className="group inline-flex items-center gap-3 border-2 border-oxblood text-oxblood px-8 py-4 rounded-full hover:bg-oxblood hover:text-ivory transition">
                <Sparkles className="w-4 h-4" /> Open design studio
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-12 flex items-center gap-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span>★★★★★ 4.9</span>
              <span className="w-px h-4 bg-oxblood/30" />
              <span>2,340 pieces shipped</span>
            </motion.div>
          </div>

          {/* Hero object — floating starburst with animated glare */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square max-w-xl mx-auto">
            <div className="absolute inset-8 bg-gradient-metal rounded-full blur-3xl opacity-30" />
            <div className="absolute inset-0 border border-oxblood/10 rounded-full" />
            <div className="absolute inset-8 border border-oxblood/20 rounded-full" />
            <motion.div
              animate={{ rotate: [0, 3, 0, -3, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full h-full flex items-center justify-center p-12">
              <ShapeThumb shapeId="starburst" finish="brass" className="w-full h-full drop-shadow-[0_40px_60px_rgba(107,30,40,0.35)]" />
            </motion.div>
            <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.3em] text-oxblood/60 font-serif-italic">
              n° 042 · Compass Rose
            </div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO STRIP */}
      <section className="border-y border-oxblood/15 bg-ivory-warm/40">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Hammer, title: 'Cut in Antwerp', body: 'Every piece leaves one workshop, signed on the reverse.' },
            { icon: Compass, title: 'Yours, precisely', body: 'Change a millimetre, a metal, a monogram — live, in-browser.' },
            { icon: Flame, title: 'Ten-day lead', body: 'From raw sheet to your wall in under a fortnight.' },
          ].map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full border border-oxblood/30 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-oxblood" />
              </div>
              <div>
                <div className="font-display text-xl mb-0.5">{f.title}</div>
                <div className="text-sm text-foreground/60">{f.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-oxblood mb-3">Browse</p>
            <h2 className="font-display text-5xl md:text-6xl text-oxblood-deep">The <span className="font-serif-italic">collections</span></h2>
          </div>
          <Link to="/shop" className="text-sm uppercase tracking-widest text-oxblood hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
              <Link to={`/shop/${c.id}`}
                className="group aspect-square rounded-sm border border-oxblood/15 bg-card hover:border-oxblood/50 hover:shadow-soft transition-all flex flex-col items-center justify-center gap-3 p-4">
                <div className="w-16 h-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <ShapeThumb shapeId={products.find(p => p.category === c.id)?.shapeId ?? 'circle'} finish="brass" className="w-full h-full" />
                </div>
                <div className="text-sm font-display tracking-wide">{c.name}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-oxblood mb-3">Editor's picks</p>
          <h2 className="font-display text-5xl md:text-6xl text-oxblood-deep">Featured <span className="font-serif-italic">pieces</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ATELIER STORYTELLING */}
      <section className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <p className="text-xs uppercase tracking-[0.35em] text-oxblood mb-4">The atelier</p>
            <h2 className="font-display text-5xl md:text-6xl leading-tight mb-6">
              A workshop the size <br /> of a <span className="font-serif-italic text-gradient-brass">painter's studio.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-6 text-lg">
              We're four makers, one fibre laser, and a rack of Belgian sheet steel.
              No factory. No middlemen. Every piece passes through the same three pairs
              of hands before it leaves us.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-8 font-serif-italic text-lg">
              "Slower is finer. Fewer, better, kept."
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-oxblood underline underline-offset-4 hover:no-underline">
              Read our story <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { shape: 'octagon', finish: 'brass', delay: 0 },
              { shape: 'shield', finish: 'copper', delay: 0.1 },
              { shape: 'hexagon', finish: 'gold', delay: 0.2 },
              { shape: 'starburst', finish: 'brass', delay: 0.3 },
            ].map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: t.delay }}
                className={`aspect-square rounded-sm bg-gradient-to-br from-ivory to-ivory-warm border border-oxblood/15 p-6 shadow-soft ${i % 2 === 0 ? 'lg:translate-y-8' : ''}`}>
                <ShapeThumb shapeId={t.shape} finish={t.finish} className="w-full h-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-6 py-10 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-oxblood mb-3">Loved by many</p>
            <h2 className="font-display text-5xl md:text-6xl text-oxblood-deep">Bestsellers</h2>
          </div>
          <Link to="/shop" className="text-sm uppercase tracking-widest text-oxblood hover:underline">Shop all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* STUDIO CTA — oxblood block */}
      <section className="relative overflow-hidden my-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="relative rounded-sm bg-oxblood-deep p-12 md:p-20 overflow-hidden noise-overlay">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-brass rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-oxblood rounded-full blur-3xl opacity-40" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brass mb-5">Design Studio</p>
                <h2 className="font-display text-5xl md:text-6xl mb-6 text-ivory leading-[1] ">
                  A piece <span className="font-serif-italic text-gradient-brass">only you</span><br /> will own.
                </h2>
                <p className="text-ivory/70 mb-10 max-w-md text-lg leading-relaxed">
                  Choose a shape, dial in the millimetres, layer your artwork,
                  and see the finished piece come alive in metal — right here, right now.
                </p>
                <button onClick={() => setStudioOpen(true)}
                  className="inline-flex items-center gap-3 bg-brass text-oxblood-deep font-medium tracking-wide px-8 py-4 rounded-full hover:bg-ivory hover:shadow-brass transition">
                  Enter the studio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="hidden md:flex justify-center">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                  <ShapeThumb shapeId="shield" finish="brass" className="w-80 h-80 drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />
      <SiteFooter />
    </div>
  );
}
