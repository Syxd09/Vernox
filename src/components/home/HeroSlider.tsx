import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: string;
  image: string;
  series: string;
  location: string;
  featuredArtwork: string;
  artworkLink: string;
}

const SLIDES: Slide[] = [
  {
    id: 'slide-01',
    image: '/images/hero-nocturne-living.jpg',
    series: 'THE NOCTURNE SERIES · 2026',
    location: 'Antwerp Penthouse Residence',
    featuredArtwork: 'Abstract Horizon Impasto',
    artworkLink: '/product/abstract-horizon',
  },
  {
    id: 'slide-02',
    image: '/images/hero-art-lounge.jpg',
    series: 'THE HORIZON SALON · 2026',
    location: 'Milanese Gallery Lounge',
    featuredArtwork: 'Golden Silence & Sculptural Form',
    artworkLink: '/product/golden-silence',
  },
  {
    id: 'slide-03',
    image: '/images/hero-penthouse-brass.jpg',
    series: 'BRUTALIST RELIEF · 2026',
    location: 'Zurich Lakefront Atelier',
    featuredArtwork: 'Textured Canvas & Solid Plate',
    artworkLink: '/product/textured-canvas',
  },
  {
    id: 'slide-04',
    image: '/images/statement-piece.jpg',
    series: 'ARCHITECTURAL MONOLITH · 2026',
    location: 'Geneva Executive Residence',
    featuredArtwork: 'Contemporary Bloom & Bronze Figure',
    artworkLink: '/product/contemporary-bloom',
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export function HeroSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIdx(prev => (prev + 1) % SLIDES.length);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  // Smooth 60fps progress bar animation & timer
  useEffect(() => {
    if (isPaused) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTOPLAY_INTERVAL) {
        nextSlide();
      } else {
        requestRef.current = requestAnimationFrame(animateProgress);
      }
    };

    requestRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [currentIdx, isPaused, nextSlide]);

  const activeSlide = SLIDES[currentIdx];

  return (
    <section 
      className="relative bg-[#F8F3EA] border-b border-[#EBE4D6] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        startTimeRef.current = null;
      }}
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px] xl:min-h-[720px] items-stretch">
        
        {/* LEFT COLUMN: Editorial Typography & Navigation */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 lg:py-20 z-10">
          <div className="max-w-xl">
            
            {/* Gold Accent Hairline & Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-sans text-[#6B2732] font-semibold mb-4 sm:mb-6">
              <span className="w-8 h-[1.5px] bg-[#C6A15B]" />
              <span>CURATED CONTEMPORARY ART</span>
            </div>

            {/* Main Headline - Exact Reference Typography */}
            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] text-[#332522] font-normal leading-[1.04] tracking-tight mb-5 sm:mb-6">
              Art that<br />
              defines<br />
              your space
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-[#332522]/80 leading-relaxed font-sans max-w-lg mb-8 sm:mb-10">
              Curated wall art and statement pieces designed to bring character, warmth and sophistication to modern interiors.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-14">
              <Link
                to="/shop/wall-art"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-[2px] bg-maroon-deep hover:bg-[#531e26] text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold transition-all duration-300 shadow-xs hover:border-b-2 hover:border-[#C6A15B] text-center"
              >
                <span>SHOP WALL ART</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
              </Link>

              <Link
                to="/shop"
                className="group inline-flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-[0.22em] font-sans font-semibold text-[#332522] hover:text-maroon-deep transition-colors py-2"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Minimalist Progress Bar & Numerical Counter */}
            <div className="pt-6 border-t border-[#EBE4D6] flex items-center justify-between sm:justify-start gap-6">
              
              {/* Numerical Index (e.g. 01 · 04) */}
              <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider">
                <span className="font-semibold text-[#332522]">
                  {String(currentIdx + 1).padStart(2, '0')}
                </span>
                <span className="text-[#332522]/40">·</span>
                <span className="text-[#332522]/50">
                  {String(SLIDES.length).padStart(2, '0')}
                </span>
              </div>

              {/* Animated Gold Progress Bar */}
              <div 
                className="w-24 sm:w-36 h-[2px] bg-[#EBE4D6] rounded-full overflow-hidden relative"
                title={`${Math.round(progress)}% to next slide`}
              >
                <div 
                  className="h-full bg-[#C6A15B] transition-all duration-75 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Arrow Controls */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-full border border-[#EBE4D6] bg-white/80 hover:bg-white text-[#332522] hover:text-maroon-deep flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-full border border-[#EBE4D6] bg-white/80 hover:bg-white text-[#332522] hover:text-maroon-deep flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Full-Bleed Architectural Slider */}
        <div className="lg:col-span-6 relative overflow-hidden bg-[#EFE8DD] min-h-[420px] sm:min-h-[500px] lg:min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={activeSlide.image}
                alt={`${activeSlide.series} - ${activeSlide.location}`}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              
              {/* Subtle Ambient Grain & Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-radial from-transparent to-black/10 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Floating Subtle Series Pill Badge at Bottom-Right (Exact Reference Style) */}
          <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-20">
            <Link
              to={activeSlide.artworkLink}
              className="group/badge inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[2px] bg-white/92 hover:bg-white backdrop-blur-md border border-[#EBE4D6] shadow-xs transition-all duration-300 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] group-hover/badge:scale-125 transition-transform" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-sans text-[#332522] font-medium">
                {activeSlide.series}
              </span>
              <ArrowRight className="w-3 h-3 text-[#6B2732] opacity-0 -translate-x-1 group-hover/badge:opacity-100 group-hover/badge:translate-x-0 transition-all duration-200" />
            </Link>
          </div>

          {/* Subtle Slide Indicators at Top-Right */}
          <div className="absolute top-5 right-5 z-20 hidden sm:flex items-center gap-1.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentIdx(idx);
                  setProgress(0);
                  startTimeRef.current = null;
                }}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  currentIdx === idx
                    ? 'w-6 h-1.5 bg-[#C6A15B]'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
