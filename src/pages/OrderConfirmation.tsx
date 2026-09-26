import { useParams, Link } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { useCatalog } from '@/lib/catalogContext';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { 
  CheckCircle2, 
  Award, 
  Printer, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  FileText, 
  Hammer, 
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, storeConfig } = useCatalog();
  const order = orders.find(o => o.id === orderId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-oxblood/80 selection:text-ivory">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full flex-1 space-y-10">
        {/* SUCCESS HERO BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-oxblood/10 border border-oxblood/20 text-oxblood mx-auto flex items-center justify-center shadow-soft">
            <CheckCircle2 className="w-8 h-8 text-brass" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brass font-bold">
              Commission Authenticated · Antwerp Atelier
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-oxblood-deep font-semibold">
              Thank You for Your Commission.
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm font-serif-italic max-w-lg mx-auto leading-relaxed">
              Your piece has been queued for CAM toolpath precision and fiber laser cutting from solid 3.0mm Belgian metallurgical plate.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border/80 text-xs font-mono">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-bold text-oxblood">{orderId || `VNX-${Date.now().toString().slice(-6)}`}</span>
          </div>
        </motion.div>

        {/* 4-STAGE ATELIER CRAFTING PIPELINE */}
        <div className="bg-card border border-border/80 rounded-lg p-6 sm:p-8 noise-overlay shadow-soft space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-oxblood-deep font-semibold">4-Stage Atelier Crafting Pipeline</h2>
            <span className="text-[10px] text-brass uppercase font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Est. Dispatch: 5-7 Business Days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {[
              {
                step: '01',
                title: 'CAM Nesting',
                desc: 'Digital toolpath optimization & sheet allocation',
                status: 'Complete',
                icon: FileText,
                done: true
              },
              {
                step: '02',
                title: 'Laser Slicing',
                desc: 'Nitrogen-assist fiber laser cut to ±0.05mm',
                status: 'In Progress',
                icon: Sparkles,
                current: true
              },
              {
                step: '03',
                title: 'Hand Patina',
                desc: 'Deburring, hand brushing & surface passivation',
                status: 'Scheduled',
                icon: Hammer,
                done: false
              },
              {
                step: '04',
                title: 'Archival Crate',
                desc: 'Zero-deflection timber box & DHL dispatch',
                status: 'Upcoming',
                icon: PackageCheck,
                done: false
              },
            ].map(stage => {
              const StageIcon = stage.icon;
              return (
                <div 
                  key={stage.step}
                  className={`p-4 rounded border flex flex-col justify-between space-y-3 ${
                    stage.done 
                      ? 'border-emerald-500/30 bg-emerald-500/5' 
                      : stage.current 
                        ? 'border-oxblood bg-oxblood/5 ring-1 ring-oxblood/10' 
                        : 'border-border/60 bg-background/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brass">{stage.step}</span>
                    <span className={`text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                      stage.done 
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' 
                        : stage.current 
                          ? 'bg-oxblood text-ivory' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {stage.status}
                    </span>
                  </div>

                  <div>
                    <div className="font-display text-sm font-semibold text-oxblood-deep flex items-center gap-1.5">
                      <StageIcon className="w-3.5 h-3.5 text-brass" />
                      {stage.title}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORDER DETAILS RECEIPT (PRINTABLE) */}
        {order && (
          <div className="bg-card border border-border/80 rounded-lg p-6 sm:p-8 noise-overlay shadow-luxe space-y-6 print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div>
                <span className="font-brand text-xl font-bold tracking-[0.2em] text-oxblood-deep uppercase">
                  VERNOX
                </span>
                <p className="text-[9px] uppercase tracking-widest text-brass font-semibold">
                  Atelier Certificate of Authenticity & Provenance
                </p>
              </div>
              <button 
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-oxblood font-semibold border border-border px-3 py-1.5 rounded transition print:hidden"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Provenance</span>
              </button>
            </div>

            {/* Items Ordered List */}
            <div className="divide-y divide-border/50">
              {order.items.map(item => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-background border border-border rounded p-1.5 shrink-0 flex items-center justify-center">
                    {item.customDesignThumb ? (
                      <img src={item.customDesignThumb} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <ShapeThumb shapeId={item.shapeId} finish={item.finish} className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base font-semibold text-oxblood-deep">{item.productName}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {item.finish} · {item.sizeLabel} · Solid 3.0mm Belgian Plate
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-mono font-bold text-foreground">
                      {storeConfig.currency}{(item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground text-[10px]">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary & Destination */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border/70 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Destination Recipient
                </div>
                <div className="font-semibold text-oxblood-deep">{order.shippingName}</div>
                <div className="text-muted-foreground leading-relaxed mt-0.5">
                  {order.shippingAddress}, {order.shippingCity} {order.shippingZip}, {order.shippingCountry}
                </div>
                <div className="text-[11px] text-brass mt-1 font-mono">{order.email}</div>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Financial Settlement
                </div>
                <div className="flex sm:justify-end gap-3 text-muted-foreground">
                  <span>Archival Crated Transit:</span>
                  <span className="font-semibold text-foreground">Insured (Complimentary)</span>
                </div>
                <div className="flex sm:justify-end gap-3 text-sm font-bold text-oxblood pt-1">
                  <span>Total Settled:</span>
                  <span className="font-mono text-base">{storeConfig.currency}{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Hallmark Assurance */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brass" />
                <span>Backed by 10-Year Weathering & Anti-Corrosion Warranty</span>
              </span>
              <span className="font-mono uppercase text-[10px] text-brass">Antwerp Guild Hallmark #4419</span>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
          <Link 
            to="/shop" 
            className="w-full sm:w-auto border border-oxblood/40 hover:border-oxblood text-oxblood text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-full hover:bg-oxblood/5 transition text-center"
          >
            Explore Other Collections
          </Link>
          <Link 
            to="/account" 
            className="w-full sm:w-auto bg-gradient-oxblood hover:bg-oxblood-deep text-primary-foreground text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-full hover:shadow-luxe transition text-center flex items-center justify-center gap-2"
          >
            View Commission in Atelier Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}