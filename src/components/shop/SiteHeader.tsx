import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { cn } from '@/lib/utils';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { useCatalog } from '@/lib/catalogContext';

const nav = [
  { to: '/shop', label: 'Collections' },
  { to: '/customize', label: 'Bespoke Studio' },
  { to: '/about', label: 'The Craft & Metallurgy' },
  { to: '/notebook', label: 'Atelier Journal' },
];

interface Props {
  onOpenStudio?: () => void;
}

export function SiteHeader({ onOpenStudio }: Props = {}) {
  const { count, setDrawerOpen } = useCart();
  const { wishlist } = useCatalog();
  const [open, setOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const openStudio = onOpenStudio ?? (() => setStudioOpen(true));

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-oxblood-deep text-ivory text-[9px] sm:text-[10px] uppercase tracking-[0.25em] py-2 px-4 text-center font-medium border-b border-brass/20 flex items-center justify-center gap-3">
        <span className="opacity-90">Complimentary Insured Delivery Worldwide</span>
        <span className="w-1 h-1 rounded-full bg-brass/60 hidden sm:inline-block" />
        <span className="hidden sm:inline-block text-brass opacity-95">Signed Certificate of Authenticity & Hallmark with Every Piece</span>
        <span className="w-1 h-1 rounded-full bg-brass/60 hidden md:inline-block" />
        <span className="hidden md:inline-block opacity-75">Antwerp Atelier · Est. 2019</span>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/90 border-b border-border/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <Link to="/" className="flex items-center gap-3 group" title="Vernox Atelier">
            <div className="flex flex-col">
              <span className="font-brand text-2xl md:text-3xl font-bold tracking-[0.22em] text-oxblood-deep uppercase leading-none group-hover:text-brass transition-colors">
                VERNOX
              </span>
              <span className="text-[8px] uppercase tracking-[0.38em] text-brass font-semibold mt-1">
                Atelier d'Art Métallique · Anvers
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => cn(
                  'relative text-[11px] uppercase tracking-[0.25em] font-semibold transition-colors py-1',
                  isActive
                    ? 'text-oxblood after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-oxblood'
                    : 'text-foreground/70 hover:text-oxblood'
                )}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={openStudio}
              className="hidden lg:inline-flex items-center gap-2 mr-2 border border-oxblood/40 hover:border-oxblood bg-oxblood/5 hover:bg-oxblood text-oxblood hover:text-ivory px-4 py-2 rounded-sm text-[10px] uppercase tracking-[0.2em] font-semibold transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> Bespoke CAD Studio
            </button>

            <Link to="/account?tab=wishlist" aria-label="Wishlist" className="relative p-2.5 rounded-full hover:bg-oxblood/8 transition">
              <Heart className="w-4 h-4 text-oxblood-deep" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-oxblood text-ivory text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/account" aria-label="Account" className="p-2.5 rounded-full hover:bg-oxblood/8 transition">
              <User className="w-4 h-4 text-oxblood-deep" />
            </Link>

            <button onClick={() => setDrawerOpen(true)} aria-label="Cart" className="relative p-2.5 rounded-full hover:bg-oxblood/8 transition">
              <ShoppingBag className="w-4 h-4 text-oxblood-deep" />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-oxblood text-ivory text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button className="md:hidden p-2.5 rounded-full hover:bg-oxblood/8" onClick={() => setOpen(o => !o)} aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-oxblood/15 bg-background/95">
            <nav className="flex flex-col p-4 gap-1">
              {nav.map(n => (
                <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setOpen(false)}
                  className={({ isActive }) => cn('px-4 py-3 rounded-sm text-xs uppercase tracking-widest',
                    isActive ? 'bg-oxblood/8 text-oxblood' : 'hover:bg-oxblood/5')}>
                  {n.label}
                </NavLink>
              ))}
              <button onClick={() => { setOpen(false); openStudio(); }}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-oxblood text-ivory px-4 py-3 rounded-full text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Open Studio
              </button>
            </nav>
          </div>
        )}
      </header>

      {!onOpenStudio && <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />}
    </>
  );
}
