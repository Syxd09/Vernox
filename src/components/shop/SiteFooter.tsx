import { Link } from 'react-router-dom';
import { Instagram, Facebook, ArrowUpRight } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-burgundy text-cream border-t border-dusty-pink/30 w-full max-w-full overflow-hidden">
      {/* Main Luxury Minimalist Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20 w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Info & Statement */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block group">
              <span className="font-editorial text-2xl tracking-[0.24em] font-normal uppercase text-cream group-hover:text-dusty-pink transition-colors">
                VERNOX
              </span>
              <span className="block text-[8px] uppercase tracking-[0.32em] text-dusty-pink font-sans mt-1">
                Art & Sculptures
              </span>
            </Link>
            <p className="text-xs text-cream/75 leading-relaxed font-sans pr-2">
              Curated wall art, modernist sculptures, and decorative statement pieces designed for timeless architectural spaces.
            </p>
            <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-dusty-pink font-mono">
              Antwerp · Milan · New York
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-semibold text-dusty-pink mb-5 border-b border-dusty-pink/20 pb-2">
              SHOP
            </h4>
            <ul className="space-y-3 text-xs text-cream/80 font-sans">
              <li>
                <Link to="/shop/wall-art" className="hover:text-dusty-pink transition-colors">
                  Wall Art
                </Link>
              </li>
              <li>
                <Link to="/shop/sculptures" className="hover:text-dusty-pink transition-colors">
                  Sculptures
                </Link>
              </li>
              <li>
                <Link to="/shop/showpieces" className="hover:text-dusty-pink transition-colors">
                  Showpieces
                </Link>
              </li>
              <li>
                <Link to="/shop/office" className="hover:text-dusty-pink transition-colors">
                  Office Décor
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-dusty-pink transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:text-dusty-pink transition-colors">
                  Crafting Studio (Custom CAD)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-semibold text-dusty-pink mb-5 border-b border-dusty-pink/20 pb-2">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-3 text-xs text-cream/80 font-sans">
              <li>
                <Link to="/about#shipping" className="hover:text-dusty-pink transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/about#returns" className="hover:text-dusty-pink transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/about#faqs" className="hover:text-dusty-pink transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/about#contact" className="hover:text-dusty-pink transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-semibold text-dusty-pink mb-5 border-b border-dusty-pink/20 pb-2">
              ABOUT
            </h4>
            <ul className="space-y-3 text-xs text-cream/80 font-sans">
              <li>
                <Link to="/about" className="hover:text-dusty-pink transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-dusty-pink transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:text-dusty-pink transition-colors">
                  Custom Art
                </Link>
              </li>
              <li>
                <Link to="/about#b2b" className="hover:text-dusty-pink transition-colors">
                  Trade / Corporate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SOCIAL */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-semibold text-dusty-pink mb-5 border-b border-dusty-pink/20 pb-2">
              SOCIAL
            </h4>
            <ul className="space-y-3 text-xs text-cream/80 font-sans">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dusty-pink transition-colors inline-flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-dusty-pink" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 text-cream/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dusty-pink transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 text-dusty-pink font-serif font-bold text-[13px] leading-none flex items-center justify-center">P</span>
                  <span>Pinterest</span>
                  <ArrowUpRight className="w-3 h-3 text-cream/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dusty-pink transition-colors inline-flex items-center gap-1.5"
                >
                  <Facebook className="w-3.5 h-3.5 text-dusty-pink" />
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3 h-3 text-cream/40" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Craftsmanship Bar */}
      <div className="border-t border-dusty-pink/20 py-8 bg-burgundy-hover text-xs text-cream/70 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left w-full min-w-0">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.22em] text-cream/80 font-sans max-w-full break-words">
            © {new Date().getFullYear()} VERNOX · ALL RIGHTS RESERVED · MINIMAL ART & STATEMENT OBJECTS
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] font-sans">
            <Link to="/privacy" className="hover:text-dusty-pink transition-colors">
              Privacy Policy
            </Link>
            <span className="text-dusty-pink/40">·</span>
            <Link to="/terms" className="hover:text-dusty-pink transition-colors">
              Terms of Service
            </Link>
            <span className="text-dusty-pink/40">·</span>
            <span className="text-dusty-pink">Insured Worldwide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
