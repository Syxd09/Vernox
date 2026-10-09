import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function PageCurtain() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(true);
  const [transitionKey, setTransitionKey] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initial page load or browser refresh
      const initialTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 750);
      return () => clearTimeout(initialTimer);
    }

    // Subsequent page navigation
    window.scrollTo(0, 0);
    setIsAnimating(true);
    setTransitionKey(prev => prev + 1);

    const navTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 700);

    return () => clearTimeout(navTimer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <motion.div
          key={`curtain-${transitionKey}`}
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 0.72,
            ease: [0.76, 0, 0.24, 1], // Classic luxury editorial cubic-bezier
          }}
          className="fixed inset-0 z-[99999] pointer-events-none select-none flex flex-col justify-end overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Main Full Curtain Panel in Deep Burgundy */}
          <div className="w-full h-full bg-burgundy flex flex-col items-center justify-center relative shadow-2xl">
            {/* Center Hallmark & Emblem */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="text-center space-y-3 px-6"
            >
              <span className="font-brand text-3xl sm:text-4xl lg:text-5xl text-cream tracking-[0.32em] font-semibold uppercase block leading-none">
                VERNOX
              </span>

              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="w-8 sm:w-12 h-[1px] bg-dusty-pink" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.38em] text-dusty-pink font-sans font-medium">
                  Atelier d'Art Métallique
                </span>
                <span className="w-8 sm:w-12 h-[1px] bg-dusty-pink" />
              </div>

              <div className="text-[8px] uppercase tracking-[0.3em] text-cream/60 font-mono pt-1">
                Contemporary Metalwork & Sculptures
              </div>
            </motion.div>

            {/* Bottom Razor-Thin Dusty Pink Accent Line */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-dusty-pink to-transparent shadow-[0_0_16px_rgba(215,167,177,0.7)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
