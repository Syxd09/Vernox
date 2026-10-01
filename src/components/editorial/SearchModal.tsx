import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Compass } from 'lucide-react';
import { useCatalog } from '@/lib/catalogContext';
import { ShapeThumb } from '@/components/shop/ShapeThumb';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: Props) {
  const { products, categories, storeConfig } = useCatalog();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // parent can toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filteredProducts = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.finishes.some((f) => f.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const popularQueries = [
    'Ember Round Frame',
    'Solid Brass',
    'Corten Patina',
    'Geometric Starburst',
    'Architectural Monograms',
    'Minimal Steel Silhouette',
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0B0B]/80 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-[#111111] border border-white/10 rounded-[4px] shadow-2xl overflow-hidden noise-overlay text-[#F4F2EE] z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header / Input */}
            <div className="p-6 border-b border-white/10 flex items-center gap-4">
              <Search className="w-5 h-5 text-[#C5A880] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by artwork name, collection, metallurgy or finish..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-base sm:text-lg text-white placeholder-white/40 outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded text-white/60 hover:text-white transition"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {query.trim() === '' ? (
                /* Initial suggestions */
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono mb-3">
                      Popular Inquiries
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularQueries.map((item) => (
                        <button
                          key={item}
                          onClick={() => setQuery(item)}
                          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white transition"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono mb-3">
                      Atelier Collections
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/shop/${c.id}`}
                          onClick={onClose}
                          className="p-3 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-xs flex items-center justify-between group transition"
                        >
                          <span className="font-display font-medium text-white/90">{c.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                /* Search Results */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#C5A880] font-mono">
                    <span>Matching Artworks ({filteredProducts.length})</span>
                    <span>Antwerp Catalog</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={onClose}
                        className="p-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3.5 group transition"
                      >
                        <div className="w-14 h-14 bg-black/40 rounded p-1.5 shrink-0 flex items-center justify-center border border-white/10">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover rounded-xs"
                            />
                          ) : (
                            <ShapeThumb shapeId={p.shapeId} finish={p.finishes[0]} className="w-full h-full" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-sm font-semibold text-white group-hover:text-[#C5A880] transition truncate">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-white/50 truncate font-serif-italic">
                            {p.tagline}
                          </p>
                          <div className="text-xs font-mono text-[#C5A880] mt-1 font-semibold">
                            {storeConfig.currency}
                            {p.price.toLocaleString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* No Results */
                <div className="py-12 text-center space-y-2">
                  <p className="font-display text-lg text-white">No artworks found for "{query}"</p>
                  <p className="text-xs text-white/50 max-w-sm mx-auto">
                    Try searching for materials like "brass", "stainless", or explore our bespoke CAD studio.
                  </p>
                  <div className="pt-3">
                    <Link
                      to="/customize"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A880] hover:underline font-semibold"
                    >
                      <Compass className="w-3.5 h-3.5" /> Launch CAD Customizer
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Footer helper */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[10px] text-white/40 font-mono">
              <span>Press ESC to close</span>
              <span>Vernox Catalog Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
