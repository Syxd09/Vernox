import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectSpace {
  id: string;
  category: string;
  spaceType: string;
  location: string;
  city: string;
  title: string;
  artworkSpec: string;
  dimensions: string;
  weight: string;
  architect: string;
  image: string;
}

const SPACES: ProjectSpace[] = [
  {
    id: 'space-1',
    category: 'RESIDENTIAL',
    spaceType: 'PENTHOUSE LIVING ROOM',
    location: 'PARIS XVIE',
    city: 'France',
    title: 'Résidence du Bois Concentric Relief',
    artworkSpec: 'Solid 3.0mm CZ108 Brass · Directional Satin Grain',
    dimensions: '1,200 × 1,200 mm',
    weight: '24.5 kg',
    architect: 'Atelier V. Renard Interior Architecture',
    image: '/images/installation-round.jpg',
  },
  {
    id: 'space-2',
    category: 'HOSPITALITY',
    spaceType: 'ALPINE HEARTH SALON',
    location: 'ZERMATT',
    city: 'Swiss Alps',
    title: 'The Alpine Hearth Geometric Screen',
    artworkSpec: 'Cor-Ten Weathering Steel · 90-Day Natural Oxide Patina',
    dimensions: '1,800 × 900 mm',
    weight: '38.2 kg',
    architect: 'Kohl Alpine Architecture',
    image: '/images/installation-corten.jpg',
  },
  {
    id: 'space-3',
    category: 'RESIDENTIAL',
    spaceType: 'PENTHOUSE MASTER SUITE',
    location: 'ANTWERP ZUID',
    city: 'Belgium',
    title: 'Nova Facet Horizon Relief',
    artworkSpec: 'Solid Brass with 25mm Standoff Floating Mounts',
    dimensions: '1,600 × 1,000 mm',
    weight: '31.0 kg',
    architect: 'Studio De Smet Interiors',
    image: '/images/hero-penthouse-brass.jpg',
  },
  {
    id: 'space-4',
    category: 'COMMERCIAL',
    spaceType: 'EXECUTIVE ATELIER STUDY',
    location: 'BENGALURU',
    city: 'India',
    title: 'Kinetic Monolith Lattice',
    artworkSpec: 'Marine 316L Stainless Steel · Orbital Satin Etch',
    dimensions: '2,000 × 1,200 mm',
    weight: '44.8 kg',
    architect: 'Prism Architectural Design',
    image: '/images/artisan-workshop.jpg',
  },
];

export function InteriorInspiration() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section 
      id="spaces" 
      className="relative py-24 md:py-36 bg-[#0E0E0E] text-[#F4F2EE] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/5 border border-white/15 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold mb-3.5">
              <Compass className="w-3 h-3 text-[#D4AF37]" />
              <span>Spatial Case Studies</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight">
              Designed for spaces. <br />
              <span className="italic font-light text-[#E8E5DF]/70">Curated architectural installations.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#F4F2EE]/60 max-w-md font-sans leading-relaxed">
            Every commission is engineered to complement limestone walls, board-formed concrete, charred timber, and directional gallery lighting.
          </p>
        </div>

        {/* Editorial Spaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {SPACES.map((space, idx) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-[4px] border border-white/15 bg-black/60 overflow-hidden shadow-2xl flex flex-col justify-between hover:border-white/30 transition-all duration-500"
            >
              {/* Architectural Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Editorial Location Placard */}
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-semibold bg-black/70 backdrop-blur-md px-2.5 py-1 border border-white/15 w-fit">
                    {space.category} · {space.spaceType}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white font-mono flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 border border-white/15 w-fit">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    {space.location}, {space.city}
                  </span>
                </div>

                {/* Dimensions Stamp */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/15 text-[9px] font-mono tracking-widest text-[#E8E5DF]">
                  {space.dimensions} · {space.weight}
                </div>
              </div>

              {/* Space Information */}
              <div className="p-6 md:p-8 space-y-4">
                <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal leading-snug">
                  {space.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F4F2EE]/70 font-sans leading-relaxed">
                  {space.artworkSpec}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">Architecture</span>
                    <span className="text-white font-medium">{space.architect}</span>
                  </div>

                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-white uppercase tracking-wider font-semibold transition"
                  >
                    View Series
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
