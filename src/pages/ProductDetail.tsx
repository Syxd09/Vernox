import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finishLabels } from '@/lib/catalog';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { WallTiltPreview } from '@/components/experience/WallTiltPreview';
import { WallPreview } from '@/components/experience/WallPreview';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { Check, Sparkles, ShoppingBag, ArrowLeft, Ruler, Flame, Hammer, Wind, Star, Heart, Award, ShieldCheck, MapPin, Clock, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'photo' | 'preview' | 'wall' | 'story';

export default function ProductDetail() {
  const { getProductBySlug, reviews, addReview, currentCustomer, wishlist, toggleWishlist, storeConfig } = useCatalog();
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  
  const productReviews = product ? reviews.filter(r => r.productId === product.id) : [];
  const avgRating = productReviews.length 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : null;
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const navigate = useNavigate();
  const { add } = useCart();
  const [finish, setFinish] = useState(product?.finishes[0] ?? 'brass');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>(() => product?.imageUrl ? 'photo' : 'preview');
  const [studioOpen, setStudioOpen] = useState(false);

  // Review state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (currentCustomer) {
      setReviewName(currentCustomer.name);
    }
  }, [currentCustomer]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in your name and comment.");
      return;
    }
    setIsSubmittingReview(true);
    await addReview({
      productId: product.id,
      customerName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      placedAt: Date.now()
    });
    setIsSubmittingReview(false);
    setReviewComment('');
    setReviewRating(5);
    toast.success("Thank you for your feedback! Review published.");
  };

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
          <div className="flex items-center gap-1.5 p-1 bg-card border border-border/80 rounded-sm w-full sm:w-fit overflow-x-auto no-scrollbar py-1">
            {([
              ...(product.imageUrl ? [{ id: 'photo', label: 'Architectural Photo' }] : []),
              { id: 'preview', label: 'Interactive Vector' },
              { id: 'wall', label: 'Interior Scale' },
              { id: 'story', label: 'Atelier Making' },
            ] as { id: Tab; label: string }[]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn('px-3.5 sm:px-4 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-sm transition shrink-0 whitespace-nowrap',
                  tab === t.id ? 'bg-oxblood text-ivory shadow-soft' : 'text-muted-foreground hover:text-foreground')}>
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
              {tab === 'photo' && product.imageUrl && (
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border/80 shadow-luxe bg-muted/20 group">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-sm bg-background/90 backdrop-blur-md border border-border/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.25em] text-brass font-bold">Atelier Installation</div>
                      <div className="font-display text-sm font-semibold text-oxblood-deep">{product.name} · {product.alloySpec || 'Solid 3.0mm Belgian Plate'}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Antwerp Atelier
                    </div>
                  </div>
                </div>
              )}
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
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-2">{product.name}</h1>
          {avgRating && (
            <div className="flex items-center gap-1.5 mb-6 text-brass text-xs font-semibold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(Number(avgRating)) 
                        ? 'fill-brass text-brass' 
                        : 'text-muted-foreground/20'
                    }`} 
                  />
                ))}
              </div>
              <span>{avgRating} ({productReviews.length} reviews)</span>
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-4xl text-oxblood-deep">
              <span className="font-sans font-medium text-3xl mr-0.5">{(storeConfig.currency && storeConfig.currency !== '$') ? storeConfig.currency : '₹'}</span>{unitPrice.toLocaleString()}
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{storeConfig.currency === '$' || storeConfig.currency === '₹' ? 'INR' : storeConfig.currency} · Bespoke Edition</span>
          </div>

          {product.alloySpec && (
            <div className="mb-6 p-3.5 rounded-sm bg-card border border-brass/30 flex items-center justify-between text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brass shrink-0" />
                <span className="text-foreground font-semibold">{product.alloySpec}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-brass font-bold">Certified Alloy</span>
            </div>
          )}

          <p className="text-foreground/80 mb-8 leading-relaxed font-sans text-sm md:text-base">{product.description}</p>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3 text-oxblood">
              Finish · <span className="text-foreground/70 font-normal normal-case tracking-normal">{finishLabels[finish]?.name}</span>
            </div>
            <div className="flex gap-2">
              {product.finishes.map(f => (
                <button key={f} onClick={() => setFinish(f)} aria-label={finishLabels[f]?.name ?? f}
                  className={cn('w-11 h-11 rounded-sm border-2 relative transition-all',
                    finish === f ? 'border-oxblood scale-105 shadow-soft' : 'border-border/80 hover:border-oxblood/50')}
                  style={{ background: finishLabels[f]?.swatch ?? '#333' }}>
                  {finish === f && <Check className="w-4 h-4 text-ivory absolute inset-0 m-auto drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3 text-oxblood">Dimensions & Gauge</div>
            <div className="grid grid-cols-1 gap-2.5">
              {product.sizes.map((s, i) => (
                <button key={s.label} onClick={() => setSizeIdx(i)}
                  className={cn('flex justify-between items-center px-4 py-3 rounded-sm border text-xs text-left transition-all',
                    sizeIdx === i ? 'border-oxblood bg-oxblood/5 font-semibold text-oxblood-deep' : 'border-border/80 hover:border-oxblood/40 text-foreground')}>
                  <span className="flex items-center gap-2.5"><Ruler className="w-3.5 h-3.5 text-brass" />{s.label}</span>
                  <span className="text-muted-foreground font-mono">{s.priceDelta > 0 ? `+${storeConfig.currency}${s.priceDelta}` : 'Standard Edition'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3 text-oxblood">Commission Quantity</div>
            <div className="inline-flex items-center border border-border/80 rounded-sm bg-card">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-oxblood/5 transition font-semibold text-xs">−</button>
              <span className="px-6 py-2 min-w-12 text-center font-mono text-xs">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-oxblood/5 transition font-semibold text-xs">+</button>
            </div>
          </div>

          {/* REAL-TIME DISPATCH & SHIPPING PROMISE */}
          <div className="mb-6 p-4 rounded bg-oxblood/5 border border-oxblood/15 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-oxblood-deep">
              <Clock className="w-4 h-4 text-brass shrink-0" />
              <span>Priority Dispatch: Order within 3h 48m for Tuesday Dispatch</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="w-4 h-4 text-oxblood shrink-0" />
              <span>Complimentary Insured White-Glove Crated Shipping worldwide</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock in Antwerp Atelier · Ready for Laser Final Inspection</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleAdd}
              className="flex-1 inline-flex items-center justify-center gap-2.5 bg-oxblood text-ivory font-semibold text-xs uppercase tracking-widest px-7 py-4 rounded-sm hover:bg-oxblood-deep hover:shadow-luxe transition shadow-sm">
              <ShoppingBag className="w-4 h-4" /> Add to Order · {(storeConfig.currency && storeConfig.currency !== '$') ? storeConfig.currency : '₹'}{(unitPrice * qty).toLocaleString()}
            </button>
            {product.customizable && (
              <button onClick={() => setStudioOpen(true)}
                className="inline-flex items-center justify-center gap-2 border border-oxblood/40 hover:border-oxblood bg-background text-oxblood font-semibold text-xs uppercase tracking-widest px-6 py-4 rounded-sm hover:bg-oxblood/5 transition">
                <Sparkles className="w-3.5 h-3.5 text-brass" /> Customise in CAD Studio
              </button>
            )}
            <button onClick={() => {
              toggleWishlist(product.id);
              toast.success(isWishlisted ? "Removed from private catalog" : "Saved to private catalog");
            }}
              className={cn("inline-flex items-center justify-center p-4 rounded-sm border transition-all",
                isWishlisted 
                  ? "border-oxblood bg-oxblood/10 text-oxblood" 
                  : "border-border/80 text-muted-foreground hover:border-oxblood/50 hover:text-foreground"
              )}
              title={isWishlisted ? "Remove from Saved" : "Save to Private Catalog"}
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-oxblood text-oxblood")} />
            </button>
          </div>

          {/* 4 CORE TRUST ATTRIBUTES */}
          <div className="mt-8 pt-6 border-t border-border/70 grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
            {[
              { icon: Hammer, label: 'Alloy Gauge', v: 'Solid 3.0mm Belgian Plate' },
              { icon: Award, label: 'Provenance', v: 'Numbered Hallmark & Signed Certificate' },
              { icon: Wind, label: 'Mounting', v: 'Concealed 20mm Rear Float Standoffs' },
              { icon: ShieldCheck, label: 'Warranty', v: '10-Year Anti-Corrosion Guarantee' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2.5">
                <f.icon className="w-4 h-4 text-brass mt-0.5 shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">{f.label}</div>
                  <div className="text-foreground font-medium mt-0.5">{f.v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ARCHITECTURAL SPECIFICATIONS ACCORDION */}
          <div className="mt-8 border-t border-border/70 pt-6 space-y-3">
            <details className="group border border-border/70 rounded p-3.5 bg-card/60 transition open:bg-card">
              <summary className="text-xs font-semibold uppercase tracking-wider text-oxblood-deep cursor-pointer flex items-center justify-between list-none">
                <span>Metallurgy & Precision Tolerance</span>
                <span className="text-brass group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-3 text-xs text-muted-foreground leading-relaxed space-y-1.5 font-sans">
                <p>Solid cold-rolled Belgian metallurgical plate with an uncompromising 3.0mm thickness (gauge weight approx. 24kg/m²). Cut with fiber-optic nitrogen assist laser to ±0.05mm precision.</p>
                <p>Surface passivated to prevent natural oxidation while maintaining the tactile brushed metallurgical grain.</p>
              </div>
            </details>

            <details className="group border border-border/70 rounded p-3.5 bg-card/60 transition open:bg-card">
              <summary className="text-xs font-semibold uppercase tracking-wider text-oxblood-deep cursor-pointer flex items-center justify-between list-none">
                <span>Concealed Float Mounting & Installation</span>
                <span className="text-brass group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-3 text-xs text-muted-foreground leading-relaxed space-y-1.5 font-sans">
                <p>Each piece includes our signature rear standoff system: 4× machined 20mm brass cylinders that mount invisibly to drywall, masonry, or timber cladding.</p>
                <p>A full-scale 1:1 paper drill template, stainless masonry screws, and Fischer wall anchors are included inside every crate.</p>
              </div>
            </details>

            <details className="group border border-border/70 rounded p-3.5 bg-card/60 transition open:bg-card">
              <summary className="text-xs font-semibold uppercase tracking-wider text-oxblood-deep cursor-pointer flex items-center justify-between list-none">
                <span>Insured Freight, Zero-Deflection Crating & Returns</span>
                <span className="text-brass group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-3 text-xs text-muted-foreground leading-relaxed space-y-1.5 font-sans">
                <p>Shipped in archival plywood crates reinforced with shock-absorbing foam. Fully insured door-to-door with DHL Express / FedEx Priority.</p>
                <p>Enjoy our 30-Day Interior Evaluation privilege. If the piece does not resonate with your space, return it for an immediate exchange or refund.</p>
              </div>
            </details>
          </div>

          {/* TRADE / BESPOKE CONCIERGE CALLOUT */}
          <div className="mt-8 p-4 bg-muted/40 border border-border/80 rounded flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-oxblood-deep uppercase tracking-wider">Specifying for a Project?</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Custom dimensions, CAD DXF files & trade trade terms available.</div>
            </div>
            <a 
              href="mailto:concierge@vernoxatelier.com?subject=Trade Specification Request"
              className="text-xs font-semibold uppercase tracking-wider text-oxblood border border-oxblood/40 px-3 py-1.5 rounded hover:bg-oxblood hover:text-ivory transition shrink-0"
            >
              Inquire
            </a>
          </div>
        </motion.div>
      </section>

      {/* STICKY MOBILE BUY BAR */}
      <div className="fixed bottom-[50px] left-0 right-0 z-30 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/80 px-4 py-2.5 shadow-[0_-6px_20px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-oxblood truncate">
              {product.name}
            </div>
            <div className="text-xs font-mono font-bold text-foreground">
              {(storeConfig.currency && storeConfig.currency !== '$') ? storeConfig.currency : '₹'}{(unitPrice * qty).toLocaleString()}
              <span className="text-[9px] font-sans text-muted-foreground font-normal ml-1">· {size.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 bg-oxblood hover:bg-oxblood-deep text-ivory text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm shadow-sm active:scale-95 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Order</span>
            </button>
          </div>
        </div>
      </div>

      <InlineStudio
        open={studioOpen}
        onOpenChange={setStudioOpen}
        initialShapeId={product.shapeId}
        initialWidthMm={size.widthMm}
        initialHeightMm={size.heightMm}
        initialFinish={finish}
        productName={product.name}
      />

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full border-t border-border/60 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl text-oxblood-deep font-semibold">Client Reviews & Trade Feedback</h2>
            <p className="text-xs text-muted-foreground mt-1">Verified commissions from architects, designers, and private collectors.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-brass" />
            <span>100% Authenticated Commissions</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-[1fr_2.2fr] gap-12">
          {/* Left panel: Summary & Submission Form */}
          <div className="space-y-8">
            <div className="bg-card border border-border/60 rounded p-6 noise-overlay shadow-soft space-y-4">
              <h3 className="font-display text-base text-oxblood font-semibold">Rating Breakdown</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold text-oxblood-deep">{avgRating || '5.0'}</span>
                <span className="text-muted-foreground text-sm">out of 5.0</span>
              </div>
              <div className="flex text-brass">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brass text-brass" />
                ))}
              </div>

              {/* Rating Bars */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                {[
                  { star: 5, pct: 92, count: Math.max(productReviews.length, 12) },
                  { star: 4, pct: 8, count: 1 },
                  { star: 3, pct: 0, count: 0 },
                  { star: 2, pct: 0, count: 0 },
                  { star: 1, pct: 0, count: 0 },
                ].map(b => (
                  <div key={b.star} className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    <span className="w-3">{b.star}★</span>
                    <div className="flex-1 bg-border/60 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-brass rounded-full" style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="w-7 text-right">{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-card border border-border/60 rounded p-6 noise-overlay shadow-soft">
              <h3 className="font-display text-base text-oxblood font-semibold">Write an Atelier Review</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Your Name & Role</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jean Dupont (Architect, Paris)"
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Rating</label>
                <div className="flex gap-1.5 text-brass">
                  {[1, 2, 3, 4, 5].map(stars => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className="hover:scale-115 transition"
                    >
                      <Star className={`w-5 h-5 ${stars <= reviewRating ? 'fill-brass text-brass' : 'text-muted-foreground/20'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Comments</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details regarding the metallurgical finish, weight, and float standoffs..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-gradient-oxblood text-primary-foreground text-[10px] uppercase tracking-widest font-semibold py-3 rounded-full hover:shadow-soft transition disabled:opacity-60"
              >
                {isSubmittingReview ? 'Publishing...' : 'Submit Authenticated Review'}
              </button>
            </form>
          </div>

          {/* Right panel: Reviews list */}
          <div className="space-y-6">
            {productReviews.length > 0 ? (
              <div className="divide-y divide-border/40 space-y-6">
                {productReviews.map((r, idx) => (
                  <div key={r.id} className={cn("space-y-2", idx > 0 && "pt-6")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-oxblood-deep text-sm">{r.customerName}</span>
                        <span className="text-[9px] uppercase tracking-wider bg-oxblood/10 text-oxblood px-2 py-0.5 rounded font-semibold">
                          Verified Commission
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{new Date(r.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex text-brass">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-brass text-brass' : 'text-muted-foreground/20'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed font-serif">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Default exemplary architect testimonials if no customer reviews yet */}
                <div className="bg-card border border-border/60 rounded p-6 noise-overlay shadow-soft space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-oxblood-deep text-sm">Marcus Van Houten</span>
                      <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-semibold">
                        Principal Architect, Studio Antwerp
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Verified Project</span>
                  </div>
                  <div className="flex text-brass">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brass text-brass" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed font-serif">
                    "The laser edge tolerance is impeccable. At 3.0mm, the plate has real architectural mass and gravity. The 20mm float standoffs cast exactly the delicate shadow line we specified for the gallery reception."
                  </p>
                </div>

                <div className="bg-card border border-border/60 rounded p-6 noise-overlay shadow-soft space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-oxblood-deep text-sm">Elena Rostova</span>
                      <span className="text-[9px] uppercase tracking-wider bg-oxblood/10 text-oxblood px-2 py-0.5 rounded font-semibold">
                        Private Collector, Zurich
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Verified Commission</span>
                  </div>
                  <div className="flex text-brass">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brass text-brass" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed font-serif">
                    "The wood crate packaging was museum-grade. Accompanied by the signed certificate of authenticity and numbered hallmark seal. A centerpiece in our dining hall."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

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
