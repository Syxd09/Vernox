import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct, finishLabels } from '@/lib/catalog';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { WallTiltPreview } from '@/components/experience/WallTiltPreview';
import { WallPreview } from '@/components/experience/WallPreview';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { useCart } from '@/lib/cartContext';
import { Check, Sparkles, ShoppingBag, ArrowLeft, Ruler, Flame, Hammer, Wind } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'preview' | 'wall' | 'story';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const navigate = useNavigate();
  const { add } = useCart();
  const [finish, setFinish] = useState(product?.finishes[0] ?? 'brass');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('preview');
  const [studioOpen, setStudioOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="font-display text-2xl">Piece not found.</p>
          <Link to="/shop" className="text-oxblood underline">Back to atelier</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const size = product.sizes[sizeIdx];
  const unitPrice = product.price + size.priceDelta;

  const handleAdd = () => {
    add({
      productId: product.id, productName: product.name, productSlug: product.slug,
      shapeId: product.shapeId, sizeLabel: size.label, widthMm: size.widthMm, heightMm: size.heightMm,
      finish, unitPrice, quantity: qty,
    });
    toast.success(`${product.name} added to your cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-6 py-6 w-full">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-oxblood transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to atelier
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 flex-1 w-full">
        {/* LEFT: preview canvas with tabs */}
        <div className="space-y-4">
          <div className="flex gap-1 p-1 bg-oxblood/5 rounded-full w-fit border border-oxblood/10">
            {([
              { id: 'preview', label: 'Live 3D preview' },
              { id: 'wall', label: 'On your wall' },
              { id: 'story', label: 'The making' },
            ] as { id: Tab; label: string }[]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn('px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition',
                  tab === t.id ? 'bg-oxblood text-ivory shadow-soft' : 'text-oxblood/70 hover:text-oxblood')}>
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {tab === 'preview' && (
                <WallTiltPreview shapeId={product.shapeId} finish={finish} />
              )}
              {tab === 'wall' && (
                <WallPreview shapeId={product.shapeId} finish={finish} widthMm={size.widthMm} heightMm={size.heightMm} />
              )}
              {tab === 'story' && <StoryScroll finish={finish} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: purchase panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.35em] text-oxblood mb-3">{product.tagline}</p>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl text-oxblood-deep">${unitPrice}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">USD · made to order</span>
          </div>
          <p className="text-foreground/75 mb-8 leading-relaxed font-serif-italic text-lg">{product.description}</p>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3 text-oxblood">
              Finish · <span className="text-foreground/70 font-normal normal-case tracking-normal">{finishLabels[finish]?.name}</span>
            </div>
            <div className="flex gap-2">
              {product.finishes.map(f => (
                <button key={f} onClick={() => setFinish(f)} aria-label={finishLabels[f]?.name ?? f}
                  className={cn('w-11 h-11 rounded-full border-2 relative transition-all',
                    finish === f ? 'border-oxblood scale-110 shadow-soft' : 'border-border hover:border-oxblood/50')}
                  style={{ background: finishLabels[f]?.swatch ?? '#333' }}>
                  {finish === f && <Check className="w-4 h-4 text-ivory absolute inset-0 m-auto drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3 text-oxblood">Size</div>
            <div className="grid grid-cols-1 gap-2">
              {product.sizes.map((s, i) => (
                <button key={s.label} onClick={() => setSizeIdx(i)}
                  className={cn('flex justify-between items-center px-4 py-3 rounded-sm border text-sm text-left transition-all',
                    sizeIdx === i ? 'border-oxblood bg-oxblood/5' : 'border-border hover:border-oxblood/40')}>
                  <span className="font-medium flex items-center gap-2"><Ruler className="w-3.5 h-3.5 text-oxblood/70" />{s.label}</span>
                  <span className="text-muted-foreground text-xs">{s.priceDelta > 0 ? `+$${s.priceDelta}` : 'Included'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3 text-oxblood">Quantity</div>
            <div className="inline-flex items-center border border-border rounded-sm">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-oxblood/5 transition">−</button>
              <span className="px-6 py-2 min-w-12 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-oxblood/5 transition">+</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleAdd}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-oxblood text-ivory font-medium tracking-wide px-6 py-4 rounded-full hover:bg-oxblood-deep hover:shadow-luxe transition">
              <ShoppingBag className="w-4 h-4" /> Add to cart · ${unitPrice * qty}
            </button>
            {product.customizable && (
              <button onClick={() => setStudioOpen(true)}
                className="inline-flex items-center justify-center gap-2 border-2 border-oxblood text-oxblood hover:bg-oxblood hover:text-ivory px-6 py-4 rounded-full transition">
                <Sparkles className="w-4 h-4" /> Open Studio
              </button>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-oxblood/15 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            {[
              { icon: Hammer, label: 'Material', v: '3mm laser-cut steel' },
              { icon: Flame, label: 'Lead time', v: '7–10 business days' },
              { icon: Wind, label: 'Hardware', v: 'Concealed float mount' },
              { icon: Ruler, label: 'Returns', v: '30 days on stock items' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2.5">
                <f.icon className="w-4 h-4 text-oxblood mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</div>
                  <div className="text-foreground">{f.v}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <InlineStudio
        open={studioOpen}
        onOpenChange={setStudioOpen}
        initialShapeId={product.shapeId}
        initialWidthMm={size.widthMm}
        initialHeightMm={size.heightMm}
        initialFinish={finish}
        productName={product.name}
      />

      <SiteFooter />
    </div>
  );
}

function StoryScroll({ finish }: { finish: string }) {
  const chapters = [
    { n: '01', title: 'Sourced sheet', body: 'A 3mm sheet of Belgian steel is trimmed to blank in our Antwerp workshop, weighed, and paired with an order card.' },
    { n: '02', title: 'Cut by fibre laser', body: 'Two minutes of focused light. The blank leaves the bed with an edge you can read a paragraph off — no burrs, no dross.' },
    { n: '03', title: 'Hand-finished', body: `Sanded, brushed, and finished in ${finish}. Each piece signed on the reverse by the maker.` },
    { n: '04', title: 'Yours in ten days', body: 'Packed in wool felt, shipped with concealed hardware. Hang it. Live with it.' },
  ];
  return (
    <div className="space-y-6">
      {chapters.map((c, i) => (
        <motion.div key={c.n}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          className="relative pl-16 py-4 border-l-2 border-oxblood/20">
          <span className="absolute left-0 -translate-x-1/2 top-4 w-10 h-10 rounded-full bg-ivory border-2 border-oxblood flex items-center justify-center font-display text-oxblood text-sm">{c.n}</span>
          <h3 className="font-display text-2xl text-oxblood-deep mb-2">{c.title}</h3>
          <p className="text-foreground/70 leading-relaxed">{c.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
