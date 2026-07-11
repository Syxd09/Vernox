import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { useCart } from '@/lib/cartContext';
import { toast } from 'sonner';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [form, setForm] = useState({
    email: '', name: '', address: '', city: '', zip: '', country: 'United States',
    card: '', exp: '', cvc: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    setPlacing(true);
    setTimeout(() => {
      const orderId = `VX-${Date.now().toString(36).toUpperCase()}`;
      const orders = JSON.parse(localStorage.getItem('vernox-orders') || '[]');
      orders.push({ id: orderId, items, total, placedAt: Date.now(), email: form.email });
      localStorage.setItem('vernox-orders', JSON.stringify(orders));
      clear();
      navigate(`/order-confirmation/${orderId}`);
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="max-w-6xl mx-auto px-6 py-16 w-full grid lg:grid-cols-[1fr_360px] gap-10 flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          <h1 className="font-display text-4xl">Checkout</h1>
          <div className="space-y-4">
            <h2 className="font-display text-xl">Contact</h2>
            <input required type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-card border border-border rounded-md px-4 py-3" />
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-xl">Shipping</h2>
            <input required placeholder="Full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-card border border-border rounded-md px-4 py-3" />
            <input required placeholder="Address" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full bg-card border border-border rounded-md px-4 py-3" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="City" value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full bg-card border border-border rounded-md px-4 py-3" />
              <input required placeholder="ZIP / Postal" value={form.zip}
                onChange={e => setForm({ ...form, zip: e.target.value })}
                className="w-full bg-card border border-border rounded-md px-4 py-3" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-xl">Payment</h2>
            <input required placeholder="Card number" value={form.card}
              onChange={e => setForm({ ...form, card: e.target.value })}
              className="w-full bg-card border border-border rounded-md px-4 py-3" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="MM / YY" value={form.exp}
                onChange={e => setForm({ ...form, exp: e.target.value })}
                className="w-full bg-card border border-border rounded-md px-4 py-3" />
              <input required placeholder="CVC" value={form.cvc}
                onChange={e => setForm({ ...form, cvc: e.target.value })}
                className="w-full bg-card border border-border rounded-md px-4 py-3" />
            </div>
            <p className="text-xs text-muted-foreground">Demo checkout — no real payment is processed.</p>
          </div>
          <button disabled={placing}
            className="w-full bg-gradient-gold text-primary-foreground font-semibold py-4 rounded-full hover:shadow-luxe disabled:opacity-60">
            {placing ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
          </button>
        </form>
        <aside className="bg-card border border-border/60 rounded-lg p-6 h-fit sticky top-24">
          <h2 className="font-display text-2xl mb-6">Order</h2>
          <div className="space-y-4 mb-6 max-h-72 overflow-auto">
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <div>
                  <div>{i.productName}</div>
                  <div className="text-muted-foreground text-xs">{i.finish} · {i.sizeLabel} × {i.quantity}</div>
                </div>
                <div>${(i.unitPrice * i.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-border/60 pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-semibold border-t border-border/60 pt-2">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/cart" className="block text-center text-sm text-muted-foreground hover:text-gold mt-4">Edit cart</Link>
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}