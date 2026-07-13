import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Sparkles, Wrench, Mail, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { InlineStudio } from "@/components/experience/InlineStudio";
import { ShapeThumb } from "@/components/shop/ShapeThumb";

const suggestions = [
  { to: "/shop", label: "The atelier shop", desc: "Finished pieces, ready to ship", icon: Compass },
  { to: "/shop/monograms", label: "Monograms", desc: "Cut to your initials", icon: Sparkles },
  { to: "/about", label: "Our story", desc: "Antwerp, since the first cut", icon: Mail },
];

const driftShapes = ["hexagon", "arch", "circle", "star6", "octagon"];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studioOpen, setStudioOpen] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background paper-grain">
      <SiteHeader onOpenStudio={() => setStudioOpen(true)} />

      <section className="relative flex-1 overflow-hidden">
        {/* Drifting decorative shapes */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {driftShapes.map((s, i) => (
            <motion.div
              key={s}
              className="absolute opacity-[0.07]"
              style={{
                left: `${8 + i * 19}%`,
                top: `${15 + (i % 3) * 22}%`,
                width: 90 + i * 22,
                height: 90 + i * 22,
              }}
              animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 9 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              <ShapeThumb shapeId={s} finish="Oxblood" className="w-full h-full" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-[11px] uppercase tracking-[0.45em] text-brass mb-6">Error · 404 · off the bench</p>
            <h1 className="font-display text-7xl md:text-[9rem] leading-none mb-6 text-gradient-oxblood">
              Lost in <span className="font-serif-italic">transit.</span>
            </h1>
            <div className="divider-serif my-8 max-w-md mx-auto">
              <span className="text-brass text-sm tracking-widest">✦ ✦ ✦</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto font-serif-italic text-lg md:text-xl">
              This page slipped past the polishing wheel. Let's route you back to something we've actually finished — or start a new piece together.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 border border-border hover:border-oxblood px-6 py-3 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Go back
              </button>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-oxblood text-primary-foreground font-semibold px-8 py-3 rounded-full hover:shadow-luxe transition-shadow"
              >
                <Compass className="w-4 h-4" /> Browse the shop
              </Link>
              <button
                onClick={() => setStudioOpen(true)}
                className="inline-flex items-center gap-2 border border-oxblood text-oxblood hover:bg-oxblood hover:text-ivory px-8 py-3 rounded-full transition-colors"
              >
                <Wrench className="w-4 h-4" /> Open the Studio
              </button>
            </div>
          </motion.div>

          {/* Recovery suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="mt-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-oxblood/20" />
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Where were you headed?</p>
              <div className="h-px flex-1 bg-oxblood/20" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {suggestions.map(({ to, label, desc, icon: Icon }, i) => (
                <motion.div
                  key={to}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <Link
                    to={to}
                    className="group block h-full p-6 rounded-lg border border-oxblood/15 bg-card/60 backdrop-blur-sm hover:border-oxblood hover:shadow-luxe transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-oxblood/10 flex items-center justify-center text-oxblood group-hover:bg-oxblood group-hover:text-ivory transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-brass opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-display text-2xl mb-1">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <p className="mt-16 text-center text-xs text-muted-foreground/60 font-mono">
            Requested path <span className="text-oxblood/70">{location.pathname}</span>
          </p>
        </div>
      </section>

      <SiteFooter />
      <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />
    </div>
  );
};

export default NotFound;