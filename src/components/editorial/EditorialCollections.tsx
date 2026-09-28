import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCatalog } from '@/lib/catalogContext';

export function EditorialCollections() {
  const { categories, products } = useCatalog();

  const collections = [
    {
      id: 'frames',
      title: 'Architectural Frames',
      subtitle: 'Geometric Profiles in Solid Brass',
      image: '/images/installation-round.jpg',
      aspect: 'col-span-12 lg:col-span-7 row-span-2 min-h-[500px]',
      badge: 'Signature Series',
      itemCount: products.filter(p => p.category === 'frames').length || 4,
    },
    {
      id: 'geometric',
      title: 'Geometric Wall Reliefs',
      subtitle: 'Modern Mathematical Forms',
      image: '/images/hero-penthouse-brass.jpg',
      aspect: 'col-span-12 sm:col-span-6 lg:col-span-5 min-h-[290px]',
      badge: 'Atelier Archive',
      itemCount: products.filter(p => p.category === 'geometric').length || 6,
    },
    {
      id: 'nature',
      title: 'Botanical & Coastal Cuts',
      subtitle: 'Weathered Corten & Marine Steel',
      image: '/images/installation-corten.jpg',
      aspect: 'col-span-12 sm:col-span-6 lg:col-span-5 min-h-[290px]',
      badge: 'Outdoor Rated',
      itemCount: products.filter(p => p.category === 'nature').length || 3,
    },
  ];

  return (
    <section className="bg-[#0B0B0B] text-[#F4F2EE] py-24 sm:py-32 px-6 border-b border-white/10 noise-overlay">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-mono block mb-2">
              Curated Series
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl text-white font-normal">
              Featured Collections
            </h2>
          </div>
          <Link
            to="/shop"
            data-cursor="VIEW"
            className="text-xs uppercase tracking-[0.2em] font-medium text-white/80 hover:text-[#C5A880] transition inline-flex items-center gap-2 group"
          >
            <span>View All Atelier Works</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Asymmetrical Collection Editorial Grid */}
        <div className="grid grid-cols-12 gap-6">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className={`relative group rounded-[2px] overflow-hidden border border-white/10 bg-[#111111] ${col.aspect}`}
            >
              <Link to={`/shop/${col.id}`} data-cursor="EXPLORE" className="block w-full h-full relative">
                {/* Background Image with slow zoom */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 brightness-[0.75] group-hover:brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-700" />
                </div>

                {/* Top Badge */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-mono">
                    {col.badge}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                    <span>Series {String(idx + 1).padStart(2, '0')}</span>
                    <span>{col.itemCount} Editions</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-editorial text-2xl sm:text-4xl text-white font-normal group-hover:text-[#C5A880] transition-colors duration-500">
                        {col.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 font-sans font-light mt-1">
                        {col.subtitle}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C5A880] group-hover:text-black group-hover:border-[#C5A880] transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
