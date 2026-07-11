import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getProduct, finishLabels } from '@/lib/catalog';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { useCart } from '@/lib/cartContext';
import { Check, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const navigate = useNavigate();
  const { add } = useCart();
  const [finish, setFinish] = useState(product?.finishes[0] ?? 'brass');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p>Product not found.</p>
          <Link to="/shop" className="text-gold">Back to shop</Link>
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
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-6 py-6 w-full">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-12 flex-1">
        <div className="relative aspect-square bg-gradient-to-br from-background via-card to-black rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.2),transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <ShapeThumb shapeId={product.shapeId} finish={finish} className="w-full h-full" />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">{product.tagline}</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-medium">${unitPrice}</span>
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
          <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>
          <div className="mb-8">
            <div className="text-sm font-medium uppercase tracking-wider mb-3">
              Finish · <span className="text-muted-foreground normal-case tracking-normal">{finishLabels[finish]?.name}</span>
            </div>
            <div className="flex gap-2">
              {product.finishes.map(f => (
                <button key={f} onClick={() => setFinish(f)} aria-label={finishLabels[f]?.name ?? f}
                  className={cn('w-12 h-12 rounded-full border-2 relative transition-all',
                    finish === f ? 'border-gold scale-110' : 'border-border hover:border-muted-foreground')}
                  style={{ background: finishLabels[f]?.swatch ?? '#333' }}>
                  {finish === f && <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <div className="text-sm font-medium uppercase tracking-wider mb-3">Size</div>
            <div className="grid grid-cols-1 gap-2">
              {product.sizes.map((s, i) => (
                <button key={s.label} onClick={() => setSizeIdx(i)}
                  className={cn('flex justify-between items-center px-4 py-3 rounded-md border text-sm text-left transition-colors',
                    sizeIdx === i ? 'border-gold bg-gold/5' : 'border-border hover:border-muted-foreground')}>
                  <span>{s.label}</span>
                  <span className="text-muted-foreground">{s.priceDelta > 0 ? `+$${s.priceDelta}` : 'Included'}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <div className="text-sm font-medium uppercase tracking-wider mb-3">Quantity</div>
            <div className="inline-flex items-center border border-border rounded-md">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-muted">−</button>
              <span className="px-6 py-2 min-w-12 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-muted">+</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleAdd}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground font-semibold px-6 py-4 rounded-full hover:shadow-luxe transition-shadow">
              <ShoppingBag className="w-4 h-4" /> Add to Cart · ${unitPrice * qty}
            </button>
            {product.customizable && (
              <Link to="/customize" className="inline-flex items-center justify-center gap-2 border border-border hover:border-gold px-6 py-4 rounded-full">
                <Sparkles className="w-4 h-4" /> Customize
              </Link>
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-border/60 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div><span className="text-foreground font-medium block">Material</span> 3mm laser-cut steel</div>
            <div><span className="text-foreground font-medium block">Lead time</span> 7–10 business days</div>
            <div><span className="text-foreground font-medium block">Hardware</span> Concealed mount included</div>
            <div><span className="text-foreground font-medium block">Returns</span> 30 days on stock items</div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}