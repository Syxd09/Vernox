import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Truck, Lock, Phone, Mail, MapPin, Clock } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E6E2D8] bg-[#FAF8F5] text-[#18181B] mt-0">
      {/* 4 Trust & Authenticity Pillars Banner */}
      <div className="border-b border-[#E6E2D8] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E2D8] text-[#C5A880] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#18181B]">Numbered Hallmark</div>
              <div className="text-xs text-[#18181B]/65 mt-0.5 leading-relaxed font-sans">
                Every piece is stamped with the atelier seal and accompanied by a signed Certificate of Authenticity.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E2D8] text-[#C5A880] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#18181B]">Solid Metallurgical Plate</div>
              <div className="text-xs text-[#18181B]/65 mt-0.5 leading-relaxed font-sans">
                Precision laser-sliced from solid 3mm Belgian sheet steel, CZ108 brass, and marine 304 stainless.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E2D8] text-[#C5A880] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#18181B]">Insured White-Glove Transit</div>
              <div className="text-xs text-[#18181B]/65 mt-0.5 leading-relaxed font-sans">
                Packed in reinforced archival wooden crates with 100% transit insurance and door-to-door tracking.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E2D8] text-[#C5A880] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#18181B]">Level-1 Encrypted Checkout</div>
              <div className="text-xs text-[#18181B]/65 mt-0.5 leading-relaxed font-sans">
                Bank-grade 256-bit SSL encryption powered by Razorpay. Seamless UPI, cards, and net banking.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation & Contacts */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Brand & Manifesto */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-brand text-2xl tracking-[0.22em] font-bold text-oxblood-deep uppercase leading-none">
              VERNOX
            </span>
            <span className="text-[8px] uppercase tracking-[0.38em] text-brass font-semibold mt-1">
              Atelier d'Art Métallique · Anvers
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-serif-italic max-w-xs">
            "We believe metal is not a modern convenience, but an enduring medium of architecture. Sliced with light, finished by hand, kept for generations."
          </p>
          <div className="pt-2 text-[10px] uppercase tracking-wider text-muted-foreground/80 space-y-1">
            <div>Atelier Reg: BE 0742.891.204</div>
            <div>Antwerp Guild of Fine Metalcraft No. 4419</div>
          </div>
        </div>

        {/* Column 2: Collections & Archive */}
        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.25em] font-bold mb-4 text-oxblood-deep">Atelier Collections</h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
            <li><Link to="/shop" className="hover:text-oxblood transition">Complete Art Catalog</Link></li>
            <li><Link to="/shop/frames" className="hover:text-oxblood transition">Architectural Frames</Link></li>
            <li><Link to="/shop/monograms" className="hover:text-oxblood transition">Bespoke Monograms & Signs</Link></li>
            <li><Link to="/shop/geometric" className="hover:text-oxblood transition">Geometric Wall Sculptures</Link></li>
            <li><Link to="/shop/nature" className="hover:text-oxblood transition">Botanical & Coastal Profiles</Link></li>
            <li><Link to="/customize" className="text-brass hover:underline transition">Open Bespoke CAD Studio →</Link></li>
          </ul>
        </div>

        {/* Column 3: Atelier Services & Trade */}
        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.25em] font-bold mb-4 text-oxblood-deep">Services & Trade</h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
            <li><Link to="/about" className="hover:text-oxblood transition">The Antwerp Craft & Metallurgy</Link></li>
            <li><Link to="/about#b2b" className="hover:text-oxblood transition font-semibold text-foreground flex items-center gap-1.5"><span>B2B Bulk Corporate Supply</span><span className="text-[9px] font-mono text-brass font-bold">BULK</span></Link></li>
            <li><Link to="/about#b2b" className="hover:text-oxblood transition">Architectural Trade Program</Link></li>
            <li><Link to="/customize" className="hover:text-oxblood transition">Bespoke Commissions & CAM Proofing</Link></li>
            <li><Link to="/notebook" className="hover:text-oxblood transition">Atelier Journal & Exhibition Notes</Link></li>
            <li><Link to="/account" className="hover:text-oxblood transition">Client Order Verification</Link></li>
          </ul>
        </div>

        {/* Column 4: Physical Atelier & Concierge */}
        <div className="space-y-3.5">
          <h4 className="font-display text-sm uppercase tracking-[0.25em] font-bold mb-4 text-oxblood-deep">Atelier & Concierge</h4>
          
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 text-brass shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Antwerp Atelier & Showroom</div>
              <div>Kloosterstraat 44, 2000 Antwerpen, Belgium</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <Phone className="w-4 h-4 text-brass shrink-0" />
            <a href="tel:+3232314490" className="hover:text-oxblood transition">+32 3 231 44 90</a>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <Mail className="w-4 h-4 text-brass shrink-0" />
            <a href="mailto:concierge@vernoxatelier.com" className="hover:text-oxblood transition">concierge@vernoxatelier.com</a>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-muted-foreground pt-1">
            <Clock className="w-4 h-4 text-brass shrink-0 mt-0.5" />
            <div>
              <div>Tuesday – Saturday</div>
              <div className="text-[11px] text-muted-foreground/80">10:00 – 18:00 CET (By Appointment)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Press & International Trade Endorsements Bar */}
      <div className="border-b border-white/10 bg-[#121316] text-[#E5E0D8] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A880] font-mono font-bold block">
              Architectural Acclaim & Trade Specification
            </span>
            <span className="text-xs text-white/70 font-serif-italic">
              Featured in international publications and specified by residential & hospitality practices worldwide.
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-serif tracking-widest text-white/80 uppercase">
            <span className="hover:text-[#C5A880] transition cursor-default">Architectural Digest</span>
            <span>·</span>
            <span className="hover:text-[#C5A880] transition cursor-default">Wallpaper*</span>
            <span>·</span>
            <span className="hover:text-[#C5A880] transition cursor-default">Dezeen</span>
            <span>·</span>
            <span className="hover:text-[#C5A880] transition cursor-default">Elle Décor</span>
            <span>·</span>
            <span className="hover:text-[#C5A880] transition cursor-default">The World of Interiors</span>
          </div>
        </div>
      </div>

      {/* Bottom Payment Marks & Legal Bar */}
      <div className="border-t border-[#E6E2D8] py-8 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#18181B]/70">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-[#18181B]">
              © {new Date().getFullYear()} VERNOX ATELIER · SCULPTED IN ANTWERP, BELGIUM
            </div>
            <div className="text-[10px] text-[#18181B]/55">
              Solid 3.0mm Belgian Plate · Archival Crated Freight · 10-Year Weathering Warranty
            </div>
          </div>

          {/* Accepted Secure Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-[#18181B]/70 font-mono">
            <span className="px-2 py-0.5 bg-white border border-[#E6E2D8] rounded-[2px]">Visa</span>
            <span className="px-2 py-0.5 bg-white border border-[#E6E2D8] rounded-[2px]">Mastercard</span>
            <span className="px-2 py-0.5 bg-white border border-[#E6E2D8] rounded-[2px]">American Express</span>
            <span className="px-2 py-0.5 bg-white border border-[#E6E2D8] rounded-[2px]">Apple Pay</span>
            <span className="px-2 py-0.5 bg-white border border-[#E6E2D8] rounded-[2px]">Bank Wire / SEPA</span>
            <span className="px-2 py-0.5 bg-white border border-[#E6E2D8] rounded-[2px]">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
