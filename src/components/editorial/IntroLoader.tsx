import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroLoader({ onComplete }: { onComplete?: () => void } = {}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const seen = sessionStorage.getItem('vernox_intro_seen');
    if (seen) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('vernox_intro_seen', 'true');
            onComplete?.();
          }, 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18) + 12;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } }}
          className="fixed inset-0 z-[100] bg-[#0B0B0B] text-[#F4F2EE] flex flex-col justify-between p-8 sm:p-12 pointer-events-none select-none noise-overlay"
        >
          {/* Top metadata */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.35em] text-[#C5A880] font-mono">
            <span>VERNOX ATELIER</span>
            <span>ANTWERP · SOLID 3.0MM METALLURGY</span>
          </div>

          {/* Center typography and artwork glimpse */}
          <div className="max-w-4xl mx-auto w-full text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-1"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 block font-sans">
                Architectural Metal Art
              </span>
              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-none">
                Art That Defines Space.
              </h1>
            </motion.div>
          </div>

          {/* Bottom ticker & stage */}
          <div className="flex items-end justify-between border-t border-white/10 pt-4 text-xs font-mono">
            <div className="text-[10px] uppercase tracking-widest text-white/60">
              {progress < 40 && 'Calibrating Laser Kerf...'}
              {progress >= 40 && progress < 80 && 'Selecting Belgian Plate...'}
              {progress >= 80 && 'Atelier Ready'}
            </div>
            <div className="text-2xl sm:text-3xl font-display font-light text-[#C5A880]">
              {String(Math.min(100, progress)).padStart(2, '0')}
              <span className="text-xs font-mono text-white/40 ml-1">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
