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
          className="fixed inset-0 z-[9999] bg-[#6B2732] text-[#F8F3EA] flex flex-col justify-between p-8 sm:p-14 select-none cursor-pointer overflow-hidden shadow-2xl"
        >
          {/* Top Aperture Bar */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.32em] font-mono text-[#C6A15B]">
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#C6A15B] animate-spin-slow" />
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
              className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent shadow-[0_0_20px_#C6A15B] pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1px] bg-[#5A202A] border border-[#C6A15B]/30 text-[#C6A15B] text-[9px] uppercase tracking-[0.28em] font-sans">
                <Sparkles className="w-3 h-3 text-[#C6A15B]" />
                <span>Bespoke Crafting Engine</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-5xl text-[#F8F3EA] font-normal tracking-tight leading-tight">
                Calibrating Your <br />
                <span className="italic font-light text-[#C6A15B]">Architectural Canvas</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#F8F3EA]/75 font-sans max-w-md mx-auto leading-relaxed">
                Loading 1:1 metric scale, 0.1mm laser kerf offsets, and noble alloy patinas.
              </p>
            </motion.div>

            {/* Stage telemetry pill */}
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#C6A15B]/90 pt-2">
              {progress < 40 && 'Initialising Vector Geometry...'}
              {progress >= 40 && progress < 85 && 'Aligning 3.0mm Plate Kerf...'}
              {progress >= 85 && 'Atelier Workspace Ready'}
            </div>
          </div>

          {/* Bottom Telemetry & Progress Indicator */}
          <div className="flex items-end justify-between border-t border-[#C6A15B]/25 pt-5 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#F8F3EA]/60 block">
                Substrate Profiles
              </span>
              <span className="text-[11px] text-[#C6A15B] block">
                CZ108 Brass · Hot-Rolled Steel · 24K Gold Leaf
              </span>
            </div>

            <div className="text-right">
              <div className="font-editorial text-3xl sm:text-4xl text-[#F8F3EA] leading-none font-light">
                {String(Math.min(100, progress)).padStart(2, '0')}
                <span className="text-xs font-mono text-[#C6A15B] ml-1">%</span>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-[#F8F3EA]/40 block mt-1">
                Click anywhere to skip
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
