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
    artworkSpec: 'Solid 3.0mm CZ108 Brass · Directional Satin Grain with Archival Wax Seal',
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
    artworkSpec: 'Cor-Ten Weathering Steel · 90-Day Natural Oxide Patina on 25mm Standoffs',
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
    artworkSpec: 'Solid Brass with 25mm Standoff Floating Mounts & Ambient Shadow Relief',
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
    artworkSpec: 'Marine 316L Stainless Steel · Orbital Satin Etch on Natural Belgian Linen',
    dimensions: '2,000 × 1,200 mm',
    weight: '44.8 kg',
    architect: 'Prism Architectural Design',
    image: '/images/artisan-workshop.jpg',
  },
];

export function InteriorInspiration() {
  return (
    <section 
      id="spaces" 
      className="relative py-20 lg:py-28 bg-cream text-dark-brown border-b border-[#EBE4D6] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2.5 text-burgundy text-[10px] uppercase tracking-[0.28em] font-mono font-medium mb-3">
              <Compass className="w-3.5 h-3.5 text-gold" />
              <span>Spatial Case Studies & Provenance</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal leading-[1.12] tracking-tight">
              DESIGNED FOR <br />
              <span className="italic font-light text-burgundy">ARCHITECTURAL SPACES</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-dark-brown/75 max-w-md font-sans leading-relaxed">
            Every commission is engineered to complement limestone walls, board-formed concrete, charred timber, and directional gallery lighting.
          </p>
        </div>

        {/* Editorial Spaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {SPACES.map((space, idx) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group rounded-[2px] border border-[#EBE4D6] bg-white overflow-hidden shadow-xs flex flex-col justify-between hover:border-burgundy/40 transition-all duration-300"
            >
              {/* Architectural Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#222]">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Editorial Location Placard */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-cream font-mono font-semibold bg-dark-brown/85 backdrop-blur-xs px-2.5 py-1 border border-white/20 w-fit">
                    {space.category} · {space.spaceType}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-cream font-sans flex items-center gap-1.5 bg-dark-brown/85 backdrop-blur-xs px-2.5 py-0.5 border border-white/20 w-fit">
                    <MapPin className="w-3 h-3 text-gold" />
                    {space.location}, {space.city}
                  </span>
                </div>

                {/* Dimensions Stamp */}
                <div className="absolute bottom-4 right-4 bg-dark-brown/85 backdrop-blur-xs px-3 py-1 border border-white/20 text-[9px] font-mono tracking-wider text-cream">
                  {space.dimensions} · {space.weight}
                </div>
              </div>

              {/* Space Information */}
              <div className="p-6 sm:p-7 space-y-3.5">
                <h3 className="font-editorial text-2xl text-dark-brown font-normal leading-snug">
                  {space.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-dark-brown/75 font-sans leading-relaxed">
                  {space.artworkSpec}
                </p>

                <div className="pt-3.5 border-t border-[#F0EAE0] flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-brown/50 block font-mono">Architecture</span>
                    <span className="text-dark-brown font-medium text-xs">{space.architect}</span>
                  </div>

                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 text-xs text-burgundy hover:text-burgundy-hover uppercase tracking-[0.18em] font-semibold transition"
                  >
                    <span>View Series</span>
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
