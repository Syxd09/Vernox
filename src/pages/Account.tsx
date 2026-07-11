import { Link } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';

interface Order { id: string; total: number; placedAt: number; email: string; items: { productName: string; quantity: number }[]; }

export default function Account() {
  const orders: Order[] = JSON.parse(localStorage.getItem('vernox-orders') || '[]');
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="max-w-4xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-display text-4xl mb-2">Your Account</h1>
        <p className="text-muted-foreground mb-10">Order history is stored locally on this device.</p>
        <h2 className="font-display text-2xl mb-4">Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No orders yet.</p>
            <Link to="/shop" className="inline-flex bg-gradient-gold text-primary-foreground font-semibold px-6 py-3 rounded-full">Shop now</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice().reverse().map(o => (
              <div key={o.id} className="flex flex-wrap justify-between gap-4 bg-card border border-border/60 rounded-lg p-5">
                <div>
                  <div className="font-mono text-sm text-gold">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.placedAt).toLocaleString()}</div>
                  <div className="text-sm mt-2">{o.items.map(i => `${i.productName} × ${i.quantity}`).join(', ')}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${o.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Confirmed</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}