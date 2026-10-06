import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Sliders } from 'lucide-react';

interface StudioOpeningAnimationProps {
  onComplete?: () => void;
}

export function StudioOpeningAnimation({ onComplete }: StudioOpeningAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fast high-precision metric progression from 0 to 100 in ~600ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 22) + 15;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="studio-opening-aperture"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          onClick={handleSkip}
          className="fixed inset-0 z-[9999] bg-burgundy text-cream flex flex-col justify-between p-8 sm:p-14 select-none cursor-pointer overflow-hidden shadow-2xl"
        >
          {/* Top Aperture Bar */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.32em] font-mono text-dusty-pink">
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-dusty-pink animate-spin-slow" />
              <span>Vernox Atelier CAD/CAM</span>
            </span>
            <span>Antwerp Precision Metallurgy</span>
          </div>

          {/* Center Cinematic Calibration Visual */}
          <div className="max-w-2xl mx-auto w-full text-center space-y-6 relative py-12">
            {/* Animated Laser Scanning Line sweeping across */}
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: ['0%', '100%', '50%'] }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-dusty-pink to-transparent shadow-[0_0_20px_var(--dusty-pink)] pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-burgundy-hover border border-dusty-pink/30 text-dusty-pink text-[9px] uppercase tracking-[0.28em] font-sans">
                <Sparkles className="w-3 h-3 text-dusty-pink" />
                <span>Bespoke Crafting Engine</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-5xl text-cream font-normal tracking-tight leading-tight">
                Calibrating Your <br />
                <span className="italic font-light text-dusty-pink">Architectural Canvas</span>
              </h2>

              <p className="text-xs sm:text-sm text-cream/75 font-sans max-w-md mx-auto leading-relaxed">
                Loading 1:1 metric scale, 0.1mm laser kerf offsets, and noble alloy patinas.
              </p>
            </motion.div>

            {/* Stage telemetry pill */}
            <div className="text-[10px] uppercase font-mono tracking-widest text-dusty-pink/90 pt-2">
              {progress < 40 && 'Initialising Vector Geometry...'}
              {progress >= 40 && progress < 85 && 'Aligning 3.0mm Plate Kerf...'}
              {progress >= 85 && 'Atelier Workspace Ready'}
            </div>
          </div>

          {/* Bottom Telemetry & Progress Indicator */}
          <div className="flex items-end justify-between border-t border-dusty-pink/25 pt-5 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.24em] text-cream/60 block">
                Substrate Profiles
              </span>
              <span className="text-[11px] text-dusty-pink block">
                CZ108 Brass · Hot-Rolled Steel · 24K Gold Leaf
              </span>
            </div>

            <div className="text-right">
              <div className="font-editorial text-3xl sm:text-4xl text-cream leading-none font-light">
                {String(Math.min(100, progress)).padStart(2, '0')}
                <span className="text-xs font-mono text-dusty-pink ml-1">%</span>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-cream/40 block mt-1">
                Click anywhere to skip
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
