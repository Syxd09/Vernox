import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Heart, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { cn } from '@/lib/utils';
import { useCatalog } from '@/lib/catalogContext';
import { SearchModal } from '@/components/editorial/SearchModal';

interface Props {
  onOpenStudio?: () => void;
}

export function SiteHeader({ onOpenStudio }: Props = {}) {
  const { count, setDrawerOpen } = useCart();
  const { wishlist } = useCatalog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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

  const navLinks = [
    { label: 'WALL ART', to: '/shop/wall-art' },
    { label: 'SCULPTURES', to: '/shop/sculptures' },
    { label: 'COLLECTIONS', to: '/shop' },
    { label: 'CRAFTING STUDIO', to: '/customize' },
    { label: 'TRADE', to: '/trade' },
    { label: 'ABOUT', to: '/about' },
  ];

  return (
    <>
      {/* Top Subtle Announcement Ribbon */}
      <div className="bg-maroon-deep text-cream text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.24em] py-2 px-3 sm:px-6 font-sans text-center relative z-20 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full min-w-0">
          <Link to="/trade" className="hidden sm:inline-block text-gold hover:text-cream transition-colors shrink-0">
            Architect & Designer Trade Program
          </Link>
          <span className="mx-auto sm:mx-0 font-medium tracking-[0.16em] sm:tracking-[0.26em] truncate max-w-full block min-w-0 flex-1 px-2">
            Curated Wall Art & Statement Pieces · Complimentary Insured Crating Worldwide
          </span>
          <Link to="/track-order" className="hidden sm:inline-block text-cream/80 hover:text-gold transition-colors shrink-0">
            Track Order →
          </Link>
        </div>
      </div>

      {/* Main Clean Sticky Header */}
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300 bg-cream/95 backdrop-blur-md border-b border-[#EBE4D6] w-full max-w-full overflow-hidden",
          scrolled ? "py-3 shadow-xs" : "py-4.5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between w-full min-w-0">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center group py-1" title="Vernox Art & Sculptures">
            <div className="flex flex-col">
              <span className="font-brand text-2xl sm:text-[25px] tracking-[0.28em] font-semibold text-dark-brown uppercase leading-none group-hover:text-burgundy transition-colors">
                VERNOX
              </span>
              <span className="text-[8px] uppercase tracking-[0.38em] text-dark-brown/60 font-sans mt-1">
                Art & Sculptures
              </span>
            </div>
          </Link>

          {/* Center: Clean Modernist Navigation with breathing room */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-11">
            {navLinks.map(item => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => cn(
                  "relative text-[11px] xl:text-[11.5px] uppercase tracking-[0.24em] font-sans font-medium transition-colors py-1 group/nav",
                  isActive
                    ? "text-burgundy font-semibold"
                    : "text-dark-brown hover:text-gold"
                )}
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-full h-[1.5px] transition-transform duration-300 origin-left bg-gold",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Functional Action Icons */}
          <div className="flex items-center gap-4 sm:gap-5 text-dark-brown">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-1.5 hover:text-gold transition-colors cursor-pointer relative"
              title="Search collection (⌘K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Account */}
            <Link
              to="/account"
              className="p-1.5 hover:text-gold transition-colors hidden sm:block"
              title="Collector Account"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="p-1.5 hover:text-gold transition-colors relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-burgundy text-cream text-[8px] font-mono flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 hover:text-gold transition-colors relative cursor-pointer"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-burgundy text-cream text-[9px] font-mono flex items-center justify-center font-bold shadow-xs">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 lg:hidden hover:text-gold transition-colors cursor-pointer ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-[#EBE4D6] bg-cream px-6 py-6 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map(item => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "text-xs uppercase tracking-[0.24em] font-sans py-1.5 transition-colors",
                      isActive ? "text-burgundy font-bold" : "text-dark-brown hover:text-gold"
                    )}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-4 border-t border-[#EBE4D6] space-y-2 text-xs text-dark-brown/80 font-sans">
                  <div className="flex items-center justify-between pb-2">
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 hover:text-burgundy"
                    >
                      <User className="w-4 h-4" />
                      <span>My Account</span>
                    </Link>
                    <Link
                      to="/account?tab=wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 hover:text-burgundy"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist ({wishlist.length})</span>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#EBE4D6]/60">
                    <Link
                      to="/track-order"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-burgundy font-semibold hover:underline"
                    >
                      Track Order →
                    </Link>
                    <Link
                      to="/shipping"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-dark-brown/70 hover:text-burgundy"
                    >
                      Shipping & Crating
                    </Link>
                    <Link
                      to="/returns"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-dark-brown/70 hover:text-burgundy"
                    >
                      30-Day Returns
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-dark-brown/70 hover:text-burgundy"
                    >
                      Contact Concierge
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Quick Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onOpenChange={setSearchOpen} />
    </>
  );
}
