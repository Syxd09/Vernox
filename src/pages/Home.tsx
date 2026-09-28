import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';

import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { B2BTradeModal } from '@/components/shop/B2BTradeModal';
import { useCatalog } from '@/lib/catalogContext';

// Luxury Editorial Components
import { EditorialHero } from '@/components/editorial/EditorialHero';
import { EditorialStatement } from '@/components/editorial/EditorialStatement';
import { EditorialCollections } from '@/components/editorial/EditorialCollections';
import { ProductShowcase } from '@/components/editorial/ProductShowcase';
import { RoomVisualizer } from '@/components/editorial/RoomVisualizer';
import { CraftsmanshipSection } from '@/components/editorial/CraftsmanshipSection';
import { MaterialStory } from '@/components/editorial/MaterialStory';
import { InteriorInspiration } from '@/components/editorial/InteriorInspiration';
import { BespokeCommission } from '@/components/editorial/BespokeCommission';
import { ArchitecturalProof } from '@/components/editorial/ArchitecturalProof';

export default function Home() {
  const { products, homepageSettings, topics } = useCatalog();
  const [studioOpen, setStudioOpen] = useState(false);
  const [b2bOpen, setB2bOpen] = useState(false);

  const bestsellers = products.filter(p => p.bestseller);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <EditorialHero 
            key="hero" 
            onOpenStudio={() => setStudioOpen(true)} 
          />
        );

      case 'manifesto':
        return <EditorialStatement key="manifesto" />;

      case 'collections':
        return <EditorialCollections key="collections" />;

      case 'featured':
        return <ProductShowcase key="featured" />;

      case 'visualizer':
        return (
          <RoomVisualizer 
            key="visualizer" 
            onOpenStudio={() => setStudioOpen(true)} 
          />
        );

      case 'installations':
        return <InteriorInspiration key="installations" />;

      case 'story':
        return <CraftsmanshipSection key="story" />;

      case 'metallurgy':
        return <MaterialStory key="metallurgy" />;

      case 'authenticity':
        return <ArchitecturalProof key="authenticity" />;

      case 'b2b-trade':
        return (
          <section key="b2b-trade" className="relative py-24 md:py-32 bg-[#0E0E0E] text-[#F4F2EE] border-b border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="rounded-[4px] border border-white/15 bg-black/60 backdrop-blur-xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/[0.03] rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3.5">
                      <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Architectural Trade & Commercial Supply</span>
                    </div>
                    <h2 className="font-editorial text-4xl sm:text-5xl text-white font-normal leading-tight">
                      Volume metalcraft, <br />
                      <span className="italic font-light text-[#E8E5DF]/70">engineered for commercial scale.</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#F4F2EE]/70 leading-relaxed mt-4 font-sans max-w-xl">
                      Whether sourcing 40 bespoke guest suite monograms for a luxury hotel or manufacturing precision laser-sliced screens for corporate campuses, Vernox delivers contract architectural fabrication in solid 3mm plates.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setB2bOpen(true)}
                      className="px-7 py-4 rounded-[2px] bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E8E5DF] transition flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                      Inquire for Bulk Supply
                    </button>
                    <Link
                      to="/about#b2b"
                      className="px-6 py-4 rounded-[2px] border border-white/20 hover:border-white text-white text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2"
                    >
                      View Specs & Tiering
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Trade Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs font-mono">
                  <div className="p-4 rounded-[2px] bg-white/5 border border-white/10 space-y-1.5">
                    <span className="text-[#D4AF37] text-[10px] tracking-wider block">TIERED MARGINS</span>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Volume trade discounts from 15% to 40% with formal GST/VAT invoicing.
                    </p>
                  </div>
                  <div className="p-4 rounded-[2px] bg-white/5 border border-white/10 space-y-1.5">
                    <span className="text-[#D4AF37] text-[10px] tracking-wider block">CAD/CAM PROOFING</span>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Direct engineering review of DWG, DXF, and STEP files with kerf calculations.
                    </p>
                  </div>
                  <div className="p-4 rounded-[2px] bg-white/5 border border-white/10 space-y-1.5">
                    <span className="text-[#D4AF37] text-[10px] tracking-wider block">BATCH PATINATION</span>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Chemical aging baths formulated to match architectural swatch samples.
                    </p>
                  </div>
                  <div className="p-4 rounded-[2px] bg-white/5 border border-white/10 space-y-1.5">
                    <span className="text-[#D4AF37] text-[10px] tracking-wider block">CRATED LOGISTICS</span>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Wood-reinforced crates, foam damping, and heavy-duty 316 stainless standoffs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'bestsellers':
        return (
          <section key="bestsellers" className="relative py-24 md:py-36 bg-[#0B0B0B] text-[#F4F2EE] border-b border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3">
                    <span>Permanent Collection</span>
                  </div>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-white font-normal leading-tight">
                    Most requested <br />
                    <span className="italic font-light text-[#E8E5DF]/70">atelier compositions.</span>
                  </h2>
                </div>
                <Link
                  to="/shop"
                  className="text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white font-semibold transition flex items-center gap-2 w-fit"
                >
                  View Complete Catalog
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellers.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        );

      case 'topics':
        return (
          <section key="topics" className="relative py-24 md:py-32 bg-[#0E0E0E] text-[#F4F2EE] border-b border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3">
                    <span>Atelier Journal</span>
                  </div>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-white font-normal leading-tight">
                    Notes from the <span className="italic font-light text-[#E8E5DF]/70">workbench.</span>
                  </h2>
                </div>
                <Link
                  to="/notebook"
                  className="text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white font-semibold transition flex items-center gap-2 w-fit"
                >
                  View All Journal Entries
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {topics.slice(0, 2).map(t => (
                  <div
                    key={t.id}
                    className="p-8 rounded-[4px] border border-white/15 bg-black/60 flex flex-col justify-between group hover:border-white/30 transition-all shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] mb-3 font-semibold">
                        <span>{t.category}</span>
                        <span className="text-white/40">{t.readTime}</span>
                      </div>
                      <h3 className="font-editorial text-2xl text-white font-normal mb-3 group-hover:text-[#D4AF37] transition">
                        {t.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#F4F2EE]/70 font-sans line-clamp-3 leading-relaxed mb-6">
                        {t.content}
                      </p>
                    </div>
                    <Link
                      to="/notebook"
                      className="text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white font-semibold transition inline-flex items-center gap-1.5"
                    >
                      Read Full Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'studio-cta':
        return (
          <BespokeCommission
            key="studio-cta"
            onOpenStudio={() => setStudioOpen(true)}
            onOpenTradeModal={() => setB2bOpen(true)}
          />
        );

      default:
        return null;
    }
  };

  // Section order including the visualizer
  const activeSections = homepageSettings.sectionsOrder.filter(
    key => homepageSettings.sectionsVisibility[key] !== false
  );

  // If 'visualizer' is not in sectionsOrder, add it after 'featured'
  const sectionsToRender = activeSections.includes('visualizer')
    ? activeSections
    : (() => {
        const copy = [...activeSections];
        const featIdx = copy.indexOf('featured');
        if (featIdx !== -1) {
          copy.splice(featIdx + 1, 0, 'visualizer');
        } else {
          copy.push('visualizer');
        }
        return copy;
      })();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#F4F2EE] selection:bg-[#D4AF37] selection:text-black">
      {/* Sophisticated Fixed Navigation */}
      <SiteHeader onOpenStudio={() => setStudioOpen(true)} />

      {/* Dynamic Editorial Sections */}
      <main className="flex-1">
        {sectionsToRender.map(key => renderSection(key))}
      </main>

      {/* Interactive Bespoke CAD Studio & Trade Modals */}
      <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />
      <B2BTradeModal open={b2bOpen} onOpenChange={setB2bOpen} />

      {/* Luxury Editorial Footer */}
      <SiteFooter />
    </div>
  );
}
