import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { cn } from '@/lib/utils';
import { InlineStudio } from '@/components/experience/InlineStudio';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Atelier' },
  { to: '/shop/frames', label: 'Frames' },
  { to: '/shop/monograms', label: 'Monograms' },
  { to: '/about', label: 'Story' },
];

interface Props {
  onOpenStudio?: () => void;
}

export function SiteHeader({ onOpenStudio }: Props = {}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const openStudio = onOpenStudio ?? (() => setStudioOpen(true));

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-oxblood/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-10 h-10 rounded-full bg-oxblood flex items-center justify-center">
              <span className="font-display italic text-ivory text-lg">V</span>
              <div className="absolute inset-0 rounded-full border border-brass/40 scale-110" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-tight text-oxblood-deep">Vernox</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-oxblood/60 mt-0.5">Atelier · Antwerp</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => cn(
                  'relative text-[11px] uppercase tracking-[0.25em] transition-colors py-1',
                  isActive
                    ? 'text-oxblood after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-oxblood'
                    : 'text-foreground/60 hover:text-oxblood'
                )}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={openStudio}
              className="hidden md:inline-flex items-center gap-2 mr-2 bg-oxblood text-ivory px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-oxblood-deep transition">
              <Sparkles className="w-3.5 h-3.5" /> Studio
            </button>
            <Link to="/account" aria-label="Account" className="p-2.5 rounded-full hover:bg-oxblood/8 transition">
              <User className="w-5 h-5 text-oxblood-deep" />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative p-2.5 rounded-full hover:bg-oxblood/8 transition">
              <ShoppingBag className="w-5 h-5 text-oxblood-deep" />
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-oxblood text-ivory text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
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
