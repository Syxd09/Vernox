import { shapeDefinitions } from './shapes';

export type ProductCategory = 'frames' | 'monograms' | 'silhouettes' | 'quotes' | 'geometric' | 'nature';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number; // USD
  shapeId: string; // references shapeDefinitions
  finishes: Array<'steel' | 'brass' | 'copper' | 'gold' | 'corten' | 'stainless'>;
  sizes: Array<{ label: string; widthMm: number; heightMm: number; priceDelta: number }>;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  customizable?: boolean;
}

export const categories: { id: ProductCategory; name: string; description: string }[] = [
  { id: 'frames', name: 'Frames', description: 'Sculpted metal frames for photos and prints' },
  { id: 'monograms', name: 'Monograms', description: 'Custom initials, names, and family signs' },
  { id: 'silhouettes', name: 'Silhouettes', description: 'Animal and figure cutouts' },
  { id: 'quotes', name: 'Quotes', description: 'Words that stay on the wall' },
  { id: 'geometric', name: 'Geometric', description: 'Modern shapes and patterns' },
  { id: 'nature', name: 'Nature', description: 'Botanicals, mountains, waves' },
];

const pickShape = (id: string) => shapeDefinitions.find(s => s.id === id)?.id ?? 'circle';

export const products: Product[] = [
  {
    id: 'p-01', slug: 'ember-round-frame', name: 'Ember Round Frame',
    tagline: 'Hand-brushed brass circle', category: 'frames', price: 189,
    shapeId: pickShape('circle'), finishes: ['brass', 'gold', 'copper'],
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
