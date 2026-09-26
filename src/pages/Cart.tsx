import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Award, 
  RotateCcw, 
  Plus, 
  Minus, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Cart() {
  const { storeConfig, products } = useCatalog();
  const { items, updateQty, remove, subtotal, clear } = useCart();
  const navigate = useNavigate();

  // Promotional Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  const threshold = storeConfig.freeShippingThreshold || 5000;
  const shipping = subtotal > threshold || subtotal === 0 ? 0 : storeConfig.shippingFee;
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * (storeConfig.taxRate / 100);
  const total = discountedSubtotal + shipping + tax;

  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remainingForFreeShipping = Math.max(0, threshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'ATELIER10') {
      setAppliedDiscount({ code: clean, percent: 10 });
      toast.success('Atelier Privilege: 10% discount applied to your order.');
    } else if (clean === 'ARCHITECT15' || clean === 'TRADE15') {
      setAppliedDiscount({ code: clean, percent: 15 });
      toast.success('Trade Privilege: 15% Architectural Studio discount applied.');
    } else if (clean === 'VERNOX20') {
      setAppliedDiscount({ code: clean, percent: 20 });
      toast.success('VIP Collector: 20% commission privilege applied.');
    } else {
      setPromoError('Invalid promotion or private collector code.');
      toast.error('The entered promo code is not recognized.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoCode('');
    toast.info('Promotional discount removed.');
  };

  // Recommended products if cart is empty or to complement cart
  const recommended = products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-oxblood/80 selection:text-ivory">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb & Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
            <Link to="/shop" className="hover:text-oxblood transition">Atelier Catalog</Link>
            <span>/</span>
            <span className="text-foreground">Shopping Cart</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep font-semibold tracking-tight">
                Your Atelier Cart
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 font-serif-italic">
                Review your laser-sculpted pieces before secure atelier crating and white-glove dispatch.
              </p>
            </div>
            {items.length > 0 && (
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-oxblood/10 text-oxblood font-bold">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} Items Selected
                </span>
                <button 
                  onClick={() => {
                    if (window.confirm("Empty entire atelier cart?")) {
                      clear();
                      toast.info("Cart cleared");
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive transition underline underline-offset-4"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* EMPTY CART LUXURY STATE */
          <div className="py-16 md:py-24 text-center max-w-2xl mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-oxblood/5 border border-oxblood/20 flex items-center justify-center text-oxblood shadow-soft">
              <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
            </div>
            <h2 className="font-display text-3xl text-oxblood-deep mb-3 font-semibold">Your Cart is Currently Empty</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-serif-italic">
              No bespoke metal pieces have been reserved. Each Vernox piece is precision-cut from solid 3.0mm Belgian metallurgical plate, hand-finished in Antwerp, and backed by a 10-year structural warranty.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-oxblood text-primary-foreground font-semibold px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:shadow-luxe transition"
              >
                Explore Signature Collections <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/customize" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-oxblood/40 hover:border-oxblood text-oxblood px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-oxblood/5 transition"
              >
                <Sparkles className="w-4 h-4 text-brass" /> Launch CAD Studio
              </Link>
            </div>

            {/* Curated Recommendations */}
            <div className="border-t border-border/80 pt-12 text-left">
              <h3 className="font-display text-xl text-oxblood-deep mb-6 font-semibold">Recommended Atelier Signatures</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {recommended.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.slug}`} 
                    className="group bg-card border border-border/70 rounded p-4 hover:border-oxblood/40 hover:shadow-soft transition block"
                  >
                    <div className="aspect-square bg-background rounded border border-border/50 mb-3 p-4 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <ShapeThumb shapeId={product.shapeId} finish={product.finishes[0]} className="w-full h-full" />
                      )}
                    </div>
                    <div className="font-display text-sm font-semibold text-oxblood-deep group-hover:text-brass transition truncate">
                      {product.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>From {storeConfig.currency}{product.price.toLocaleString()}</span>
                      <span className="text-[10px] uppercase font-semibold text-brass">View Piece →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CART LAYOUT */
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
            {/* LEFT COLUMN: Free Shipping Progress + Items List + Guarantees */}
            <div className="space-y-8">
              {/* Dynamic Free Shipping Progress Card */}
              <div className="bg-card border border-border/80 rounded-lg p-5 noise-overlay shadow-soft">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-oxblood" />
                    {remainingForFreeShipping === 0 ? (
                      <span className="font-semibold text-oxblood-deep">
                        🎉 Complimentary Worldwide Insured Delivery Unlocked!
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Add <span className="font-bold text-oxblood-deep font-mono">{storeConfig.currency}{remainingForFreeShipping.toFixed(2)}</span> more to qualify for <strong className="text-foreground">Free Insured White-Glove Shipping</strong>.
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-oxblood">{progressPercent}%</span>
                </div>
                <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-oxblood via-brass to-oxblood rounded-full"
                    style={{ width: `${progressPercent}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 mt-2">
                  <span>Standard Insured Crate</span>
                  <span>Free Insured Threshold: {storeConfig.currency}{threshold.toLocaleString()}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-card border border-border/80 rounded-lg overflow-hidden noise-overlay shadow-soft divide-y divide-border/60">
                <div className="px-6 py-4 bg-muted/30 border-b border-border/70 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  <span>Commission Item</span>
                  <span>Total</span>
                </div>

                {items.map(item => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                    {/* Item Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-background border border-border/80 rounded p-2 flex items-center justify-center shrink-0 relative group">
                      {item.customDesignThumb ? (
                        <img src={item.customDesignThumb} alt={item.productName} className="w-full h-full object-contain" />
                      ) : (
                        <ShapeThumb shapeId={item.shapeId} finish={item.finish} className="w-full h-full drop-shadow-sm" />
                      )}
                      {item.customDesignRef && (
                        <span className="absolute top-1.5 left-1.5 bg-brass text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                          STUDIO CAD
                        </span>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link 
                            to={`/product/${item.productSlug}`} 
                            className="font-display text-lg text-oxblood-deep font-semibold hover:text-brass transition leading-snug block"
                          >
                            {item.productName}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="capitalize font-medium text-foreground">{item.finish}</span>
                            <span>·</span>
                            <span>{item.sizeLabel}</span>
                            <span>·</span>
                            <span className="text-brass font-mono font-semibold">Solid 3.0mm Plate</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-base font-bold text-oxblood-deep">
                            {storeConfig.currency}{(item.unitPrice * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {storeConfig.currency}{item.unitPrice.toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Removal Controls */}
                      <div className="flex items-center justify-between pt-3">
                        <div className="inline-flex items-center border border-border/80 rounded bg-background shadow-xs overflow-hidden">
                          <button 
                            type="button" 
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground active:bg-muted/80 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-4 font-mono font-semibold text-xs text-foreground min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground active:bg-muted/80 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            remove(item.id);
                            toast.info(`Removed ${item.productName} from order`);
                          }}
                          className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5 p-1.5 rounded hover:bg-muted/60 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4 E-Commerce Trust Pillars Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border/70 rounded-lg p-4 flex items-start gap-3 shadow-soft">
                  <div className="p-2.5 rounded-sm bg-oxblood/10 text-oxblood shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-oxblood-deep">10-Year Weathering Warranty</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Industrial anti-corrosion guarantee. Guaranteed against warping, delamination, and metallurgical rust.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border/70 rounded-lg p-4 flex items-start gap-3 shadow-soft">
                  <div className="p-2.5 rounded-sm bg-brass/10 text-brass shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-oxblood-deep">Zero-Risk Crated Transit</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Reinforced archival timber crating with 100% full-value insurance. Immediate zero-cost replacement for any transit damage.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border/70 rounded-lg p-4 flex items-start gap-3 shadow-soft">
                  <div className="p-2.5 rounded-sm bg-oxblood/10 text-oxblood shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-oxblood-deep">Numbered Hallmark & Certificate</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Each piece bears an embossed Antwerp serial stamp and is accompanied by a signed artisan certificate.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border/70 rounded-lg p-4 flex items-start gap-3 shadow-soft">
                  <div className="p-2.5 rounded-sm bg-brass/10 text-brass shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-oxblood-deep">30-Day Interior Evaluation</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Examine the piece in your natural interior light with complete peace of mind. Hassle-free return policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Checkout Action */}
            <aside className="space-y-6 sticky top-24">
              <div className="bg-card border border-border/80 rounded-lg p-6 noise-overlay shadow-luxe space-y-6">
                <div className="border-b border-border/70 pb-4">
                  <h2 className="font-display text-2xl text-oxblood-deep font-semibold">Order Summary</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Calculated in real-time with insured transit</p>
                </div>

                {/* Promotional Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-brass" />
                    <span>Collector or Trade Voucher</span>
                  </label>
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{appliedDiscount.code}</span>
                          <span className="text-[10px] text-muted-foreground block">{appliedDiscount.percent}% discount activated</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleRemovePromo}
                        className="text-xs text-muted-foreground hover:text-destructive underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. ATELIER10 or TRADE15" 
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs outline-none focus:border-oxblood font-mono uppercase"
                      />
                      <button 
                        type="submit"
                        className="bg-oxblood hover:bg-oxblood-deep text-ivory text-xs px-4 py-2 rounded font-semibold uppercase tracking-wider transition"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-[10px] text-destructive">{promoError}</p>
                  )}
                </form>

                {/* Pricing Line Items */}
                <div className="space-y-3 text-xs border-t border-border/70 pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Merchandise Subtotal</span>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {storeConfig.currency}{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Privilege Discount ({appliedDiscount.percent}%)</span>
                      <span className="font-mono">-{storeConfig.currency}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Insured Freight & Archival Crate
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Complimentary</span>
                      ) : (
                        `${storeConfig.currency}${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Sales Tax / VAT ({storeConfig.taxRate}%)</span>
                    <span className="font-mono">{storeConfig.currency}{tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-border/80 pt-4 flex justify-between items-baseline">
                    <div>
                      <span className="font-display text-lg text-oxblood-deep font-semibold block">Total Investment</span>
                      <span className="text-[10px] text-muted-foreground">Includes insurance, customs & packaging</span>
                    </div>
                    <span className="font-mono text-2xl font-bold text-oxblood">
                      {storeConfig.currency}{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Primary CTA */}
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-oxblood hover:bg-oxblood-deep text-primary-foreground font-semibold py-4 rounded-full hover:shadow-luxe active:scale-[0.99] transition text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-soft"
                >
                  Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <Link 
                  to="/shop" 
                  className="block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-oxblood font-semibold transition"
                >
                  ← Return to Atelier Collections
                </Link>

                {/* Bank-Grade Security Seals */}
                <div className="border-t border-border/60 pt-4 space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                    <Lock className="w-3.5 h-3.5 text-brass" />
                    <span>256-Bit Bank-Grade SSL Encryption</span>
                  </div>

                  {/* Payment Icons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] uppercase tracking-wider text-muted-foreground/80 font-mono">
                    <span className="px-2 py-1 bg-background border border-border/80 rounded">Visa</span>
                    <span className="px-2 py-1 bg-background border border-border/80 rounded">MasterCard</span>
                    <span className="px-2 py-1 bg-background border border-border/80 rounded">American Express</span>
                    <span className="px-2 py-1 bg-background border border-border/80 rounded">UPI / QR</span>
                    <span className="px-2 py-1 bg-background border border-border/80 rounded">Razorpay</span>
                  </div>
                </div>
              </div>

              {/* Atelier Concierge Live Help Callout */}
              <div className="bg-muted/40 border border-border/70 rounded-lg p-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-oxblood/10 text-oxblood shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-oxblood-deep">Direct Atelier Concierge</div>
                  <div className="text-muted-foreground text-[11px] mt-0.5">
                    Need custom sizing or project consultation?{' '}
                    <a href="tel:+3232314490" className="text-oxblood font-semibold hover:underline">
                      +32 3 231 44 90
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}