import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Sparkles, Award, ShieldCheck, CheckCircle2, Layers, Flame, Hammer, Compass, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ProductCard } from '@/components/shop/ProductCard';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { useCatalog } from '@/lib/catalogContext';
import { shapeDefinitions } from '@/lib/shapes';

export default function Home() {
  const { products, categories, homepageSettings, topics } = useCatalog();
  const featured = products.filter(p => homepageSettings.featuredProductIds.includes(p.id));
  const bestsellers = products.filter(p => p.bestseller);
  const [studioOpen, setStudioOpen] = useState(false);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <section key="hero" className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-card/30 via-background to-background">
            <div className="relative max-w-7xl mx-auto px-6 pt-10 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
              <div>
                {/* Atelier Provenance Pill */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-oxblood/5 border border-oxblood/20 text-oxblood text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-semibold mb-6"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brass" />
                  <span>Antwerp Atelier · Solid Belgian Metalcraft · Est. 2019</span>
                </motion.div>

                {/* Editorial Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="font-display text-4xl sm:text-6xl md:text-7xl leading-[0.98] mb-6 text-oxblood-deep font-semibold tracking-tight"
                >
                  Architectural metal art, <br />
                  <span className="font-serif-italic text-gradient-brass font-normal">sculptured from solid plate.</span>
                </motion.h1>

                {/* Editorial Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-base sm:text-lg text-foreground/75 max-w-xl mb-8 leading-relaxed font-sans"
                >
                  Precision sliced by 3kW nitrogen-shielded fibre laser from 3mm Belgian sheet steel and solid brass, then hand-grained and aged with archival chemical patinas in our workshop.
                </motion.p>

                {/* Action CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap gap-3.5"
                >
                  <Link 
                    to="/shop"
                    className="group inline-flex items-center gap-2.5 bg-oxblood text-ivory text-xs uppercase tracking-widest font-semibold px-7 py-4 rounded-sm hover:bg-oxblood-deep hover:shadow-luxe transition shadow-sm"
                  >
                    Explore Atelier Catalog
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <button 
                    onClick={() => setStudioOpen(true)}
                    className="group inline-flex items-center gap-2.5 border border-oxblood/40 hover:border-oxblood bg-background text-oxblood text-xs uppercase tracking-widest px-7 py-4 rounded-sm hover:bg-oxblood/5 transition font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brass" /> Launch Bespoke CAD Studio
                  </button>
                </motion.div>

                {/* Authenticity Checkpoints */}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.5 }}
                  className="mt-10 pt-8 border-t border-border/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brass shrink-0" />
                    <span>3mm Solid Plate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-brass shrink-0" />
                    <span>Signed Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-brass shrink-0" />
                    <span>Insured Transit</span>
                  </div>
                </motion.div>
              </div>

              {/* Hero Right Visual: High-Impact Framed Architectural Photograph */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, delay: 0.2 }}
                className="relative group"
              >
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border/80 shadow-luxe bg-muted/20">
                  <img 
                    src="/images/hero-penthouse-brass.jpg" 
                    alt="Bespoke brushed brass geometric wall relief in Antwerp penthouse" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Editorial Architectural Placard */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-sm bg-background/90 backdrop-blur-md border border-border/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.25em] text-brass font-bold">Commissioned Installation</div>
                      <div className="font-display text-sm font-semibold text-oxblood-deep">Nova Facet Relief · Solid Brushed Brass</div>
                    </div>
                    <div className="text-right text-[10px] text-muted-foreground font-mono">
                      Antwerp Penthouse
                    </div>
                  </div>
                </div>

                {/* Subtle decorative framing border */}
                <div className="absolute -inset-2 border border-brass/25 rounded-sm -z-10 pointer-events-none hidden sm:block" />
              </motion.div>
            </div>
          </section>
        );

      case 'manifesto':
        return (
          <section key="manifesto" className="border-b border-border/70 bg-card/30">
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Hammer,
                  title: 'Solid 3.0mm Belgian Plate',
                  body: 'We never stamp thin sheet foil. Every piece is waterjet or fibre laser cut from certified 3mm thick structural steel, solid CZ108 brass, or marine stainless.'
                },
                {
                  icon: Flame,
                  title: 'Nitrogen-Shielded Lasers',
                  body: 'Operating at 3000W with high-pressure nitrogen assist to prevent edge oxidation, maintaining mathematical 0.1mm kerf precision across intricate silhouettes.'
                },
                {
                  icon: Award,
                  title: 'Numbered Atelier Hallmark',
                  body: 'Every commission is hand-deburred, chemically patinated, and stamped with the maker’s seal, series number, and signed Certificate of Authenticity.'
                }
              ].map((item, idx) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} 
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-sm border border-oxblood/20 bg-background flex items-center justify-center flex-shrink-0 text-oxblood shadow-sm">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-oxblood-deep">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );

      case 'collections':
        return (
          <section key="collections" className="max-w-7xl mx-auto px-6 py-14 md:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brass mb-2 font-bold">Curated Catalog</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep leading-none font-semibold">
                  Atelier <span className="font-serif-italic text-gradient-brass font-normal">Collections</span>
                </h2>
              </div>
              <Link to="/shop" className="text-xs uppercase tracking-widest text-oxblood font-semibold hover:underline flex items-center gap-1">
                View All Pieces <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((c, i) => (
                <motion.div 
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} 
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link 
                    to={`/shop/${c.id}`}
                    className="group rounded-sm border border-border/70 bg-card hover:border-oxblood/40 hover:shadow-soft transition-all flex flex-col items-center justify-center gap-3 p-4 text-center aspect-[4/5]"
                  >
                    <div className="w-16 h-16 transition-transform duration-500 group-hover:scale-108">
                      <ShapeThumb shapeId={products.find(p => p.category === c.id)?.shapeId ?? 'circle'} finish="brass" className="w-full h-full drop-shadow-sm" />
                    </div>
                    <div>
                      <div className="text-xs font-display font-semibold text-oxblood-deep uppercase tracking-wider">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{c.description}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        );

      case 'featured':
        return (
          <section key="featured" className="max-w-7xl mx-auto px-6 py-10 md:py-16 border-t border-border/70">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brass mb-2 font-bold">Featured Editions</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep leading-none font-semibold">
                  Architectural <span className="font-serif-italic text-gradient-brass font-normal">Showcase</span>
                </h2>
              </div>
              <Link to="/shop" className="text-xs uppercase tracking-widest text-oxblood font-semibold hover:underline flex items-center gap-1">
                Browse Complete Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 25 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        );

      case 'story':
        return (
          <section key="story" className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/70">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} 
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-brass font-bold">The Antwerp Workshop</p>
                <h2 className="font-display text-3xl sm:text-5xl leading-tight text-oxblood-deep font-semibold">
                  The precision of light, <br />
                  <span className="font-serif-italic text-gradient-brass font-normal">the warmth of human touch.</span>
                </h2>
                <p className="text-foreground/75 leading-relaxed text-sm md:text-base font-sans">
                  Located along the historic Kloosterstraat in Antwerp, Vernox operates at the intersection of high-capacity fibre laser CAD engineering and old-world Belgian patination.
                </p>
                <p className="text-foreground/75 leading-relaxed text-sm md:text-base font-sans">
                  No factory production lines. No generic overseas imports. Every order is proofed for laser cut feasibility, kerf-compensated, cut from certified raw sheets, and dressed by our master artisans with abrasive graining and oxidation baths.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link 
                    to="/about" 
                    className="inline-flex items-center gap-2 bg-oxblood text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-sm hover:bg-oxblood-deep transition"
                  >
                    Read the Atelier Story <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link 
                    to="/notebook" 
                    className="text-xs uppercase tracking-widest text-oxblood font-semibold hover:underline"
                  >
                    View Workshop Notes →
                  </Link>
                </div>
              </motion.div>

              {/* Workshop Photography */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-sm overflow-hidden border border-border/80 shadow-luxe aspect-[4/3]"
              >
                <img 
                  src="/images/artisan-workshop.jpg" 
                  alt="Master metalworker hand-inspecting patinated brass sculpture in Antwerp"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-sm bg-background/90 backdrop-blur-md border border-border/80 text-xs">
                  <div className="text-[9px] uppercase tracking-[0.25em] text-brass font-bold">Master Finisher Marc V.</div>
                  <div className="font-serif-italic text-muted-foreground">Hand-graining 3mm brass relief prior to archival patination</div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      case 'installations':
        return (
          <section key="installations" className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/70">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brass mb-2.5 font-bold">Spatial Architecture</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep leading-none font-semibold">
                  Curated <span className="font-serif-italic text-gradient-brass font-normal">Installations</span>
                </h2>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground max-w-md mt-3 md:mt-0 font-sans">
                Each commission is scaled and weighted to harmonise with residential limestone, board-formed concrete, and private gallery interiors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Installation 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="group rounded-sm border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-luxe transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                  <img
                    src="/images/installation-round.jpg"
                    alt="Residence du Bois, Paris XVIe metal installation"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                  />
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-background/90 backdrop-blur-md rounded-sm border border-border/80 text-[10px] uppercase font-mono tracking-widest text-oxblood-deep font-semibold">
                    1,200 mm · 24.5 kg
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-brass font-bold mb-2">
                    <MapPin className="w-3 h-3 text-brass" />
                    <span>Paris XVIe · Private Penthouse</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-oxblood-deep mb-2">
                    Résidence du Bois Concentric Relief
                  </h3>
                  <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mb-6 font-sans">
                    Custom concentric rings sliced from solid 3.0mm CZ108 Belgian Brass, grain-finished by hand, mounted with 25mm rear floating standoffs over honed French limestone.
                  </p>
                  <div className="pt-4 border-t border-border/70 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Alloy</span>
                      <span className="font-semibold text-foreground">CZ108 Brass · Satin Grained</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Architecture</span>
                      <span className="font-semibold text-foreground">Atelier V. Renard</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Installation 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="group rounded-sm border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-luxe transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                  <img
                    src="/images/installation-corten.jpg"
                    alt="The Alpine Villa fireplace installation in Zermatt"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                  />
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-background/90 backdrop-blur-md rounded-sm border border-border/80 text-[10px] uppercase font-mono tracking-widest text-oxblood-deep font-semibold">
                    1,800 × 900 mm · 38.2 kg
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-brass font-bold mb-2">
                    <MapPin className="w-3 h-3 text-brass" />
                    <span>Zermatt · Swiss Alps</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-oxblood-deep mb-2">
                    The Alpine Hearth Geometric Screen
                  </h3>
                  <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mb-6 font-sans">
                    Weathered Corten steel hearth screen, laser sliced and pre-oxidized over 90 days to achieve a deep burnt-amber velvety rust patina, complementing charred timber and granite masonry.
                  </p>
                  <div className="pt-4 border-t border-border/70 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Alloy</span>
                      <span className="font-semibold text-foreground">Structural Cor-Ten Steel</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Architecture</span>
                      <span className="font-semibold text-foreground">Kohl Alpine Architecture</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );

      case 'authenticity':
        return (
          <section key="authenticity" className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/70">
            <div className="rounded-sm border border-border/80 bg-gradient-to-br from-card via-background to-card/60 p-8 sm:p-12 md:p-16 shadow-soft">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brass mb-3 font-bold">Proof of Provenance</p>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep mb-6 font-semibold leading-tight">
                    Every piece bears an <br />
                    <span className="font-serif-italic text-gradient-brass font-normal">Antwerp Atelier Hallmark.</span>
                  </h2>
                  <p className="text-foreground/75 leading-relaxed text-sm md:text-base mb-8 font-sans">
                    We do not manufacture mass consumer home decor. Every custom wall art piece commissioned through Vernox is cataloged in the Belgian Métallurgie Registry, punched with a physical master artisan hallmark on the reverse, and accompanied by our museum-grade Certificate of Authenticity.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div className="p-4 rounded-sm border border-border/70 bg-background/80">
                      <div className="flex items-center gap-2 font-display text-sm font-semibold text-oxblood-deep mb-1">
                        <Award className="w-4 h-4 text-brass" /> Reverse Plate Hallmark
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Deep stamped with the Vernox seal, edition sequence (e.g. VNX-2026-084), and alloy purity mark.
                      </p>
                    </div>

                    <div className="p-4 rounded-sm border border-border/70 bg-background/80">
                      <div className="flex items-center gap-2 font-display text-sm font-semibold text-oxblood-deep mb-1">
                        <ShieldCheck className="w-4 h-4 text-brass" /> Signed Certificate
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Letterpress printed on 300gsm mould-made cotton rag, signed by the lead laser technician and patinator.
                      </p>
                    </div>

                    <div className="p-4 rounded-sm border border-border/70 bg-background/80">
                      <div className="flex items-center gap-2 font-display text-sm font-semibold text-oxblood-deep mb-1">
                        <CheckCircle2 className="w-4 h-4 text-brass" /> 3.0mm Plate Guarantee
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Guaranteed minimum 3.0mm thickness with zero warp, zero buckling, and lifetime structural stability.
                      </p>
                    </div>

                    <div className="p-4 rounded-sm border border-border/70 bg-background/80">
                      <div className="flex items-center gap-2 font-display text-sm font-semibold text-oxblood-deep mb-1">
                        <Compass className="w-4 h-4 text-brass" /> White-Glove Crated Transit
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Shipped in foam-damped timber crates with comprehensive transit insurance to your doorstep.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate Showcase Mockup Card */}
                <div className="relative mx-auto w-full max-w-md">
                  <div className="rounded-sm border-2 border-brass/30 bg-[#fbf9f5] dark:bg-[#1f1b16] p-7 md:p-9 shadow-luxe text-oxblood-deep dark:text-ivory relative overflow-hidden">
                    {/* Watermark Crest */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-brass/10 flex items-center justify-center pointer-events-none opacity-40">
                      <span className="font-brand text-6xl tracking-widest text-brass">V</span>
                    </div>

                    {/* Certificate Top Header */}
                    <div className="border-b border-brass/25 pb-4 mb-5 text-center">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-brass font-bold mb-1">Atelier d'Art Métallique · Anvers</div>
                      <div className="font-brand text-2xl tracking-[0.2em] font-semibold text-oxblood-deep dark:text-ivory">VERNOX</div>
                      <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1 font-serif-italic">Certificat d'Authenticité</div>
                    </div>

                    {/* Certificate Body Spec */}
                    <div className="space-y-3 text-xs font-mono">
                      <div className="flex justify-between border-b border-brass/15 pb-1">
                        <span className="text-muted-foreground">Commission ID</span>
                        <span className="font-semibold">VNX-2026-COMM-0492</span>
                      </div>
                      <div className="flex justify-between border-b border-brass/15 pb-1">
                        <span className="text-muted-foreground">Certified Alloy</span>
                        <span className="font-semibold">Solid 3mm CZ108 Brass</span>
                      </div>
                      <div className="flex justify-between border-b border-brass/15 pb-1">
                        <span className="text-muted-foreground">Surface Treatment</span>
                        <span className="font-semibold">Archival French Wax Satin</span>
                      </div>
                      <div className="flex justify-between border-b border-brass/15 pb-1">
                        <span className="text-muted-foreground">Atelier Registry</span>
                        <span className="font-semibold">BE 0792.834.102 / G-44</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-muted-foreground">Laser Tolerances</span>
                        <span className="font-semibold">±0.08 mm (Nitrogen Assist)</span>
                      </div>
                    </div>

                    {/* Signatures & Seal */}
                    <div className="mt-8 pt-5 border-t border-brass/25 flex items-center justify-between">
                      <div>
                        <div className="font-serif-italic text-sm text-oxblood dark:text-brass">M. Van Der Berg</div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Master Finisher</div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-brass/50 flex flex-col items-center justify-center text-[7px] font-bold text-brass uppercase text-center leading-tight">
                        <span>Antwerp</span>
                        <span className="text-[9px]">★</span>
                        <span>Sealed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'metallurgy':
        return (
          <section key="metallurgy" className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/70">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-[0.35em] text-brass mb-2.5 font-bold">Metallurgical Archive</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep leading-none font-semibold mb-4">
                Noble <span className="font-serif-italic text-gradient-brass font-normal">Alloys & Finishes</span>
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground font-sans">
                Each alloy possesses distinct molecular properties, acoustic dampening, and chemical patination characteristics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  name: 'CZ108 Belgian Brass',
                  code: 'CuZn37 · 3.0mm',
                  color: 'from-[#c29b38] to-[#dfc06a]',
                  desc: 'Warm golden reflectivity. Milled satin directional grain treated with microcrystalline wax to preserve lustrous depth.',
                  density: '8.44 g/cm³'
                },
                {
                  name: '316L Marine Stainless',
                  code: 'X2CrNiMo · 3.0mm',
                  color: 'from-[#8e98a3] to-[#c7cfd8]',
                  desc: 'Molybdenum-stabilized surgical alloy. Total corrosion immunity, pristine non-directional orbital satin brush.',
                  density: '8.00 g/cm³'
                },
                {
                  name: 'Cor-Ten Weathering Steel',
                  code: 'EN 10025-5 · 3.0mm',
                  color: 'from-[#874621] to-[#b35928]',
                  desc: 'Develops a stable, self-regenerating oxide layer of deep terracotta, copper rust, and burnt sienna over time.',
                  density: '7.85 g/cm³'
                },
                {
                  name: 'Obsidian Velvet Black',
                  code: 'Hard Anodized · 3.0mm',
                  color: 'from-[#191d24] to-[#2a303c]',
                  desc: 'Electrochemical deep black conversion with matte micro-porous sealant. Glare-free obsidian silhouette.',
                  density: '7.82 g/cm³'
                },
                {
                  name: 'French Patina Bronze',
                  code: 'Chemical Bath · 3.0mm',
                  color: 'from-[#3a2618] to-[#5a3e2b]',
                  desc: 'Multi-layer hot chemical liver-of-sulphur immersion yielding smoky charcoal with burnished bronze undertones.',
                  density: '8.40 g/cm³'
                }
              ].map((m, idx) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-sm border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-brass/50 transition-all shadow-sm group"
                >
                  <div>
                    <div className={`h-2.5 w-full rounded-xs bg-gradient-to-r ${m.color} mb-4 border border-border/40`} />
                    <div className="text-[10px] font-mono text-brass uppercase tracking-wider mb-1">{m.code}</div>
                    <h3 className="font-display text-base font-semibold text-oxblood-deep mb-2">{m.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{m.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span>Density</span>
                    <span className="font-semibold text-foreground">{m.density}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );

      case 'bestsellers':
        return (
          <section key="bestsellers" className="max-w-7xl mx-auto px-6 py-14 md:py-20 border-t border-border/70">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brass mb-2.5 font-bold">Atelier Curations</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep leading-none font-semibold">
                  Most Requested <span className="font-serif-italic text-gradient-brass font-normal">Compositions</span>
                </h2>
              </div>
              <Link to="/shop" className="text-xs uppercase tracking-widest text-oxblood font-semibold hover:underline flex items-center gap-1">
                View Full Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        );

      case 'topics':
        return (
          <section key="topics" className="max-w-7xl mx-auto px-6 py-14 md:py-20 border-t border-border/70 bg-card/30">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brass mb-2.5 font-bold">Atelier Journal</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep leading-none font-semibold">
                  Notes from the <span className="font-serif-italic text-gradient-brass font-normal">Workbench</span>
                </h2>
              </div>
              <Link to="/notebook" className="text-xs uppercase tracking-widest text-oxblood hover:underline font-semibold flex items-center gap-1">
                View All Entries <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {topics.slice(0, 2).map((t, idx) => (
                <motion.div key={t.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-card border border-border/80 p-7 rounded-sm flex flex-col justify-between hover:border-oxblood/40 hover:shadow-soft transition-all">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-brass mb-3 font-bold">
                      <span>{t.category}</span>
                      <span className="text-muted-foreground font-mono">{t.readTime}</span>
                    </div>
                    <h3 className="font-display text-2xl mb-3 text-oxblood-deep leading-snug font-semibold">{t.title}</h3>
                    <p className="text-xs sm:text-sm text-foreground/75 line-clamp-3 mb-6 font-sans leading-relaxed">{t.content}</p>
                  </div>
                  <Link to="/notebook" className="text-xs uppercase tracking-widest text-oxblood font-semibold hover:underline inline-flex items-center gap-1.5 mt-auto">
                    Read Complete Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        );

      case 'studio-cta':
        return (
          <section key="studio-cta" className="relative overflow-hidden my-12 md:my-16">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="relative rounded-sm bg-[#12161f] border border-brass/25 p-8 sm:p-12 md:p-16 overflow-hidden shadow-luxe">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-brass rounded-full blur-3xl opacity-15" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-oxblood rounded-full blur-3xl opacity-20" />
                <div className="relative grid md:grid-cols-2 gap-10 md:gap-14 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brass/10 border border-brass/30 text-brass text-[9px] uppercase tracking-[0.3em] font-semibold mb-4">
                      <span>Vernox Bespoke Studio · Live CAM Engine</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5 text-[#fcfbfa] leading-[1.05] font-semibold">
                      Draft a piece <span className="font-serif-italic text-gradient-brass font-normal">only you</span><br /> will own.
                    </h2>
                    <p className="text-[#fcfbfa]/80 mb-8 max-w-md text-sm md:text-base leading-relaxed font-sans">
                      Select your structural bounding silhouette, dial in millimeter proportions, layer vector typography, and watch our live kerf compensation engine render your bespoke artwork in solid patinated metal.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <button onClick={() => setStudioOpen(true)}
                        className="inline-flex items-center gap-2.5 bg-brass text-[#12161f] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-brass-light hover:shadow-brass transition">
                        Launch CAD Studio <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Direct DFX & Metric SVG CAM Export Included
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                      <ShapeThumb shapeId="shield" finish="brass" className="w-64 h-64 md:w-76 md:h-76 drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)]" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader onOpenStudio={() => setStudioOpen(true)} />
      
      {homepageSettings.sectionsOrder
        .filter(key => homepageSettings.sectionsVisibility[key] !== false)
        .map(key => renderSection(key))}

      <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />
      <SiteFooter />
    </div>
  );
}
