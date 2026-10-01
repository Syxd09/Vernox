import { Link } from 'react-router-dom';
import { Instagram, Facebook, ArrowUpRight } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-[#6B2732] text-cream border-t border-gold/30">
      {/* Main Luxury Minimalist Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Info & Statement */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block group">
              <span className="font-editorial text-2xl tracking-[0.24em] font-normal uppercase text-[#F8F3EA] group-hover:text-[#C6A15B] transition-colors">
                VERNOX
              </span>
              <span className="block text-[8px] uppercase tracking-[0.32em] text-[#C6A15B] font-sans mt-1">
                Art & Sculptures
              </span>
            </Link>
            <p className="text-xs text-[#F8F3EA]/70 leading-relaxed font-sans pr-2">
              Curated wall art, modernist sculptures, and decorative statement pieces designed for timeless architectural spaces.
            </p>
            <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-[#C6A15B]/90 font-mono">
              Antwerp · Milan · New York
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-medium text-[#C6A15B] mb-5 border-b border-[#C6A15B]/20 pb-2">
              SHOP
            </h4>
            <ul className="space-y-3 text-xs text-[#F8F3EA]/80 font-sans">
              <li>
                <Link to="/shop/wall-art" className="hover:text-[#C6A15B] transition-colors">
                  Wall Art
                </Link>
              </li>
              <li>
                <Link to="/shop/sculptures" className="hover:text-[#C6A15B] transition-colors">
                  Sculptures
                </Link>
              </li>
              <li>
                <Link to="/shop/showpieces" className="hover:text-[#C6A15B] transition-colors">
                  Showpieces
                </Link>
              </li>
              <li>
                <Link to="/shop/office" className="hover:text-[#C6A15B] transition-colors">
                  Office Décor
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C6A15B] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/customize" className="text-[#C6A15B] font-medium hover:underline transition-colors flex items-center gap-1.5">
                  <span>Crafting Studio</span>
                  <span className="text-[8px] bg-[#C6A15B]/20 text-[#C6A15B] px-1 py-0.2 rounded font-mono">CUSTOM</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-medium text-[#C6A15B] mb-5 border-b border-[#C6A15B]/20 pb-2">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-3 text-xs text-[#F8F3EA]/80 font-sans">
              <li>
                <Link to="/about#shipping" className="hover:text-[#C6A15B] transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/about#returns" className="hover:text-[#C6A15B] transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/about#faqs" className="hover:text-[#C6A15B] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/about#contact" className="hover:text-[#C6A15B] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-medium text-[#C6A15B] mb-5 border-b border-[#C6A15B]/20 pb-2">
              ABOUT
            </h4>
            <ul className="space-y-3 text-xs text-[#F8F3EA]/80 font-sans">
              <li>
                <Link to="/about" className="hover:text-[#C6A15B] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C6A15B] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:text-[#C6A15B] transition-colors">
                  Custom Art
                </Link>
              </li>
              <li>
                <Link to="/about#b2b" className="hover:text-[#C6A15B] transition-colors">
                  Trade / Corporate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SOCIAL */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.26em] font-medium text-[#C6A15B] mb-5 border-b border-[#C6A15B]/20 pb-2">
              SOCIAL
            </h4>
            <ul className="space-y-3 text-xs text-[#F8F3EA]/80 font-sans">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C6A15B] transition-colors inline-flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F8F3EA]/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C6A15B] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 text-[#C6A15B] font-serif font-bold text-[13px] leading-none flex items-center justify-center">P</span>
                  <span>Pinterest</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F8F3EA]/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C6A15B] transition-colors inline-flex items-center gap-1.5"
                >
                  <Facebook className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F8F3EA]/40" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Craftsmanship Bar */}
      <div className="border-t border-[#C6A15B]/20 py-8 bg-[#6B2732] text-xs text-[#F8F3EA]/70">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#F8F3EA]/80 font-sans">
            © {new Date().getFullYear()} VERNOX · ALL RIGHTS RESERVED · MINIMAL ART & STATEMENT OBJECTS
          </div>

          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-sans">
            <Link to="/about" className="hover:text-[#C6A15B] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#C6A15B]/40">·</span>
            <Link to="/about" className="hover:text-[#C6A15B] transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#C6A15B]/40">·</span>
            <span className="text-[#C6A15B]">Insured Worldwide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
