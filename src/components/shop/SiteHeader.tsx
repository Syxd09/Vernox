import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop/frames', label: 'Frames' },
  { to: '/shop/monograms', label: 'Monograms' },
  { to: '/customize', label: 'Design Studio' },
  { to: '/about', label: 'About' },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-gold shadow-luxe" />
          <span className="font-display text-2xl tracking-tight">Vernox</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => cn(
                'text-sm uppercase tracking-wider transition-colors',
                isActive ? 'text-gold' : 'text-foreground/70 hover:text-foreground'
              )}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/account" aria-label="Account" className="p-2 rounded-full hover:bg-muted transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-primary-foreground text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 rounded-full hover:bg-muted"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95">
          <nav className="flex flex-col p-4 gap-1">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn(
                  'px-4 py-3 rounded-md text-sm uppercase tracking-wider',
                  isActive ? 'bg-muted text-gold' : 'hover:bg-muted'
                )}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}