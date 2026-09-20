/**
 * Server-Authoritative Pricing Engine
 * Calculates deterministic pricing for standard catalog items and custom CAD/CAM pieces
 */

export interface PricingLineItem {
  productId?: string;
  productSlug?: string;
  shapeId?: string;
  widthMm?: number;
  heightMm?: number;
  finish?: string;
  quantity: number;
  customDesignRef?: string;
}

export interface CalculatedLineItem {
  productId?: string;
  productSlug?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CalculatedPricingResult {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  amountInSubunits: number; // Cents or Paise (amount * 100)
  items: CalculatedLineItem[];
}

interface CatalogProductPricing {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  sizes: Array<{ label: string; widthMm: number; heightMm: number; priceDelta: number }>;
}

export const CATALOG_PRODUCTS: Record<string, CatalogProductPricing> = {
  'p-01': {
    id: 'p-01', slug: 'ember-round-frame', name: 'Ember Round Frame', basePrice: 189,
    sizes: [
      { label: 'Small · 30cm', widthMm: 300, heightMm: 300, priceDelta: 0 },
      { label: 'Medium · 50cm', widthMm: 500, heightMm: 500, priceDelta: 80 },
      { label: 'Large · 80cm', widthMm: 800, heightMm: 800, priceDelta: 220 },
    ],
  },
  'p-02': {
    id: 'p-02', slug: 'atrium-square', name: 'Atrium Square', basePrice: 149,
    sizes: [
      { label: 'Small · 30cm', widthMm: 300, heightMm: 300, priceDelta: 0 },
      { label: 'Medium · 50cm', widthMm: 500, heightMm: 500, priceDelta: 60 },
    ],
  },
  'p-03': {
    id: 'p-03', slug: 'nova-star', name: 'Nova Star', basePrice: 129,
    sizes: [
      { label: 'Small · 25cm', widthMm: 250, heightMm: 250, priceDelta: 0 },
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 400, priceDelta: 50 },
    ],
  },
  'p-04': {
    id: 'p-04', slug: 'monarch-heart', name: 'Monarch Heart', basePrice: 99,
    sizes: [
      { label: 'Small · 20cm', widthMm: 200, heightMm: 200, priceDelta: 0 },
      { label: 'Medium · 35cm', widthMm: 350, heightMm: 350, priceDelta: 40 },
    ],
  },
  'p-05': {
    id: 'p-05', slug: 'apollo-hex', name: 'Apollo Hexagon', basePrice: 79,
    sizes: [
      { label: 'Single · 20cm', widthMm: 200, heightMm: 200, priceDelta: 0 },
      { label: 'Trio · 20cm × 3', widthMm: 600, heightMm: 200, priceDelta: 140 },
    ],
  },
  'p-06': {
    id: 'p-06', slug: 'compass-star8', name: 'Compass Rose', basePrice: 159,
    sizes: [
      { label: 'Medium · 45cm', widthMm: 450, heightMm: 450, priceDelta: 0 },
      { label: 'Large · 70cm', widthMm: 700, heightMm: 700, priceDelta: 160 },
    ],
  },
  'p-07': {
    id: 'p-07', slug: 'foliage-leaf', name: 'Foliage Leaf', basePrice: 119,
    sizes: [
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 500, priceDelta: 0 },
      { label: 'Large · 60cm', widthMm: 600, heightMm: 750, priceDelta: 90 },
    ],
  },
  'p-08': {
    id: 'p-08', slug: 'harbor-wave', name: 'Harbor Wave', basePrice: 175,
    sizes: [
      { label: 'Medium · 60cm', widthMm: 600, heightMm: 400, priceDelta: 0 },
      { label: 'Large · 90cm', widthMm: 900, heightMm: 600, priceDelta: 210 },
    ],
  },
  'p-09': {
    id: 'p-09', slug: 'octet-frame', name: 'Octet Frame', basePrice: 199,
    sizes: [
      { label: 'Medium · 45cm', widthMm: 450, heightMm: 450, priceDelta: 0 },
      { label: 'Large · 70cm', widthMm: 700, heightMm: 700, priceDelta: 180 },
    ],
  },
  'p-10': {
    id: 'p-10', slug: 'aegis-shield', name: 'Aegis Shield', basePrice: 219,
    sizes: [
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 500, priceDelta: 0 },
      { label: 'Large · 60cm', widthMm: 600, heightMm: 750, priceDelta: 140 },
    ],
  },
  'p-11': {
    id: 'p-11', slug: 'triad-triangle', name: 'Triad', basePrice: 89,
    sizes: [
      { label: 'Small · 30cm', widthMm: 300, heightMm: 300, priceDelta: 0 },
      { label: 'Medium · 50cm', widthMm: 500, heightMm: 500, priceDelta: 60 },
    ],
  },
  'p-12': {
    id: 'p-12', slug: 'pentacle-frame', name: 'Pentacle Frame', basePrice: 139,
    sizes: [
      { label: 'Medium · 40cm', widthMm: 400, heightMm: 400, priceDelta: 0 },
    ],
  },
};

// Map slugs to product IDs as well
for (const p of Object.values(CATALOG_PRODUCTS)) {
  CATALOG_PRODUCTS[p.slug] = p;
}

const FINISH_MARKUPS: Record<string, number> = {
  gold: 0,
  mirror_polish: 0,
  brass: 0,
  antique_brass: 0,
  copper: 0,
  verdigris: 0,
  corten: 0,
  corten_rust: 0,
  corten_weathering: 0,
  stainless: 0,
  stainless_304: 0,
  brushed_hairline: 0,
  steel: 0,
  mild_steel: 0,
  natural_mill: 0,
  black_patina: 0,
};

export const PRICING_CONFIG = {
  freeShippingThreshold: 150,
  shippingFee: 15,
  taxRate: 0.08,
};

export function calculateServerOrderPricing(
  items: PricingLineItem[],
  currency = 'INR'
): CalculatedPricingResult {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one line item');
  }

  const calculatedItems: CalculatedLineItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const qty = item.quantity;
    if (typeof qty !== 'number' || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      throw new Error('Quantity must be a positive integer');
    }

    const width = Math.max(100, item.widthMm || 300);
    const height = Math.max(100, item.heightMm || 300);
    const areaSqM = (width * height) / 1000000;

    let unitPrice = 0;
    let name = 'Bespoke Architectural Sign';

    // 1. Catalog item lookup
    const lookupKey = item.productId || item.productSlug || '';
    if (CATALOG_PRODUCTS[lookupKey]) {
      const cat = CATALOG_PRODUCTS[lookupKey];
      name = cat.name;
      unitPrice = cat.basePrice;

      // Find closest size delta match
      const matchingSize = cat.sizes.find(
        s => Math.abs(s.widthMm - width) <= 50 && Math.abs(s.heightMm - height) <= 50
      );
      if (matchingSize) {
        unitPrice += matchingSize.priceDelta;
      }
    } else {
      // 2. Custom CAD sign pricing formula: Base + (Area * Rate)
      unitPrice = Math.round(95 + areaSqM * 260);
      name = `Custom Plate (${width}×${height}mm)`;
    }

    // 3. Finish markup if applicable
    const finishKey = (item.finish || 'steel').toLowerCase().replace(/\s+/g, '_');
    const finishMarkup = FINISH_MARKUPS[finishKey] ?? 0;
    unitPrice += finishMarkup;

    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    calculatedItems.push({
      productId: item.productId,
      productSlug: item.productSlug,
      name,
      unitPrice,
      quantity: qty,
      lineTotal,
    });
  }

  // Free shipping on orders >= $150
  const shipping = subtotal >= 150 ? 0 : 15;
  // Standard 8% tax
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  const amountInSubunits = Math.round(total * 100);

  return {
    subtotal,
    shipping,
    tax,
    total,
    currency,
    amountInSubunits,
    items: calculatedItems,
  };
}
