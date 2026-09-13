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

  const shipping = subtotal > storeConfig.freeShippingThreshold || subtotal === 0 ? 0 : storeConfig.shippingFee;
  const total = subtotal + shipping;

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* SLIDE OUT DRAWER CARD */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-card/95 backdrop-blur-md border-l border-border shadow-luxe z-50 flex flex-col noise-overlay"
          >
            {/* DRAWER HEADER */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-oxblood" />
                <h3 className="font-display text-xl text-oxblood-deep font-semibold">Your Cart</h3>
                <span className="bg-oxblood/10 text-oxblood text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER BODY (SCROLLABLE ITEMS LIST) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-border/40">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                  <div>
                    <p className="text-muted-foreground font-serif-italic">Your cart is empty.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Explore our collections to add items.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/shop');
                    }}
                    className="border border-oxblood text-oxblood hover:bg-oxblood hover:text-ivory text-xs uppercase tracking-widest px-6 py-3 rounded-full transition font-semibold"
                  >
                    Browse Atelier
                  </button>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id} className={`flex gap-4 py-4 ${idx === 0 ? 'pt-0' : ''}`}>
                    {/* Item Image Thumb */}
                    <div className="w-20 h-20 bg-background border border-border/60 rounded p-2 flex items-center justify-center shrink-0">
                      {item.customDesignThumb ? (
                        <img src={item.customDesignThumb} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <ShapeThumb shapeId={item.shapeId} finish={item.finish} className="w-full h-full" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.productSlug}`} 
                        onClick={() => setDrawerOpen(false)}
                        className="font-display text-base text-oxblood-deep hover:text-brass transition truncate block font-medium"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.finish} · {item.sizeLabel}
                      </div>

                      {/* Quantity Selector & Remove button */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-border/80 rounded bg-background text-xs overflow-hidden">
                          <button 
                            type="button" 
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-foreground font-semibold">{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            remove(item.id);
                            toast.info(`Removed ${item.productName}`);
                          }}
                          className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-muted transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Subtotal Price */}
                    <div className="text-right text-sm font-semibold font-mono text-oxblood-deep shrink-0">
                      {storeConfig.currency}{(item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DRAWER FOOTER (CHECKOUT & TOTALS) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-background-warm/30 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono text-sm font-semibold text-foreground">{storeConfig.currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-mono">{shipping === 0 ? 'Free' : `${storeConfig.currency}${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="text-[10px] text-muted-foreground/80 bg-oxblood/5 border border-oxblood/10 px-3 py-1.5 rounded">
                      Add <span className="font-semibold">{storeConfig.currency}{(storeConfig.freeShippingThreshold - subtotal).toFixed(2)}</span> for free shipping.
                    </div>
                  )}

                  <div className="flex justify-between border-t border-border/60 pt-3 text-sm font-semibold text-oxblood-deep">
                    <span>Estimated Total</span>
                    <span className="font-mono text-base font-bold">{storeConfig.currency}{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-gradient-oxblood text-primary-foreground font-semibold py-3.5 rounded-full hover:shadow-luxe transition text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link 
                    to="/cart" 
                    onClick={() => setDrawerOpen(false)}
                    className="block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-oxblood font-semibold py-2"
                  >
                    View detailed cart
                  </Link>
                </div>

                <div className="text-[10px] text-muted-foreground flex justify-center items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brass" />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
