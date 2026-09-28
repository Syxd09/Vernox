import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, Upload, Ruler, CheckCircle2, ShieldCheck, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onOpenStudio?: () => void;
  onOpenTradeModal?: () => void;
}

export function BespokeCommission({ onOpenStudio, onOpenTradeModal }: Props) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [alloy, setAlloy] = useState('brass');
  const [width, setWidth] = useState('1400');
  const [height, setHeight] = useState('900');
  const [notes, setNotes] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your contact email address');
      return;
    }
    setFormSubmitted(true);
    toast.success('Commission dossier submitted to our lead metal craftsman');
  };

  return (
    <section 
      id="commission" 
      className="relative py-24 md:py-32 bg-[#141518] text-[#F4F2EE] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left Editorial Narrative */}
          <div className="space-y-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-mono font-semibold mb-2">
                Private Atelier Commission
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight">
                Have a wall in mind? <br />
                <span className="italic font-light text-[#E8E5DF]/70">
                  Create a piece designed specifically for your space.
                </span>
              </h2>
            </div>

            <p className="text-sm md:text-base text-[#F4F2EE]/75 font-sans leading-relaxed max-w-xl">
              From monumental stairwell triptychs to private yacht dining reliefs, our Antwerp CAD technicians and metal finishers collaborate directly with homeowners, collectors, and interior architects.
            </p>

            {/* Commission Guarantees */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {[
                {
                  title: 'Direct Laser Kerf Proofing',
                  desc: 'We review DWG, DXF, PDF blueprints and wall photographs to calculate exact 0.1mm kerf clearances.',
                },
                {
                  title: 'Dedicated Metal Sample Swatch Box',
                  desc: 'Curated 3.0mm solid alloy swatches delivered to your address before final plate slicing commences.',
                },
                {
                  title: 'Private Stamped Provenance',
                  desc: 'Your custom piece receives a permanent registry entry and individual maker hallmark seal.',
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg text-white font-normal">{item.title}</h4>
                    <p className="text-xs text-[#F4F2EE]/60 font-sans mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {onOpenStudio && (
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="px-6 py-3.5 rounded-[2px] bg-[#FAF8F5] text-[#18181B] text-xs uppercase tracking-widest font-semibold hover:bg-white transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Compass className="w-4 h-4 text-[#C5A880]" />
                  Launch Bespoke Studio
                </button>
              )}

              {onOpenTradeModal && (
                <button
                  type="button"
                  onClick={onOpenTradeModal}
                  className="px-6 py-3.5 rounded-[2px] border border-white/25 hover:border-white text-white text-xs uppercase tracking-widest font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#C5A880]" />
                  Architectural Trade Desk
                </button>
              )}
            </div>
          </div>

          {/* Right Bespoke Commission Dossier Form */}
          <div className="rounded-[4px] border border-white/15 bg-[#1A1B1F] p-8 sm:p-10 shadow-2xl relative">
            <div className="border-b border-white/10 pb-4 mb-6">
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#C5A880] font-mono font-semibold">
                Dossier Submission
              </div>
              <h3 className="font-editorial text-2xl text-white font-normal mt-1">
                Commission Inquiry Specification
              </h3>
            </div>

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-[#C5A880] bg-[#C5A880]/10 flex items-center justify-center mx-auto text-[#C5A880]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-editorial text-3xl text-white font-normal">
                    Commission Received
                  </h4>
                  <p className="text-xs sm:text-sm text-[#F4F2EE]/70 font-sans max-w-sm mx-auto leading-relaxed">
                    Our lead laser engineer will review your dimensions and alloy request. Expect a formal dimensional proofing PDF and proforma quotation within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-[2px] border border-white/20 text-xs uppercase tracking-wider text-white hover:border-[#C5A880] cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Select Alloy */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono block mb-2 font-semibold">
                      1. Desired Metal Alloy & Finish
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'brass', name: 'CZ108 Brass' },
                        { id: 'stainless', name: '316L Stainless' },
                        { id: 'corten', name: 'Weathered Cor-Ten' },
                        { id: 'black', name: 'Velvet Obsidian' },
                        { id: 'bronze', name: 'French Patina' },
                        { id: 'custom', name: 'Bespoke Blend' },
                      ].map(a => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAlloy(a.id)}
                          className={`py-2 px-3 rounded-[2px] border text-xs text-left transition cursor-pointer ${
                            alloy === a.id
                              ? 'border-[#C5A880] bg-white/10 text-white font-semibold'
                              : 'border-white/10 text-white/60 hover:border-white/30 bg-black/40'
                          }`}
                        >
                          <span className="text-[10px] tracking-wider uppercase font-medium">{a.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions Input */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-1.5">
                        Wall Width (mm)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="e.g. 1400"
                        className="w-full bg-black/60 border border-white/15 rounded-[2px] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#C5A880] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-1.5">
                        Wall Height (mm)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 900"
                        className="w-full bg-black/60 border border-white/15 rounded-[2px] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#C5A880] focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Description / Vision */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-1.5">
                      Describe Your Space or Vision
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Living room wall behind low Italian sofa, honed French limestone background, seeking organic flowing geometry with 25mm standoffs..."
                      className="w-full bg-black/60 border border-white/15 rounded-[2px] p-3 text-xs text-white placeholder-white/20 focus:border-[#C5A880] focus:outline-hidden font-sans resize-none"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-1.5">
                      Your Email / Atelier Liaison
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="collector@residence.com"
                      className="w-full bg-black/60 border border-white/15 rounded-[2px] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#C5A880] focus:outline-hidden font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-[2px] bg-[#C5A880] hover:bg-[#D8BE9B] text-[#18181B] text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
                  >
                    Request Custom Commission Dossier
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-[10px] text-white/40 font-mono text-center pt-2 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
                    <span>Complimentary CAD Proofing · Worldwide White-Glove Dispatch</span>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
