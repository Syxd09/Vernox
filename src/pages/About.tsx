import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Percent,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Download,
  Truck,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Send,
  Box,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { B2BTradeModal } from '@/components/shop/B2BTradeModal';

const PROCESS_STEPS = [
  {
    phase: 'Phase I',
    title: 'The Digital Canvas & Dynamic Kerf',
    subtitle: 'Where vector line meets engineering CAD',
    desc: 'Every commission begins with parametric vector calculation. Design geometries are fed directly into high-precision nesting software, translating architectural sketches into micro-meter laser paths with automated kerf offset compensation.',
    color: 'bg-brass/10 text-brass border-brass/30',
    detail: 'Kerf compensation is calculated dynamically down to ±0.08mm, ensuring perfect clearance for interlocking elements and standoff fixings.'
  },
  {
    phase: 'Phase II',
    title: 'Nitrogen-Shielded Fibre Laser',
    subtitle: 'Slicing 3.0mm structural steel with pure light',
    desc: 'Certified raw plate is loaded onto our dual-pallet bed. A 3000W nitrogen-assist fibre laser beam slices through raw alloy at speeds exceeding 25 m/min, achieving flawless edge perpendicularity without thermal warping.',
    color: 'bg-oxblood/10 text-oxblood border-oxblood/30',
    detail: 'High-pressure 20-bar nitrogen shielding eliminates cut edge oxidation, leaving virgin metallurgical surfaces ready for chemical bonding.'
  },
  {
    phase: 'Phase III',
    title: 'Hand Dressing & Directional Graining',
    subtitle: 'Artisanal texture crafted by human hands',
    desc: 'Every piece is hand-deburred using diamond-honed abrasive blocks. Artisans guide the plate across custom Scotch-Brite linishing belts to build a rich, uniform satin brush that catches and breaks ambient light.',
    color: 'bg-brass/10 text-brass border-brass/30',
    detail: 'Graining is applied unidirectionally parallel to the structural silhouette, accentuating clean lines and natural architectural reflectivity.'
  },
  {
    phase: 'Phase IV',
    title: 'Atelier Chemical Patination',
    subtitle: 'Historic multi-stage oxidation recipes',
    desc: 'We immerse the prepared metal into proprietary chemical oxidation baths. From smoked charcoal bronze to velvety Corten rust and radiant brushed brass, our patinas are naturally matured and sealed with museum-grade microcrystalline wax.',
    color: 'bg-oxblood/10 text-oxblood border-oxblood/30',
    detail: 'Patinas are halted with organic neutralizing agents and sealed with archival French wax, safeguarding against indoor discoloration for generations.'
  },
  {
    phase: 'Phase V',
    title: 'Numbered Seal & White-Glove Crate',
    subtitle: 'Physical hallmark & signed Certificate of Authenticity',
    desc: 'On the reverse, each piece is stamped with the Vernox seal, edition sequence, and alloy purity hallmark. Pieces are protected in Belgian tissue paper and sealed inside shock-damped timber crates.',
    color: 'bg-brass/10 text-brass border-brass/30',
    detail: 'Accompanied by a letterpress-printed Certificate of Authenticity signed by the master laser technician and patinator.'
  }
];

const B2B_SECTORS = [
  {
    title: 'Luxury Hospitality & Resorts',
    desc: 'Custom guest suite door monograms, elevator bank wayfinding, private dining lattice screens, and dramatic reception lobby sculptural reliefs.',
    badge: 'Hotels & Clubs',
    examples: '50 – 300 Units'
  },
  {
    title: 'Corporate Headquarters & Tech Campuses',
    desc: 'Precision laser-cut corporate brand crests, acoustic baffle metal overlays, executive boardroom accents, and anniversary recognition plaques.',
    badge: 'Enterprise',
    examples: '10 – 150 Units'
  },
  {
    title: 'Residential & Commercial Real Estate',
    desc: 'Bespoke apartment entryway signage, laser-cut balcony privacy grilles, exterior weathering Corten address monuments, and concierge backdrops.',
    badge: 'Developments',
    examples: '25 – 500 Units'
  },
  {
    title: 'Architecture & Interior Design Practices',
    desc: 'Turnkey fabrication partner for bespoke project specs. Direct DWG/DXF/STEP translation with volume discounts and material sample binders.',
    badge: 'Trade Studios',
    examples: 'Bespoke Batches'
  }
];

export default function About() {
  const [activeStep, setActiveStep] = useState(0);
  const [b2bOpen, setB2bOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('hospitality');
  const location = useLocation();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Collector Consultation',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.name) {
      toast.error('Please provide your name and email address.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been transmitted to our Antwerp Atelier desk.');
      setContactForm({ name: '', email: '', subject: 'Collector Consultation', message: '' });
    }, 500);
  };

  const handleOpenB2BWithSector = (sectorType: string) => {
    setSelectedProjectType(sectorType);
    setB2bOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased font-sans text-foreground">
      <SiteHeader />

      {/* LUXURY EDITORIAL HERO */}
      <section className="relative overflow-hidden border-b border-oxblood/10 py-16 md:py-24 bg-card/20">
        <div className="absolute inset-0 pointer-events-none opacity-45">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-oxblood/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brass/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-oxblood/5 border border-oxblood/20 text-oxblood text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brass" />
            <span>Antwerp Atelier · Solid Belgian Plate · Est. 2019</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl text-oxblood-deep leading-[1.05] font-semibold"
          >
            Architectural metalcraft, <br />
            <span className="font-serif-italic text-gradient-brass font-normal">patiently engineered to endure.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Located along Antwerp’s historic Kloosterstraat, Vernox operates at the meeting point of high-capacity fibre laser CNC engineering and centuries-old metallurgical patination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <a 
              href="#manifesto" 
              className="inline-flex items-center gap-2 bg-oxblood text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-sm hover:bg-oxblood-deep transition shadow-sm"
            >
              The Atelier Standard <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setB2bOpen(true)}
              className="inline-flex items-center gap-2 border border-oxblood/40 hover:border-oxblood bg-background text-oxblood text-xs uppercase tracking-widest px-6 py-3.5 rounded-sm hover:bg-oxblood/5 transition font-semibold"
            >
              <span>B2B Bulk & Corporate Supply</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* CORE PHILOSOPHY & MANIFESTO */}
      <section id="manifesto" className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-border/70">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brass font-bold">The Vernox Standard</p>
            <h2 className="font-display text-3xl sm:text-5xl text-oxblood-deep font-semibold leading-tight">
              Why we never stamp <br />
              <span className="font-serif-italic text-gradient-brass font-normal">flimsy decorative foil.</span>
            </h2>
            <p className="text-foreground/75 leading-relaxed text-sm md:text-base font-sans">
              More than 90% of commercial wall art is pressed from paper-thin 0.4mm imported sheet metal that warps under temperature swings, rattles in air currents, and deteriorates within seasons.
            </p>
            <p className="text-foreground/75 leading-relaxed text-sm md:text-base font-sans">
              Vernox was founded in response to this disposability. We work exclusively with certified <strong>3.0mm structural plate</strong>—heavy, acoustically damp, unbendable metal that hangs flat with monumental presence. Every piece is an heirloom designed to outlive the drywall behind it.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-sm border border-border/70 bg-card">
                <div className="text-oxblood font-bold text-lg">3.0 mm</div>
                <div className="text-muted-foreground text-[10px] uppercase">Solid Plate Min.</div>
              </div>
              <div className="p-3.5 rounded-sm border border-border/70 bg-card">
                <div className="text-oxblood font-bold text-lg">3000 W</div>
                <div className="text-muted-foreground text-[10px] uppercase">Nitrogen Laser</div>
              </div>
              <div className="p-3.5 rounded-sm border border-border/70 bg-card">
                <div className="text-oxblood font-bold text-lg">±0.08 mm</div>
                <div className="text-muted-foreground text-[10px] uppercase">Kerf Accuracy</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border/80 shadow-luxe bg-muted/20">
            <img 
              src="/images/artisan-workshop.jpg" 
              alt="Artisan hand-finishing solid brass wall sculpture in Antwerp"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-sm bg-background/90 backdrop-blur-md border border-border/80 text-xs">
              <div className="text-[9px] uppercase tracking-[0.25em] text-brass font-bold">Kloosterstraat Atelier, Antwerp</div>
              <div className="font-serif-italic text-muted-foreground">Hand-grain finishing of solid CZ108 Belgian brass plate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-PHASE WORKFLOW TIMELINE */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 w-full space-y-14 border-b border-border/70">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-brass font-bold">The Production Cycle</p>
          <h2 className="font-display text-3xl sm:text-4xl text-oxblood-deep font-semibold">
            Five Steps from Raw Sheet to Signed Commission
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Follow how pure architectural metal is mathematically sliced, dressed, patinated, and cataloged.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
          {/* STEP CONTROLLERS */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold mb-4">Workshop Workflow Steps</div>
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded border transition-all flex items-start gap-4 ${
                    isActive 
                      ? 'bg-card border-oxblood/30 shadow-soft ring-1 ring-oxblood/5' 
                      : 'border-border/60 hover:border-oxblood/20 bg-card/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-[2px] border border-border/80 bg-background flex items-center justify-center font-mono text-xs font-bold text-brass shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider text-brass uppercase">{step.phase}</div>
                    <div className="font-display text-lg text-oxblood-deep font-semibold mt-0.5">{step.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{step.subtitle}</div>
                  </div>
                  <div className="ml-auto mt-2 text-muted-foreground">
                    <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-oxblood' : 'opacity-20'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE DEMONSTRATOR CARD */}
          <div className="bg-card border border-border shadow-luxe rounded-sm p-6 sm:p-10 relative overflow-hidden min-h-[460px] flex flex-col justify-between noise-overlay">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-oxblood/10 text-oxblood px-2 py-0.5 rounded font-bold uppercase">
                      {PROCESS_STEPS[activeStep].phase}
                    </span>
                    <span className="text-xs text-muted-foreground font-serif-italic">Atelier Operations</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl text-oxblood-deep mt-4 font-semibold">
                    {PROCESS_STEPS[activeStep].title}
                  </h3>
                  <p className="text-sm font-semibold tracking-wider text-brass uppercase font-sans mt-1">
                    {PROCESS_STEPS[activeStep].subtitle}
                  </p>

                  <p className="text-foreground/75 mt-6 leading-relaxed text-sm sm:text-base font-sans">
                    {PROCESS_STEPS[activeStep].desc}
                  </p>
                </div>

                <div className="bg-background border border-border/80 p-4 rounded space-y-2 mt-8">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1.5 font-mono">
                    <span className="text-brass">SPECS ·</span> Workshop Specs
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                    {PROCESS_STEPS[activeStep].detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* DEDICATED B2B & BULK CORPORATE SUPPLY SECTION (#b2b) */}
      <section id="b2b" className="relative bg-card/40 py-16 md:py-24 border-b border-border/70 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {/* B2B Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brass/10 border border-brass/30 text-brass text-[9px] uppercase tracking-[0.3em] font-semibold">
                <span>Commercial & Architectural Trade Program</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-oxblood-deep font-semibold leading-tight">
                Bulk Supply & Contract Fabrication for Companies
              </h2>
              <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans">
                Vernox supplies architectural interior practices, real estate developers, luxury hoteliers, and corporate campuses worldwide. We offer progressive volume trade discounts, dedicated CAM engineering, and palletized crated logistics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => setB2bOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-oxblood hover:bg-oxblood-deep text-ivory text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-sm transition shadow-sm"
              >
                <span>Request B2B Trade Quote</span>
              </button>
              <a
                href="mailto:concierge@vernoxatelier.com?subject=B2B%20Trade%20Inquiry%20Vernox&body=Hello%20Vernox%20Trade%20Team,%0D%0A%0D%0AWe%20would%20like%20to%20inquire%20about%20a%20bulk%20architectural%20order..."
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-oxblood hover:text-oxblood bg-background text-foreground text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition font-semibold"
              >
                <Mail className="w-3.5 h-3.5" /> Direct Trade Email
              </a>
            </div>
          </div>

          {/* 4 Client Sectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {B2B_SECTORS.map((s) => (
              <div 
                key={s.title} 
                className="bg-card border border-border/80 hover:border-oxblood/40 rounded-sm p-6 flex flex-col justify-between shadow-soft hover:shadow-luxe transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-brass font-bold">
                    <span>{s.badge}</span>
                    <span className="text-muted-foreground">{s.examples}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-oxblood-deep leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => handleOpenB2BWithSector(s.badge.toLowerCase())}
                    className="text-[10px] uppercase tracking-wider text-oxblood font-semibold group-hover:underline flex items-center gap-1"
                  >
                    Inquire for {s.badge} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Volume Tiers Table */}
          <div className="rounded-sm border border-border/80 bg-background overflow-hidden shadow-soft">
            <div className="p-6 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-oxblood-deep">
                  Tiered Trade Margins & Volume Schedule
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Progressive wholesale discount tiers applicable across catalog editions and custom bespoke geometries.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-brass font-bold">
                Tax Invoicing & GST Included
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/30 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  <tr>
                    <th className="p-4 font-semibold">Tier Category</th>
                    <th className="p-4 font-semibold">Order Scale</th>
                    <th className="p-4 font-semibold">Trade Discount</th>
                    <th className="p-4 font-semibold">Engineering & CAM</th>
                    <th className="p-4 font-semibold">Packaging & Logistics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Studio Tier</td>
                    <td className="p-4 font-mono text-muted-foreground">10 – 25 Pieces</td>
                    <td className="p-4 font-semibold text-oxblood">15% Margin</td>
                    <td className="p-4 text-muted-foreground">Digital Vector Proofing</td>
                    <td className="p-4 text-muted-foreground">Insured White-Glove Crates</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Commercial Project Tier</td>
                    <td className="p-4 font-mono text-muted-foreground">26 – 50 Pieces</td>
                    <td className="p-4 font-semibold text-oxblood">25% Margin</td>
                    <td className="p-4 text-muted-foreground">Custom Kerf & Standoff Specs</td>
                    <td className="p-4 text-muted-foreground">Numbered Plates + Drill Templates</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Volume Contract Tier</td>
                    <td className="p-4 font-mono text-muted-foreground">51 – 150 Pieces</td>
                    <td className="p-4 font-semibold text-oxblood">35% Margin</td>
                    <td className="p-4 text-muted-foreground">Dedicated CAD Project Engineer</td>
                    <td className="p-4 text-muted-foreground">Timber Palletized Crated Freight</td>
                  </tr>
                  <tr className="bg-oxblood/5">
                    <td className="p-4 font-semibold text-oxblood-deep">Enterprise Master Contract</td>
                    <td className="p-4 font-mono text-oxblood font-bold">150+ Pieces</td>
                    <td className="p-4 font-bold text-oxblood-deep">Custom Bulk Contract (Up to 45%)</td>
                    <td className="p-4 text-oxblood-deep font-semibold">Full CNC Toolpathing & Prototyping</td>
                    <td className="p-4 text-oxblood-deep font-semibold">Phased Site Staging & Global Transit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Concierge Contact Strip */}
          <div className="p-6 rounded-sm border border-border/80 bg-card flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-brass font-bold">
                Direct Architectural Trade Desk
              </div>
              <div className="font-display text-lg text-oxblood-deep font-semibold">
                Have Architectural Drawings Ready for Estimation?
              </div>
              <p className="text-xs text-muted-foreground">
                Submit DXF, DWG, STEP, or PDF files. Our laser CAM specialists issue quotes within 24 hours.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setB2bOpen(true)}
                className="bg-oxblood hover:bg-oxblood-deep text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm transition shadow-sm"
              >
                Launch Trade Form
              </button>
              <a
                href="mailto:concierge@vernoxatelier.com"
                className="inline-flex items-center gap-2 border border-border text-foreground hover:text-oxblood hover:border-oxblood px-5 py-3 rounded-sm text-xs uppercase tracking-wider font-semibold transition"
              >
                <Mail className="w-3.5 h-3.5" /> Email Drawings
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* METALLIC FINISHES PREVIEW SYSTEM */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-8">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-brass font-bold">Atelier Finishes</p>
          <h2 className="font-display text-3xl sm:text-4xl text-oxblood-deep font-semibold">
            Interactive Metallurgy Display
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Hover and move your cursor over each plate to watch how ambient light reflections and chamfer bevels react in real-time.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: 'brass', label: 'Patinated Brass', desc: 'Deep brass color stops with aged oxblood traces' },
            { id: 'copper', label: 'Warm Copper', desc: 'Soft rose glow with high-contrast edge shading' },
            { id: 'gold', label: 'Atelier Gold', desc: 'Brilliant mirror reflection with delicate warm tones' },
            { id: 'corten', label: 'Corten Steel', desc: 'Velvet rusty oxide texture with deep earth tones' }
          ].map(f => (
            <div key={f.id} className="bg-card border border-border/70 p-4 rounded flex flex-col items-center justify-between text-center gap-4 hover:border-oxblood/30 transition-all shadow-soft group">
              <div className="w-24 h-24 sm:w-28 sm:h-28">
                <ShapeThumb shapeId="shield" finish={f.id} className="w-full h-full" />
              </div>
              <div>
                <div className="text-xs font-semibold text-oxblood-deep uppercase tracking-wider">{f.label}</div>
                <div className="text-[10px] text-muted-foreground mt-1 max-w-[150px] mx-auto leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 01. SHIPPING & WHITE-GLOVE CRATING */}
      <section id="shipping" className="border-t border-border/70 py-16 md:py-24 max-w-6xl mx-auto px-6 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-burgundy/10 border border-burgundy/25 text-burgundy text-[9px] uppercase tracking-[0.28em] font-mono font-medium">
            <Truck className="w-3.5 h-3.5 text-gold" />
            <span>White-Glove Timber Crating & Transit</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-dark-brown font-normal tracking-tight">
            Engineered to Arrive in Flawless Condition
          </h2>
          <p className="text-xs sm:text-sm text-dark-brown/70 max-w-xl mx-auto font-sans leading-relaxed">
            Every Vernox commission leaves our Antwerp atelier encased in reinforced Baltic birch timber framing. We never ship in single-wall cardboard or flimsy bubble wrap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border/80 p-6 rounded-[2px] space-y-3">
            <div className="w-10 h-10 rounded-[2px] bg-burgundy/10 text-burgundy flex items-center justify-center">
              <Box className="w-5 h-5 text-burgundy" />
            </div>
            <h4 className="font-editorial text-lg text-dark-brown font-medium">
              Reinforced Timber Crates
            </h4>
            <p className="text-xs text-dark-brown/70 leading-relaxed font-sans">
              Baltic birch and pine framework cushioned with 30mm high-density polyethylene foam routed to the exact architectural perimeter of the piece.
            </p>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-[2px] space-y-3">
            <div className="w-10 h-10 rounded-[2px] bg-burgundy/10 text-burgundy flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-burgundy" />
            </div>
            <h4 className="font-editorial text-lg text-dark-brown font-medium">
              100% Insured Worldwide
            </h4>
            <p className="text-xs text-dark-brown/70 leading-relaxed font-sans">
              Every commission travels via DHL Express or FedEx Freight with full replacement value insurance and real-time GPS tracking dispatched within 24 hours of dispatch.
            </p>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-[2px] space-y-3">
            <div className="w-10 h-10 rounded-[2px] bg-burgundy/10 text-burgundy flex items-center justify-center">
              <Clock className="w-5 h-5 text-burgundy" />
            </div>
            <h4 className="font-editorial text-lg text-dark-brown font-medium">
              Estimated Transit Times
            </h4>
            <div className="text-xs text-dark-brown/70 leading-relaxed font-sans space-y-1">
              <div><strong className="text-dark-brown font-semibold">Europe & UK:</strong> 3 – 5 Business Days</div>
              <div><strong className="text-dark-brown font-semibold">North America:</strong> 4 – 7 Business Days</div>
              <div><strong className="text-dark-brown font-semibold">Worldwide:</strong> 6 – 9 Business Days</div>
            </div>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-[2px] space-y-3">
            <div className="w-10 h-10 rounded-[2px] bg-burgundy/10 text-burgundy flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-burgundy" />
            </div>
            <h4 className="font-editorial text-lg text-dark-brown font-medium">
              Mounting Kit Included
            </h4>
            <p className="text-xs text-dark-brown/70 leading-relaxed font-sans">
              Each crate contains solid brass/stainless 20–25mm standoff hardware, Fischer DuoPower wall anchors, architectural screws, and a 1:1 scale paper template.
            </p>
          </div>
        </div>
      </section>

      {/* 02. RETURNS & GUARANTEE */}
      <section id="returns" className="border-t border-border/70 py-16 md:py-24 bg-[#FAF8F5] scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-burgundy/10 border border-burgundy/25 text-burgundy text-[9px] uppercase tracking-[0.28em] font-mono font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-gold" />
              <span>Collector Peace of Mind</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-dark-brown font-normal tracking-tight">
              The 30-Day Atelier Return Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-dark-brown/70 max-w-xl mx-auto font-sans leading-relaxed">
              We stand behind every cut, grain, and patina. If a piece does not achieve perfect harmony in your interior, we provide seamless return and replacement protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border/80 p-6 sm:p-7 rounded-[2px] space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-burgundy font-semibold">
                Protocol 01
              </div>
              <h4 className="font-editorial text-xl text-dark-brown font-medium">
                30-Day Gallery Return Window
              </h4>
              <p className="text-xs text-dark-brown/75 leading-relaxed font-sans">
                Notify our concierge desk within 30 days of receiving your crate. Artwork must be in original condition with its signed Certificate of Authenticity.
              </p>
            </div>

            <div className="bg-white border border-border/80 p-6 sm:p-7 rounded-[2px] space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-burgundy font-semibold">
                Protocol 02
              </div>
              <h4 className="font-editorial text-xl text-dark-brown font-medium">
                Zero-Friction Damage Replacement
              </h4>
              <p className="text-xs text-dark-brown/75 leading-relaxed font-sans">
                Should external transit impact compromise your crate, photograph the damage upon arrival. We dispatch an immediate priority remake at zero additional cost.
              </p>
            </div>

            <div className="bg-white border border-border/80 p-6 sm:p-7 rounded-[2px] space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-burgundy font-semibold">
                Protocol 03
              </div>
              <h4 className="font-editorial text-xl text-dark-brown font-medium">
                Prepaid Return Freight
              </h4>
              <p className="text-xs text-dark-brown/75 leading-relaxed font-sans">
                Our concierge desk generates insured return bills of lading and arranges courier collection directly from your residence or design studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03. FAQS ACCORDION */}
      <section id="faqs" className="border-t border-border/70 py-16 md:py-24 max-w-4xl mx-auto px-6 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-burgundy/10 border border-burgundy/25 text-burgundy text-[9px] uppercase tracking-[0.28em] font-mono font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-gold" />
            <span>Collector & Architectural Care</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-dark-brown font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-dark-brown/70 max-w-lg mx-auto font-sans leading-relaxed">
            Essential specifications regarding installation, wall load capacities, metallurgy maintenance, and bespoke commissions.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How are Vernox artworks mounted to the wall? Are wall anchors included?',
              a: 'Every piece arrives with concealed standoff mounts or flush keyhole brackets in solid brass/stainless steel that project the piece 20–25mm from the wall. This projection creates architectural relief shadow lines under ambient light. Every crate includes Fischer DuoPower universal anchors (drywall, masonry, concrete) and a full 1:1 scale paper template for pinpoint drill placement.'
            },
            {
              q: 'What is the weight of a typical 3.0mm solid plate piece? Will my drywall support it?',
              a: 'Our solid Belgian plates weigh approximately 24 kg/m² (a 60×60 cm piece is ~8.5 kg; 90×90 cm is ~19 kg). Fischer DuoPower anchors safely support up to 35 kg per anchor point in standard 12.5mm drywall. For large statement formats exceeding 100 cm, anchoring into studs or masonry provides monumental stability.'
            },
            {
              q: 'Can Vernox artworks be hung outdoors or in humid spa/bathroom environments?',
              a: 'Yes, particularly our 316L Marine Stainless Steel and Cor-Ten Weathering Steel collections. 316L contains 2.5% molybdenum, preventing saltwater and chloride corrosion. Cor-Ten develops a dense, protective oxide skin that shields the core. Architectural Brass and patinated steel are sealed with museum-grade French microcrystalline wax and are best suited for interior environments.'
            },
            {
              q: 'How do I clean and maintain the metal patina over time?',
              a: 'Dust gently with a clean, dry microfiber cloth. Never use household ammonia, abrasive bleach, or acidic solvent sprays. An application of museum-grade microcrystalline wax every 3–5 years will maintain the rich satin luster and tactile depth for generations.'
            },
            {
              q: 'Can you fabricate custom dimensions, corporate logos, or bespoke CAD geometries?',
              a: 'Yes. Our Antwerp atelier translates CAD, DXF, DWG, STEP, and vector artwork into physical plate. You can design in our interactive online Crafting Studio or submit project files directly to our Architectural Trade Desk for an estimate within 24 hours.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={faq.q}
                className="border border-border/80 bg-card rounded-[2px] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <span className="font-editorial text-lg sm:text-xl text-dark-brown font-medium leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-burgundy shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-[13px] text-dark-brown/80 font-sans leading-relaxed border-t border-border/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 04. CONTACT STUDIO CONCIERGE */}
      <section id="contact" className="border-t border-border/70 py-16 md:py-24 bg-[#FAF8F5] scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-burgundy/10 border border-burgundy/25 text-burgundy text-[9px] uppercase tracking-[0.28em] font-mono font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-gold" />
              <span>Direct Studio Access</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-dark-brown font-normal tracking-tight">
              Connect with Our Antwerp Atelier
            </h2>
            <p className="text-xs sm:text-sm text-dark-brown/70 max-w-lg mx-auto font-sans leading-relaxed">
              Whether curating a residence, verifying mounting requirements, or commissioning a bespoke piece, our studio concierges are at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Studio Coordinates */}
            <div className="lg:col-span-5 space-y-8 bg-white border border-border/80 p-8 sm:p-10 rounded-[2px] shadow-xs">
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-[0.26em] font-mono text-burgundy font-semibold">
                  Atelier Address
                </div>
                <div className="font-editorial text-xl text-dark-brown font-normal">
                  Vernox Métallique Atelier
                </div>
                <p className="text-xs text-dark-brown/75 font-sans leading-relaxed">
                  Kloosterstraat 44<br />
                  2000 Antwerp, Belgium
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-border/60 text-xs font-sans">
                <div className="flex items-center gap-3 text-dark-brown/80">
                  <Phone className="w-4 h-4 text-burgundy shrink-0" />
                  <span>+32 (0)3 289 44 10</span>
                </div>
                <div className="flex items-center gap-3 text-dark-brown/80">
                  <Mail className="w-4 h-4 text-burgundy shrink-0" />
                  <span>concierge@vernoxatelier.com</span>
                </div>
                <div className="flex items-center gap-3 text-dark-brown/80">
                  <Clock className="w-4 h-4 text-burgundy shrink-0" />
                  <span>Mon – Fri: 09:00 – 18:00 CET · Private Sat Viewings</span>
                </div>
              </div>

              <div className="p-4 rounded-[2px] bg-cream/70 border border-[#EBE4D6] space-y-1 text-xs font-sans">
                <div className="font-semibold text-dark-brown text-[11px] uppercase tracking-wider">
                  Private Gallery Consultations
                </div>
                <p className="text-[11px] text-dark-brown/70 leading-relaxed">
                  Collectors and interior architects visiting Antwerp are invited to schedule an appointment for tactile metal alloy sampling and studio visits.
                </p>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="lg:col-span-7 bg-white border border-border/80 p-8 sm:p-10 rounded-[2px] shadow-xs">
              <h3 className="font-editorial text-2xl text-dark-brown font-normal mb-2">
                Send an Atelier Inquiry
              </h3>
              <p className="text-xs text-dark-brown/70 font-sans mb-6">
                Our design engineers and curatorial directors respond within one business day.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-dark-brown/70 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Marc Van Hout"
                      className="w-full px-3.5 py-2.5 rounded-[2px] border border-border text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-burgundy text-dark-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-dark-brown/70 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. marc@studio.com"
                      className="w-full px-3.5 py-2.5 rounded-[2px] border border-border text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-burgundy text-dark-brown"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-dark-brown/70 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[2px] border border-border text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-burgundy text-dark-brown"
                  >
                    <option value="Collector Consultation">Collector Art Consultation</option>
                    <option value="Custom Sizing / CAD">Custom Sizing or CAD Request</option>
                    <option value="Order Tracking & Logistics">Order Tracking & White-Glove Crate Delivery</option>
                    <option value="Architectural Trade / B2B">Architectural Trade & Hospitality Specifications</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-dark-brown/70 mb-1.5">
                    Your Message / Project Specifications
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your space, dimensions, or specific inquiries..."
                    className="w-full px-3.5 py-2.5 rounded-[2px] border border-border text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-burgundy text-dark-brown leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[2px] bg-burgundy hover:bg-burgundy-hover text-cream text-xs uppercase tracking-[0.2em] font-sans font-semibold transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Transmit Message to Atelier'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-6xl mx-auto px-6 pb-20 w-full">
        <div className="bg-oxblood-deep rounded-sm p-8 sm:p-14 text-center text-ivory space-y-6 relative overflow-hidden noise-overlay">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-brass rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-oxblood rounded-full blur-3xl opacity-30" />
          
          <div className="max-w-xl mx-auto space-y-6 relative">
            <h3 className="font-display text-3xl sm:text-4xl text-gradient-brass font-semibold">
              Ready to commission for your project?
            </h3>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans">
              Whether building bespoke architectural signage, outfitting a luxury hotel suite wing, or designing a single signature wall relief, Vernox is ready to engineer your vision.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setB2bOpen(true)}
                className="inline-flex items-center gap-2 bg-brass text-oxblood-deep hover:bg-ivory hover:text-oxblood font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition shadow-soft"
              >
                <span>B2B Bulk Inquiry</span>
              </button>
              <Link 
                to="/customize" 
                className="inline-flex items-center gap-2 border border-ivory/30 hover:border-ivory text-ivory hover:bg-ivory/10 font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-sm transition"
              >
                Launch CAD Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <B2BTradeModal
        open={b2bOpen}
        onOpenChange={setB2bOpen}
        defaultProjectType={selectedProjectType}
      />
      <SiteFooter />
    </div>
  );
}