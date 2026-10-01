import { shapeDefinitions } from './shapes';

export type ProductCategory = 'wall-art' | 'sculptures' | 'showpieces' | 'office' | 'statement' | 'frames' | 'geometric' | 'nature' | 'monograms' | 'silhouettes' | 'quotes';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number; // USD / INR base
  shapeId: string; // references shapeDefinitions
  finishes: Array<'steel' | 'brass' | 'copper' | 'gold' | 'corten' | 'stainless'>;
  sizes: Array<{ label: string; widthMm: number; heightMm: number; priceDelta: number }>;
  stock: number;
  trackInventory?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  customizable?: boolean;
  imageUrl?: string;
  lifestyleImage?: string;
  alloySpec?: string;
}

export const categories: { id: ProductCategory; name: string; description: string }[] = [
  { id: 'wall-art', name: 'Wall Art', description: 'Curated canvas paintings, textured reliefs and minimalist framed prints' },
  { id: 'sculptures', name: 'Sculptures', description: 'Modernist organic forms, bronze silhouettes, and pedestal art' },
  { id: 'statement', name: 'Statement Pieces', description: 'Dramatic architectural showpieces and focal points for modern spaces' },
  { id: 'office', name: 'Office Décor', description: 'Sophisticated desk sculptures and executive boardroom art' },
  { id: 'showpieces', name: 'Showpieces', description: 'Tabletop objects, mantle sculptures, and decorative accents' },
  { id: 'frames', name: 'Frames', description: 'Sculpted metal frames and display mounts' },
  { id: 'geometric', name: 'Geometric', description: 'Modern shapes and mathematical forms' },
  { id: 'nature', name: 'Nature', description: 'Botanicals and organic contours' },
];

const pickShape = (id: string) => shapeDefinitions.find(s => s.id === id)?.id ?? 'circle';

export const products: Product[] = [
  {
    id: 'prod-01', slug: 'abstract-horizon', name: 'Abstract Horizon',
    tagline: 'Horizontal serene textural canvas with gold leaf', category: 'wall-art', price: 240,
    shapeId: pickShape('rectangle'), finishes: ['gold', 'brass', 'steel'],
    imageUrl: '/images/prod-abstract-horizon.jpg',
    alloySpec: 'Warm Cream Impasto · Subtle Maroon Pigments & 24K Gold Line',
    stock: 12, trackInventory: true, featured: true, bestseller: true, isNew: true,
    sizes: [
      { label: 'Standard · 90 × 50 cm', widthMm: 900, heightMm: 500, priceDelta: 0 },
      { label: 'Statement · 140 × 80 cm', widthMm: 1400, heightMm: 800, priceDelta: 160 },
      { label: 'Grand · 180 × 100 cm', widthMm: 1800, heightMm: 1000, priceDelta: 320 },
    ],
    description: 'A serene horizontal composition evoking tranquil desert dawns. Layered warm cream impasto meets deep mineral maroon pigments, finished with an unbroken hand-applied gold leaf hairline in an ultra-slim oak float frame.',
  },
  {
    id: 'prod-02', slug: 'golden-silence', name: 'Golden Silence',
    tagline: 'Modernist fluid silhouette in brushed gold', category: 'sculptures', price: 310,
    shapeId: pickShape('star'), finishes: ['gold', 'brass'],
    imageUrl: '/images/prod-golden-silence.jpg',
    alloySpec: 'Cast Bronze with Hand-Brushed Matte Gold Patina & Cream Marble',
    stock: 8, trackInventory: true, featured: true, bestseller: true,
    sizes: [
      { label: 'Tabletop · 38 cm Height', widthMm: 220, heightMm: 380, priceDelta: 0 },
      { label: 'Pedestal · 60 cm Height', widthMm: 320, heightMm: 600, priceDelta: 180 },
    ],
    description: 'An elegant fluid portrait celebrating quiet introspection. Cast in noble bronze, hand-burnished to a soft satin gold sheen, and elevated on a solid honed cream marble plinth.',
  },
  {
    id: 'prod-03', slug: 'sculptural-form', name: 'Sculptural Form',
    tagline: 'Interlocking ribbon loops in dark bronze & brass', category: 'sculptures', price: 285,
    shapeId: pickShape('circle'), finishes: ['brass', 'steel', 'gold'],
    imageUrl: '/images/prod-sculptural-form.jpg',
    alloySpec: 'Hand-Milled Dark Umber Bronze & Antique Brass Bevel',
    stock: 14, trackInventory: true, featured: true, bestseller: true,
    sizes: [
      { label: 'Studio · 42 cm Height', widthMm: 360, heightMm: 420, priceDelta: 0 },
      { label: 'Monument · 65 cm Height', widthMm: 540, heightMm: 650, priceDelta: 210 },
    ],
    description: 'Dynamic continuous Möbius ribbon loops that transform under natural room sunlight. Crafted from solid heavy bronze with subtle burnished brass accents atop an ivory travertine block.',
  },
  {
    id: 'prod-04', slug: 'maroon-geometry', name: 'Maroon Geometry',
    tagline: 'Architectural quadrant harmony with gold line', category: 'wall-art', price: 195,
    shapeId: pickShape('square'), finishes: ['gold', 'steel', 'copper'],
    imageUrl: '/images/prod-maroon-geometry.jpg',
    alloySpec: 'Deep Maroon #6B2732 & Terracotta Acrylics on Linen Canvas',
    stock: 19, trackInventory: true, featured: true, bestseller: true, isNew: true,
    sizes: [
      { label: 'Gallery · 60 × 60 cm', widthMm: 600, heightMm: 600, priceDelta: 0 },
      { label: 'Statement · 90 × 90 cm', widthMm: 900, heightMm: 900, priceDelta: 130 },
      { label: 'Foyer · 120 × 120 cm', widthMm: 1200, heightMm: 1200, priceDelta: 280 },
    ],
    description: 'Precise geometric circles, arcs, and quadrants balanced in deep maroon and blush terracotta against an unbleached Belgian linen ground, articulated with a razor-thin gold leaf vector.',
  },
  {
    id: 'prod-05', slug: 'contemporary-bloom', name: 'Contemporary Bloom',
    tagline: 'Sculptural plaster petals with blush maroon tint', category: 'statement', price: 260,
    shapeId: pickShape('starburst'), finishes: ['gold', 'brass'],
    imageUrl: '/images/prod-contemporary-bloom.jpg',
    alloySpec: 'Sculptural Mineral Plaster Relief & Delicate Gold Leaf Trim',
    stock: 9, trackInventory: true, featured: true, isNew: true,
    sizes: [
      { label: 'Square · 70 × 70 cm', widthMm: 700, heightMm: 700, priceDelta: 0 },
      { label: 'Grand · 100 × 100 cm', widthMm: 1000, heightMm: 1000, priceDelta: 190 },
    ],
    description: 'A tactile relief inspired by botanical petal whorls. Hand-sculpted mineral plaster with high-relief dimensional shadows, tinted with ethereal blush maroon and gold powder contours.',
  },
  {
    id: 'prod-06', slug: 'minimal-lines', name: 'Minimal Lines',
    tagline: 'Continuous contour drawing in dark umber & gold', category: 'wall-art', price: 175,
    shapeId: pickShape('rectangle'), finishes: ['steel', 'gold'],
    imageUrl: '/images/prod-minimal-lines.jpg',
    alloySpec: 'Deep Umber Brown #332522 Ink & Gold Filament on Textured Linen',
    stock: 22, trackInventory: true, featured: true,
    sizes: [
      { label: 'Medium · 60 × 80 cm', widthMm: 600, heightMm: 800, priceDelta: 0 },
      { label: 'Large · 90 × 120 cm', widthMm: 900, heightMm: 1200, priceDelta: 140 },
    ],
    description: 'The pinnacle of minimalist restraint. An uninterrupted single-line contour drawing rendered in deep espresso brown pigment and gold leaf filaments on heavyweight cotton rag paper.',
  },
  {
    id: 'prod-07', slug: 'bronze-figure', name: 'Bronze Figure',
    tagline: 'Elongated modernist silhouette on travertine', category: 'showpieces', price: 340,
    shapeId: pickShape('shield'), finishes: ['brass', 'steel'],
    imageUrl: '/images/prod-bronze-figure.jpg',
    alloySpec: 'Heavy Lost-Wax Cast Bronze with Earth Patina & Travertine',
    stock: 6, trackInventory: true, featured: true, bestseller: true,
    sizes: [
      { label: 'Mantle · 48 cm Height', widthMm: 140, heightMm: 480, priceDelta: 0 },
      { label: 'Console · 72 cm Height', widthMm: 180, heightMm: 720, priceDelta: 240 },
    ],
    description: 'Slender, evocative human silhouette reminiscent of mid-century Italian modernist masters. Lost-wax cast in solid bronze with a tactile earthy verdigris patina on a solid travertine cube.',
  },
  {
    id: 'prod-08', slug: 'textured-canvas', name: 'Textured Canvas',
    tagline: 'Multi-layer sculptural impasto with earthen tones', category: 'statement', price: 290,
    shapeId: pickShape('circle'), finishes: ['brass', 'gold'],
    imageUrl: '/images/prod-textured-canvas.jpg',
    alloySpec: 'Three-Dimensional Radial Brass Relief & Archival Patina',
    stock: 11, trackInventory: true, featured: true,
    sizes: [
      { label: 'Round · 80 cm Diameter', widthMm: 800, heightMm: 800, priceDelta: 0 },
      { label: 'Grand · 120 cm Diameter', widthMm: 1200, heightMm: 1200, priceDelta: 260 },
    ],
    description: 'Concentric geometric relief with tactile depth. Hand-finished brass planes that float 20mm off the wall surface to produce a subtle shifting shadow ring with morning and afternoon natural light.',
  },
  {
    id: 'p-01', slug: 'ember-round-frame', name: 'Ember Round Frame',
    tagline: 'Hand-brushed brass circle', category: 'frames', price: 189,
    shapeId: pickShape('circle'), finishes: ['brass', 'gold', 'copper'],
    imageUrl: '/images/installation-round.jpg',
    alloySpec: 'Solid 3.0mm Belgian CZ108 Brass · Hand-Grained',
    stock: 14, trackInventory: true,
    sizes: [
      { label: 'Small · 30cm', widthMm: 300, heightMm: 300, priceDelta: 0 },
      { label: 'Medium · 50cm', widthMm: 500, heightMm: 500, priceDelta: 80 },
      { label: 'Large · 80cm', widthMm: 800, heightMm: 800, priceDelta: 220 },
    ],
    description: 'A hand-finished round frame with a hairline brushed texture. Suspended by hidden hardware for a floating appearance.',
    featured: true, bestseller: true, customizable: true,
  },
  {
    id: 'p-02', slug: 'atrium-square', name: 'Atrium Square',
    tagline: 'Minimal steel silhouette', category: 'frames', price: 149,
    shapeId: pickShape('square'), finishes: ['steel', 'stainless', 'corten'],
    imageUrl: '/images/installation-corten.jpg',
    alloySpec: '3.0mm Structural Steel & Weathered Corten Patina',
    stock: 8, trackInventory: true,
    sizes: [
      { label: 'Small · 30cm', widthMm: 300, heightMm: 300, priceDelta: 0 },
      { label: 'Medium · 50cm', widthMm: 500, heightMm: 500, priceDelta: 60 },
    ],
    description: 'Square-cut architectural frame in raw or blackened steel. Perfect over a mantel.',
    isNew: true, customizable: true,
  },
  {
    id: 'p-03', slug: 'nova-star', name: 'Nova Star',
    tagline: 'Five-point gilded starburst', category: 'geometric', price: 129,
    shapeId: pickShape('star'), finishes: ['gold', 'brass', 'copper'],
    imageUrl: '/images/hero-penthouse-brass.jpg',
    alloySpec: 'Solid 3.0mm Belgian Brass · 24K Gilded Relief',
    stock: 19, trackInventory: true,
    sizes: [
      { label: 'Small · 25cm', widthMm: 250, heightMm: 250, priceDelta: 0 },
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 400, priceDelta: 50 },
    ],
    description: 'A five-point starburst laser-cut from 3mm steel and finished in warm gold.',
    bestseller: true, customizable: true,
  },
  {
    id: 'p-04', slug: 'monarch-heart', name: 'Monarch Heart',
    tagline: 'Anniversary keepsake', category: 'monograms', price: 99,
    shapeId: pickShape('heart'), finishes: ['copper', 'brass', 'gold'],
    stock: 25, trackInventory: true,
    sizes: [
      { label: 'Small · 20cm', widthMm: 200, heightMm: 200, priceDelta: 0 },
      { label: 'Medium · 35cm', widthMm: 350, heightMm: 350, priceDelta: 40 },
    ],
    description: 'A softly rounded heart, ideal for engraved names or dates.',
    customizable: true,
  },
  {
    id: 'p-05', slug: 'apollo-hex', name: 'Apollo Hexagon',
    tagline: 'Hex tile modular art', category: 'geometric', price: 79,
    shapeId: pickShape('hexagon'), finishes: ['brass', 'copper', 'steel'],
    stock: 32, trackInventory: true,
    sizes: [
      { label: 'Single · 20cm', widthMm: 200, heightMm: 200, priceDelta: 0 },
      { label: 'Trio · 20cm × 3', widthMm: 600, heightMm: 200, priceDelta: 140 },
    ],
    description: 'Modular hex tiles that arrange in honeycomb patterns across a feature wall.',
    customizable: true,
  },
  {
    id: 'p-06', slug: 'compass-star8', name: 'Compass Rose',
    tagline: 'Eight-point compass', category: 'geometric', price: 159,
    shapeId: pickShape('starburst'), finishes: ['stainless', 'gold', 'steel'],
    imageUrl: '/images/hero-penthouse-brass.jpg',
    alloySpec: 'Marine-Grade 304 Stainless & Warm Gold Accent',
    stock: 12, trackInventory: true,
    sizes: [
      { label: 'Medium · 45cm', widthMm: 450, heightMm: 450, priceDelta: 0 },
      { label: 'Large · 70cm', widthMm: 700, heightMm: 700, priceDelta: 160 },
    ],
    description: 'An eight-point compass rose that anchors an entryway or study.',
    featured: true, customizable: true,
  },
  {
    id: 'p-07', slug: 'foliage-leaf', name: 'Foliage Leaf',
    tagline: 'Botanical cutout', category: 'nature', price: 119,
    shapeId: pickShape('leaf'), finishes: ['corten', 'brass', 'copper'],
    alloySpec: 'Weathering Corten Steel · Architectural Rust Patina',
    stock: 15, trackInventory: true,
    sizes: [
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 500, priceDelta: 0 },
      { label: 'Large · 60cm', widthMm: 600, heightMm: 750, priceDelta: 90 },
    ],
    description: 'A leaf silhouette in weathered corten steel that develops a rich patina.',
    isNew: true, customizable: true,
  },
  {
    id: 'p-08', slug: 'harbor-wave', name: 'Harbor Wave',
    tagline: 'Layered coastal profile', category: 'nature', price: 175,
    shapeId: pickShape('wave'), finishes: ['stainless', 'brass', 'steel'],
    imageUrl: '/images/installation-round.jpg',
    alloySpec: 'Triple Layer 3.0mm Stainless & Polished Brass',
    stock: 9, trackInventory: true,
    sizes: [
      { label: 'Medium · 60cm', widthMm: 600, heightMm: 400, priceDelta: 0 },
      { label: 'Large · 90cm', widthMm: 900, heightMm: 600, priceDelta: 210 },
    ],
    description: 'A layered wave profile — three metal planes catch light like moving water.',
    featured: true, customizable: true,
  },
  {
    id: 'p-09', slug: 'octet-frame', name: 'Octet Frame',
    tagline: 'Eight-sided display', category: 'frames', price: 199,
    shapeId: pickShape('octagon'), finishes: ['gold', 'brass', 'stainless'],
    alloySpec: 'Solid 3.0mm Belgian Brass · Mitred Bevel',
    stock: 11, trackInventory: true,
    sizes: [
      { label: 'Medium · 45cm', widthMm: 450, heightMm: 450, priceDelta: 0 },
      { label: 'Large · 70cm', widthMm: 700, heightMm: 700, priceDelta: 180 },
    ],
    description: 'An eight-sided frame with mitred inner edges. A refined alternative to round.',
    customizable: true,
  },
  {
    id: 'p-10', slug: 'aegis-shield', name: 'Aegis Shield',
    tagline: 'Family crest silhouette', category: 'monograms', price: 219,
    shapeId: pickShape('shield'), finishes: ['brass', 'steel', 'gold'],
    imageUrl: '/images/artisan-workshop.jpg',
    alloySpec: 'Solid 3.0mm Hand-Forged Steel · Atelier Hallmark Stamped',
    stock: 7, trackInventory: true,
    sizes: [
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 500, priceDelta: 0 },
      { label: 'Large · 60cm', widthMm: 600, heightMm: 750, priceDelta: 140 },
    ],
    description: 'A shield-form silhouette engraved with your family name or crest.',
    bestseller: true, customizable: true,
  },
  {
    id: 'p-11', slug: 'triad-triangle', name: 'Triad',
    tagline: 'Three points, one statement', category: 'geometric', price: 89,
    shapeId: pickShape('triangle'), finishes: ['copper', 'gold', 'steel'],
    stock: 18, trackInventory: true,
    sizes: [
      { label: 'Small · 30cm', widthMm: 300, heightMm: 300, priceDelta: 0 },
      { label: 'Medium · 50cm', widthMm: 500, heightMm: 500, priceDelta: 60 },
    ],
    description: 'A single triangle in polished copper. Understated but sharp.',
    customizable: true,
  },
  {
    id: 'p-12', slug: 'pentacle-frame', name: 'Pentacle Frame',
    tagline: 'Pentagon display', category: 'frames', price: 139,
    shapeId: pickShape('pentagon'), finishes: ['brass', 'stainless', 'gold'],
    stock: 14, trackInventory: true,
    sizes: [
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 400, priceDelta: 0 },
    ],
    description: 'A five-sided frame — an architectural take on the classic square.',
    customizable: true,
  },
];

export const getProduct = (slug: string) => products.find(p => p.slug === slug);
export const getCategory = (id: ProductCategory) => categories.find(c => c.id === id);

export const finishLabels: Record<string, { name: string; swatch: string }> = {
  steel:     { name: 'Blackened Steel', swatch: 'linear-gradient(135deg,#3a3a3a,#111)' },
  stainless: { name: 'Brushed Stainless', swatch: 'linear-gradient(135deg,#d8d8d8,#8a8a8a)' },
  aluminum:  { name: 'Aluminum',         swatch: 'linear-gradient(135deg,#c8c8c8,#7a7a7a)' },
  brass:     { name: 'Antique Brass',    swatch: 'linear-gradient(135deg,#e6c069,#8a6a2a)' },
  copper:    { name: 'Aged Copper',      swatch: 'linear-gradient(135deg,#e08a5a,#7a3a1e)' },
  gold:      { name: 'Warm Gold',        swatch: 'linear-gradient(135deg,#f5d97a,#a37c22)' },
  corten:    { name: 'Corten Patina',    swatch: 'linear-gradient(135deg,#c05a2a,#5a2010)' },
};
