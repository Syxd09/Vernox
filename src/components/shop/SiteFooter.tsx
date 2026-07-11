import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-gold" />
            <span className="font-display text-2xl">Vernox</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Handcrafted metal wall art, cut and finished in our studio. Custom pieces welcomed.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-gold">All Products</Link></li>
            <li><Link to="/shop/frames" className="hover:text-gold">Frames</Link></li>
            <li><Link to="/shop/monograms" className="hover:text-gold">Monograms</Link></li>
            <li><Link to="/shop/geometric" className="hover:text-gold">Geometric</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Studio</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/customize" className="hover:text-gold">Design Your Own</Link></li>
            <li><Link to="/about" className="hover:text-gold">Our Craft</Link></li>
            <li><Link to="/account" className="hover:text-gold">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">New releases, workshop stories, and early access.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm"
            />
            <button className="bg-gradient-gold text-primary-foreground text-sm font-semibold px-4 rounded-md">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vernox Metal Studio. All rights reserved.
      </div>
    </footer>
  );
}