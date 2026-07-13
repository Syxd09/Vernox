import { useParams, Link } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="max-w-2xl mx-auto px-6 py-24 text-center flex-1">
        <CheckCircle2 className="w-16 h-16 text-brass mx-auto mb-6" />
        <h1 className="font-display text-4xl mb-4">Thank you.</h1>
        <p className="text-muted-foreground mb-8">
          Your order <span className="text-brass font-mono">{orderId}</span> is confirmed.
          A receipt is on its way to your inbox. We'll get to work in the studio.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/shop" className="border border-border hover:border-oxblood px-6 py-3 rounded-full">Keep browsing</Link>
          <Link to="/account" className="bg-gradient-oxblood text-primary-foreground font-semibold px-6 py-3 rounded-full">View orders</Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}