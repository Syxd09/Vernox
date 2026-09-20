import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  FileCheck,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectType?: string;
}

export function B2BTradeModal({ open, onOpenChange, defaultProjectType }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: defaultProjectType || 'hospitality',
    volume: '25-50',
    alloyPreference: 'brass_cz108',
    timeline: '1-2 months',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const generatedRef = `VNX-B2B-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefId(generatedRef);

    const payload = {
      ...formData,
      refId: generatedRef,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
    };

    try {
      // 1. Save to Firestore b2b_inquiries collection
      await addDoc(collection(db, 'b2b_inquiries'), payload);
    } catch (err) {
      console.warn('Firestore B2B inquiry save fallback to local state:', err);
    }

    // 2. Backup to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('vernox-b2b-inquiries') || '[]');
      existing.unshift(payload);
      localStorage.setItem('vernox-b2b-inquiries', JSON.stringify(existing));
    } catch (e) {
      // ignore local storage errors
    }

    setSubmitting(false);
    setSubmitted(true);
    toast.success(`Trade Inquiry submitted! Ref: ${generatedRef}`);
  };

  const handleReset = () => {
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto bg-card border-border/80 p-6 sm:p-8">
        <DialogHeader className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brass/10 border border-brass/30 text-brass text-[9px] uppercase tracking-[0.25em] font-semibold w-fit">
            <Building2 className="w-3.5 h-3.5" />
            <span>Vernox Commercial & Architectural Trade Program</span>
          </div>

          <DialogTitle className="font-display text-2xl sm:text-3xl text-oxblood-deep font-semibold">
            B2B Bulk Production & Corporate Supply
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
            We partner with hospitality groups, architectural practices, real estate developers, and corporate enterprises for volume precision laser cutting in solid 3mm brass, steel, and marine stainless.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brass font-bold">
                Inquiry Received · {refId}
              </span>
              <h3 className="font-display text-2xl font-semibold text-oxblood-deep">
                Our Trade Concierge Will Connect Within 24h
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                We have logged your specifications. An assigned CAD project manager will review your drawings, prepare kerf calculations, and issue formal trade pricing with volume tier discounts.
              </p>
            </div>

            <div className="p-4 rounded-sm bg-background border border-border/70 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-semibold text-foreground">{formData.company}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Estimated Volume:</span>
                <span className="font-semibold text-foreground">{formData.volume} Units</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Primary Contact:</span>
                <span className="font-semibold text-foreground">{formData.email}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleReset}
                className="w-full sm:w-auto bg-oxblood hover:bg-oxblood-deep text-ivory text-xs uppercase tracking-widest px-6"
              >
                Done
              </Button>
              <a
                href={`mailto:concierge@vernoxatelier.com?subject=B2B%20Trade%20Inquiry%20${refId}&body=Hello%20Vernox%20Trade%20Team,%0D%0A%0D%0AI%20submitted%20the%20bulk%20supply%20inquiry%20for%20${formData.company}%20(Ref:%20${refId}).`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border px-5 py-2 rounded text-xs uppercase tracking-wider font-semibold hover:border-oxblood hover:text-oxblood transition"
              >
                <Mail className="w-3.5 h-3.5" /> Email Drawings Directly
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* Trade Advantage Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-sm bg-background/80 border border-border/70 text-xs">
              <div className="flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-brass shrink-0" />
                <div>
                  <div className="font-semibold text-oxblood-deep">Tiered Volume Pricing</div>
                  <div className="text-[10px] text-muted-foreground">15% - 40% trade margins</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-brass shrink-0" />
                <div>
                  <div className="font-semibold text-oxblood-deep">CAD & CAM Proofing</div>
                  <div className="text-[10px] text-muted-foreground">DXF/DWG kerf evaluation</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-brass shrink-0" />
                <div>
                  <div className="font-semibold text-oxblood-deep">Crated Bulk Freight</div>
                  <div className="text-[10px] text-muted-foreground">Palletized insured transit</div>
                </div>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Contact Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Marc Laurent"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Corporate / Studio Email *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="name@firm.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Company / Organization *
                </label>
                <Input
                  required
                  placeholder="e.g. Studio Renard Architecture"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Phone / WhatsApp *
                </label>
                <Input
                  required
                  placeholder="+32 ... or +91 ..."
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Project Sector
                </label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="hospitality">Hospitality & Resorts (Hotels / Bars / Lounges)</option>
                  <option value="corporate">Corporate Headquarters & Boardrooms</option>
                  <option value="real_estate">Luxury Real Estate Developments & Penthouses</option>
                  <option value="retail">Flagship Retail Chains & Showrooms</option>
                  <option value="architecture">Architectural / Interior Design Practice</option>
                  <option value="other">Bespoke Custom Commission</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Estimated Volume
                </label>
                <select
                  value={formData.volume}
                  onChange={e => setFormData({ ...formData, volume: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="10-25">10 – 25 Pieces (15% Trade Tier)</option>
                  <option value="26-50">26 – 50 Pieces (25% Trade Tier)</option>
                  <option value="51-150">51 – 150 Pieces (35% Volume Tier)</option>
                  <option value="150+">150+ Pieces (Contract Architecture Tier)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Target Alloy / Finish
                </label>
                <select
                  value={formData.alloyPreference}
                  onChange={e => setFormData({ ...formData, alloyPreference: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="brass_cz108">Solid 3.0mm Belgian CZ108 Brass</option>
                  <option value="stainless_316l">316L Marine Surgical Stainless</option>
                  <option value="corten">Cor-Ten Weathering Steel</option>
                  <option value="french_patina">Archival French Wax Chemical Patina</option>
                  <option value="mixed">Mixed Specification Across Project</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Target Handover / Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="urgent_2_weeks">Priority Track (2 – 3 Weeks)</option>
                  <option value="1-2 months">Standard Track (1 – 2 Months)</option>
                  <option value="planning_quarter">Future Phased Project (3+ Months)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Project Scope, Dimensions & CAD Details
              </label>
              <Textarea
                rows={3}
                placeholder="Describe your installation scope (e.g. 40 hotel guest suite numbers + 2 lobby wall reliefs in patinated brass, wall backing type, whether CAD cut files are ready)..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/60">
              <div className="text-[10px] text-muted-foreground font-mono">
                Direct Contact: <a href="mailto:concierge@vernoxatelier.com" className="text-oxblood underline">concierge@vernoxatelier.com</a>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-oxblood hover:bg-oxblood-deep text-ivory text-xs uppercase tracking-widest font-semibold px-7 py-3 rounded-sm shadow-sm"
              >
                {submitting ? 'Submitting Scope…' : 'Submit Trade Inquiry'}
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
