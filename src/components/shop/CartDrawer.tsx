import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function CartDrawer() {
  const { items, updateQty, remove, subtotal, isDrawerOpen, setDrawerOpen } = useCart();
  const { storeConfig } = useCatalog();
  const navigate = useNavigate();

  const threshold = storeConfig.freeShippingThreshold || 5000;
  const shipping = subtotal > threshold || subtotal === 0 ? 0 : storeConfig.shippingFee;
  const tax = subtotal * (storeConfig.taxRate / 100);
  const total = subtotal + shipping + tax;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remainingForFreeShipping = Math.max(0, threshold - subtotal);

  const handleCheckoutClick = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* BACKDROP OVERLAY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* SLIDE OUT DRAWER CARD */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-card border-l border-border/80 shadow-2xl z-50 flex flex-col noise-overlay"
          >
            {/* DRAWER HEADER */}
            <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-card/95 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-sm bg-oxblood/10 text-oxblood">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-oxblood-deep font-semibold leading-none">Your Atelier Order</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Antwerp Crated Commissions</p>
                </div>
                <span className="ml-1 bg-oxblood text-ivory text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                aria-label="Close cart drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DYNAMIC FREE INSURED SHIPPING TRACKER */}
            {items.length > 0 && (
              <div className="px-6 py-3 bg-gradient-to-r from-oxblood/5 via-brass/5 to-oxblood/5 border-b border-border/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-medium text-oxblood-deep flex items-center gap-1.5 text-[11px]">
                      <span className="text-brass">✦</span> Complimentary Worldwide Insured Delivery Unlocked
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">
                      Add <span className="font-bold text-oxblood-deep font-mono">{storeConfig.currency}{remainingForFreeShipping.toFixed(2)}</span> for Free Insured Delivery
                    </span>
                  )}
                  <span className="font-mono text-[10px] font-semibold text-oxblood">{progressPercent}%</span>
                </div>
                <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-oxblood via-brass to-oxblood transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* TRUST REASSURANCE PILLS BAR */}
            <div className="px-6 py-2 bg-muted/30 border-b border-border/40 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1">🛡️ 10-Yr Guarantee</span>
              <span>·</span>
              <span className="flex items-center gap-1">📦 Crated Transit</span>
              <span>·</span>
              <span className="flex items-center gap-1">📜 Signed Hallmark</span>
            </div>

            {/* DRAWER BODY (SCROLLABLE ITEMS LIST) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-border/40">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-6">
                  <div className="w-16 h-16 rounded-full bg-oxblood/5 border border-oxblood/15 flex items-center justify-center text-oxblood">
                    <ShoppingBag className="w-8 h-8 opacity-70" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-display text-xl text-oxblood-deep font-semibold">Your Cart is Empty</p>
                    <p className="text-xs text-muted-foreground font-serif-italic max-w-xs leading-relaxed">
                      "Metal is not an ordinary medium; it holds memory, architecture, and light."
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">Explore our signature laser-sculpted collections.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/shop');
                    }}
                    className="bg-oxblood text-ivory hover:bg-oxblood-deep text-[11px] uppercase tracking-[0.2em] px-7 py-3 rounded-full transition font-semibold shadow-soft hover:shadow-luxe"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id} className={`flex gap-4 py-4 ${idx === 0 ? 'pt-0' : ''}`}>
                    {/* Item Image Thumb */}
                    <div className="w-20 h-20 bg-background border border-border/80 rounded p-2 flex items-center justify-center shrink-0 shadow-sm relative group">
                      {item.customDesignThumb ? (
                        <img src={item.customDesignThumb} alt={item.productName} className="w-full h-full object-contain" />
                      ) : (
                        <ShapeThumb shapeId={item.shapeId} finish={item.finish} className="w-full h-full" />
                      )}
                      {item.customDesignRef && (
                        <span className="absolute bottom-1 right-1 bg-brass text-black text-[7px] font-mono px-1 rounded uppercase font-bold">
                          CAD
                        </span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link 
                          to={`/product/${item.productSlug}`} 
                          onClick={() => setDrawerOpen(false)}
                          className="font-display text-sm text-oxblood-deep hover:text-brass transition truncate font-semibold block leading-tight"
                        >
                          {item.productName}
                        </Link>
                        <div className="text-right text-xs font-semibold font-mono text-oxblood-deep shrink-0">
                          {storeConfig.currency}{(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <span className="capitalize">{item.finish}</span>
                        <span>·</span>
                        <span>{item.sizeLabel}</span>
                      </div>

                      {/* Quantity Selector & Remove button */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-border/80 rounded bg-background text-xs overflow-hidden shadow-xs">
                          <button 
                            type="button" 
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground active:bg-muted/80 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-foreground font-semibold text-xs">{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground active:bg-muted/80 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            remove(item.id);
                            toast.info(`Removed ${item.productName}`);
                          }}
                          className="text-muted-foreground hover:text-destructive p-1.5 rounded hover:bg-muted/60 transition"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DRAWER FOOTER (CHECKOUT & TOTALS) */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-border/80 bg-background/80 backdrop-blur-md space-y-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Merchandise Subtotal</span>
                    <span className="font-mono text-xs font-semibold text-foreground">{storeConfig.currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Insured Freight
                      <span className="text-[9px] text-brass uppercase font-semibold">(Reinforced Crate)</span>
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
                    <span>Estimated Tax ({storeConfig.taxRate}%)</span>
                    <span className="font-mono">{storeConfig.currency}{tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between border-t border-border/70 pt-3 text-sm font-semibold text-oxblood-deep">
                    <div className="flex flex-col">
                      <span>Total Investment</span>
                      <span className="text-[10px] text-muted-foreground font-normal">All import duties & crate included</span>
                    </div>
                    <span className="font-mono text-lg font-bold text-oxblood">{storeConfig.currency}{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-gradient-oxblood hover:bg-oxblood-deep text-primary-foreground font-semibold py-3.5 rounded-full hover:shadow-luxe active:scale-[0.99] transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-soft"
                  >
                    Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link 
                    to="/cart" 
                    onClick={() => setDrawerOpen(false)}
                    className="block text-center text-[10px] uppercase tracking-widest text-muted-foreground hover:text-oxblood font-semibold py-1.5 transition"
                  >
                    Review Detailed Cart & Guarantees →
                  </Link>
                </div>

                {/* TRUST & PAYMENT METHOD BADGES */}
                <div className="pt-2 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-brass" />
                    <span>256-Bit SSL Encrypted Checkout · 100% Crate Insured</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-wider text-muted-foreground/70 font-mono">
                    <span className="px-1.5 py-0.5 bg-muted/60 rounded border border-border/60">Visa</span>
                    <span className="px-1.5 py-0.5 bg-muted/60 rounded border border-border/60">MasterCard</span>
                    <span className="px-1.5 py-0.5 bg-muted/60 rounded border border-border/60">Amex</span>
                    <span className="px-1.5 py-0.5 bg-muted/60 rounded border border-border/60">UPI</span>
                    <span className="px-1.5 py-0.5 bg-muted/60 rounded border border-border/60">Razorpay</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
