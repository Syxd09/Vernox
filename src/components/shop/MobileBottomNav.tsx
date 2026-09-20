import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { InlineStudio } from '@/components/experience/InlineStudio';

export function MobileBottomNav() {
  const location = useLocation();
  const { count, setDrawerOpen } = useCart();
  const { wishlist } = useCatalog();
  const [studioOpen, setStudioOpen] = useState(false);

  // Hide on standalone full-screen customizer if active
  if (location.pathname.startsWith('/studio') || location.pathname.startsWith('/customize')) {
    return null;
  }

  const isShop = location.pathname.startsWith('/shop');
  const isWishlist = location.pathname === '/account' && location.search.includes('wishlist');
  const isAccount = location.pathname === '/account' && !location.search.includes('wishlist');

  return (
    <>
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/92 backdrop-blur-xl border-t border-border/80 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] pt-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] transition-all"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center px-2">
          {/* 1. Shop Collections */}
          <Link
            to="/shop"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 text-[9px] uppercase tracking-wider font-semibold transition-colors active:scale-95",
              isShop ? "text-oxblood" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Compass className={cn("w-4 h-4 transition-transform", isShop && "scale-110 text-oxblood")} />
            <span>Catalog</span>
          </Link>

          {/* 2. Bespoke CAD Studio */}
          <button
            type="button"
            onClick={() => setStudioOpen(true)}
            className="flex flex-col items-center justify-center py-1 gap-1 text-[9px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-brass animate-pulse" />
            </div>
            <span className="text-brass font-bold">Studio</span>
          </button>

          {/* 3. Wishlist */}
          <Link
            to="/account?tab=wishlist"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 text-[9px] uppercase tracking-wider font-semibold transition-colors active:scale-95 relative",
              isWishlist ? "text-oxblood" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Heart className={cn("w-4 h-4", isWishlist && "fill-oxblood text-oxblood scale-110")} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-oxblood text-ivory text-[8px] font-mono font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span>Saved</span>
          </Link>

          {/* 4. Cart Bag */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 gap-1 text-[9px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-oxblood text-ivory text-[8px] font-mono font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center animate-scale-in">
                  {count}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>

          {/* 5. Client Account */}
          <Link
            to="/account"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 text-[9px] uppercase tracking-wider font-semibold transition-colors active:scale-95",
              isAccount ? "text-oxblood" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className={cn("w-4 h-4", isAccount && "text-oxblood scale-110")} />
            <span>Profile</span>
          </Link>
        </div>
      </nav>

      {/* Embedded Studio Modal Triggered from Mobile Bottom Nav */}
      <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />
    </>
  );
}
