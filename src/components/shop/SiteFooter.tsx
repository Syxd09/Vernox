import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="border-t border-oxblood/15 bg-ivory-warm/40 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-oxblood flex items-center justify-center">
              <span className="font-display italic text-ivory">V</span>
            </div>
            <span className="font-display text-2xl text-oxblood-deep">Vernox</span>
          </div>
          <p className="text-sm text-foreground/60 max-w-xs leading-relaxed font-serif-italic">
            "Cut in Antwerp. Finished by hand. Kept for a lifetime."
          </p>
        </div>
        <div>
          <h4 className="font-display text-xl mb-4 text-oxblood-deep">Atelier</h4>
          <ul className="space-y-2.5 text-sm text-foreground/65">
            <li><Link to="/shop" className="hover:text-oxblood transition">All pieces</Link></li>
            <li><Link to="/shop/frames" className="hover:text-oxblood transition">Frames</Link></li>
            <li><Link to="/shop/monograms" className="hover:text-oxblood transition">Monograms</Link></li>
            <li><Link to="/shop/geometric" className="hover:text-oxblood transition">Geometric</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl mb-4 text-oxblood-deep">Studio</h4>
          <ul className="space-y-2.5 text-sm text-foreground/65">
            <li><Link to="/customize" className="hover:text-oxblood transition">Design your own</Link></li>
            <li><Link to="/about" className="hover:text-oxblood transition">Our craft</Link></li>
            <li><Link to="/account" className="hover:text-oxblood transition">My orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl mb-4 text-oxblood-deep">Correspondence</h4>
          <p className="text-sm text-foreground/60 mb-4 leading-relaxed">Rare drops, workshop notes, first look at new pieces.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@atelier.com"
              className="flex-1 bg-background border border-oxblood/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-oxblood" />
            <button className="bg-oxblood text-ivory text-xs uppercase tracking-widest px-5 rounded-full hover:bg-oxblood-deep transition">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-oxblood/15 py-6 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} Vernox Atelier · Sculpted in Antwerp
      </div>
    </footer>
  );
}
