import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { useCart } from '@/lib/cartContext';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, updateQty, remove, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="max-w-7xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-display text-4xl mb-10">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Link to="/shop" className="inline-flex bg-gradient-oxblood text-primary-foreground font-semibold px-6 py-3 rounded-full">
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <div className="flex flex-col divide-y divide-border/60">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 py-6">
                  <div className="w-24 h-24 shrink-0 bg-card rounded-lg p-3">
                    {item.customDesignThumb ? (
                      <img src={item.customDesignThumb} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <ShapeThumb shapeId={item.shapeId} finish={item.finish} className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.productSlug}`} className="font-display text-lg hover:text-brass">
                      {item.productName}
                    </Link>
                    <div className="text-sm text-muted-foreground">{item.sizeLabel} · {item.finish}</div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="inline-flex items-center border border-border rounded-md text-sm">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-muted">−</button>
                        <span className="px-3">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-muted">+</button>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-sm text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <aside className="bg-card border border-border/60 rounded-lg p-6 h-fit sticky top-24">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                {shipping > 0 && <div className="text-xs text-muted-foreground">Add ${(150 - subtotal).toFixed(2)} for free shipping.</div>}
                <div className="border-t border-border/60 pt-3 flex justify-between text-base font-semibold">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-gradient-oxblood text-primary-foreground font-semibold py-3 rounded-full hover:shadow-luxe">
                Checkout
              </button>
              <Link to="/shop" className="block text-center text-sm text-muted-foreground hover:text-brass mt-3">Continue shopping</Link>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}