import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Sparkles, Heart, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { cn } from '@/lib/utils';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { useCatalog } from '@/lib/catalogContext';
import { MobileBottomNav } from './MobileBottomNav';
import { SearchModal } from '@/components/editorial/SearchModal';

interface Props {
  onOpenStudio?: () => void;
}

export function SiteHeader({ onOpenStudio }: Props = {}) {
  const { count, setDrawerOpen } = useCart();
  const { wishlist } = useCatalog();
  const [open, setOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openStudio = onOpenStudio ?? (() => setStudioOpen(true));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5"
          : "bg-[#0B0B0B]/75 backdrop-blur-sm border-b border-white/5 py-4"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          {/* Brand Wordmark (Left) */}
          <Link to="/" className="flex items-center group" title="Vernox Atelier">
            <div className="flex flex-col">
              <span className="font-brand text-2xl md:text-[25px] font-semibold tracking-[0.28em] text-white uppercase leading-none group-hover:text-[#D4AF37] transition-colors">
                VERNOX
              </span>
              <span className="text-[8px] uppercase tracking-[0.34em] text-white/50 font-medium mt-1 font-sans">
                Atelier Antwerp
              </span>
            </div>
          </Link>

          {/* Clean Editorial Navigation (Center) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <NavLink
              to="/shop"
              className={({ isActive }) => cn(
                'relative text-[10px] uppercase tracking-[0.24em] font-medium py-1 transition-colors group/link',
                isActive ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <span>Collections</span>
                  <span className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#D4AF37] transition-all duration-300',
                    isActive ? 'w-full' : 'w-0 group-hover/link:w-full'
                  )} />
                </>
              )}
            </NavLink>

            <button
              type="button"
              onClick={openStudio}
              className="relative text-[10px] uppercase tracking-[0.24em] font-medium py-1 text-white/70 hover:text-white transition-colors group/link flex items-center gap-1.5 cursor-pointer"
            >
              <span>Studio</span>
              <span className="text-[8px] text-[#D4AF37] group-hover/link:text-white transition-colors">✦</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4AF37] group-hover/link:w-full transition-all duration-300" />
            </button>

            <NavLink
              to="/about"
              className={({ isActive }) => cn(
                'relative text-[10px] uppercase tracking-[0.24em] font-medium py-1 transition-colors group/link',
                isActive ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <span>Craft</span>
                  <span className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#D4AF37] transition-all duration-300',
                    isActive ? 'w-full' : 'w-0 group-hover/link:w-full'
                  )} />
                </>
              )}
            </NavLink>

            <NavLink
              to="/about#b2b"
              className="relative text-[10px] uppercase tracking-[0.24em] font-medium py-1 text-white/70 hover:text-white transition-colors group/link flex items-center gap-1.5"
            >
              <span>Trade / B2B</span>
              <span className="text-[8px] font-mono text-[#D4AF37] border border-[#D4AF37]/40 px-1 rounded-xs">BULK</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4AF37] group-hover/link:w-full transition-all duration-300" />
            </NavLink>

            <NavLink
              to="/notebook"
              className={({ isActive }) => cn(
                'relative text-[10px] uppercase tracking-[0.24em] font-medium py-1 transition-colors group/link',
                isActive ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <span>Journal</span>
                  <span className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#D4AF37] transition-all duration-300',
                    isActive ? 'w-full' : 'w-0 group-hover/link:w-full'
                  )} />
                </>
              )}
            </NavLink>
          </nav>

          {/* Luxury Utility Icons (Right) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Catalog"
              className="p-2 text-white/75 hover:text-[#D4AF37] transition-colors cursor-pointer"
              title="Search Atelier Catalog (Cmd+K)"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <Link 
              to="/account?tab=wishlist" 
              aria-label="Wishlist" 
              className="relative p-2 text-white/75 hover:text-[#D4AF37] transition-colors"
              title="Private Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#800020] text-white text-[9px] font-mono font-semibold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link 
              to="/account" 
              aria-label="Account" 
              className="p-2 text-white/75 hover:text-[#D4AF37] transition-colors"
              title="Client Account"
            >
              <User className="w-[18px] h-[18px]" />
            </Link>

            <button 
              onClick={() => setDrawerOpen(true)} 
              aria-label="Cart" 
              className="relative p-2 text-white/75 hover:text-[#D4AF37] transition-colors cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#800020] text-white text-[9px] font-mono font-semibold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer" 
              onClick={() => setOpen(o => !o)} 
              aria-label="Toggle Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-border/80 bg-background/98 backdrop-blur-xl overflow-hidden"
            >
              <div className="p-6 space-y-5">
                <nav className="flex flex-col space-y-3">
                  <NavLink
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] font-medium py-2 text-foreground/80 hover:text-oxblood border-b border-border/40"
                  >
                    Collections
                  </NavLink>
                  <button
                    onClick={() => { setOpen(false); openStudio(); }}
                    className="text-left text-sm uppercase tracking-[0.2em] font-medium py-2 text-foreground/80 hover:text-oxblood border-b border-border/40 flex items-center justify-between"
                  >
                    <span>Studio</span>
                    <Sparkles className="w-4 h-4 text-brass" />
                  </button>
                  <NavLink
                    to="/about"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] font-medium py-2 text-foreground/80 hover:text-oxblood border-b border-border/40"
                  >
                    Craft & Atelier
                  </NavLink>
                  <NavLink
                    to="/about#b2b"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] font-medium py-2 text-foreground/80 hover:text-oxblood border-b border-border/40 flex items-center justify-between"
                  >
                    <span>Trade & B2B Supply</span>
                    <span className="text-[9px] font-mono text-brass border border-brass/40 px-1 rounded-xs">BULK</span>
                  </NavLink>
                  <NavLink
                    to="/notebook"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] font-medium py-2 text-foreground/80 hover:text-oxblood border-b border-border/40"
                  >
                    Journal
                  </NavLink>
                  <NavLink
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] font-medium py-2 text-foreground/80 hover:text-oxblood border-b border-border/40 flex items-center justify-between"
                  >
                    <span>Client Account</span>
                    <User className="w-4 h-4 text-muted-foreground" />
                  </NavLink>
                </nav>

                <div className="pt-2">
                  <button
                    onClick={() => { setOpen(false); openStudio(); }}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-oxblood text-ivory px-5 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] font-semibold hover:bg-oxblood-deep transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brass" /> Launch CAD Studio
                  </button>
                </div>

                <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 text-center font-mono">
                  Kloosterstraat 44 · 2000 Antwerpen
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {!onOpenStudio && <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileBottomNav />
    </>
  );
}
