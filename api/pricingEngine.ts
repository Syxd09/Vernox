/**
 * Server-Authoritative Pricing Engine
 * Calculates deterministic pricing for standard catalog items and custom CAD/CAM pieces
 */
import { products as defaultCatalogProducts } from '../src/lib/catalog';

export interface PricingLineItem {
  productId?: string;
  productSlug?: string;
  productName?: string;
  shapeId?: string;
  sizeLabel?: string;
  widthMm?: number;
  heightMm?: number;
  finish?: string;
  unitPrice?: number;
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
  discount: number;
  discountedSubtotal: number;
  couponCode?: string;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  amountInSubunits: number; // Cents or Paise (amount * 100)
  items: CalculatedLineItem[];
}

export interface PricingEngineOptions {
  taxRate?: number;
  freeShippingThreshold?: number;
  shippingFee?: number;
  discountAmount?: number;
  couponCode?: string;
}

interface CatalogProductPricing {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  sizes: Array<{ label: string; widthMm: number; heightMm: number; priceDelta: number }>;
}

export const CATALOG_PRODUCTS: Record<string, CatalogProductPricing> = {
  // Main Curated Masterworks & Sculptures
  'prod-01': {
    id: 'prod-01', slug: 'abstract-horizon', name: 'Abstract Horizon', basePrice: 240,
    sizes: [
      { label: 'Standard · 90 × 50 cm', widthMm: 900, heightMm: 500, priceDelta: 0 },
      { label: 'Statement · 140 × 80 cm', widthMm: 1400, heightMm: 800, priceDelta: 160 },
      { label: 'Grand · 180 × 100 cm', widthMm: 1800, heightMm: 1000, priceDelta: 320 },
    ],
  },
  'prod-02': {
    id: 'prod-02', slug: 'golden-silence', name: 'Golden Silence', basePrice: 310,
    sizes: [
      { label: 'Tabletop · 38 cm Height', widthMm: 220, heightMm: 380, priceDelta: 0 },
      { label: 'Pedestal · 60 cm Height', widthMm: 320, heightMm: 600, priceDelta: 180 },
    ],
  },
  'prod-03': {
    id: 'prod-03', slug: 'sculptural-form', name: 'Sculptural Form', basePrice: 285,
    sizes: [
      { label: 'Studio · 42 cm Height', widthMm: 360, heightMm: 420, priceDelta: 0 },
      { label: 'Monument · 65 cm Height', widthMm: 540, heightMm: 650, priceDelta: 210 },
    ],
  },
  'prod-04': {
    id: 'prod-04', slug: 'maroon-geometry', name: 'Maroon Geometry', basePrice: 195,
    sizes: [
      { label: 'Gallery · 60 × 60 cm', widthMm: 600, heightMm: 600, priceDelta: 0 },
      { label: 'Statement · 90 × 90 cm', widthMm: 900, heightMm: 900, priceDelta: 130 },
      { label: 'Foyer · 120 × 120 cm', widthMm: 1200, heightMm: 1200, priceDelta: 280 },
    ],
  },
  'prod-05': {
    id: 'prod-05', slug: 'contemporary-bloom', name: 'Contemporary Bloom', basePrice: 260,
    sizes: [
      { label: 'Square · 70 × 70 cm', widthMm: 700, heightMm: 700, priceDelta: 0 },
      { label: 'Grand · 100 × 100 cm', widthMm: 1000, heightMm: 1000, priceDelta: 190 },
    ],
  },
  'prod-06': {
    id: 'prod-06', slug: 'minimal-lines', name: 'Minimal Lines', basePrice: 175,
    sizes: [
      { label: 'Medium · 60 × 80 cm', widthMm: 600, heightMm: 800, priceDelta: 0 },
      { label: 'Large · 90 × 120 cm', widthMm: 900, heightMm: 1200, priceDelta: 140 },
    ],
  },
  'prod-07': {
    id: 'prod-07', slug: 'bronze-figure', name: 'Bronze Figure', basePrice: 340,
    sizes: [
      { label: 'Mantle · 48 cm Height', widthMm: 140, heightMm: 480, priceDelta: 0 },
      { label: 'Console · 72 cm Height', widthMm: 180, heightMm: 720, priceDelta: 240 },
    ],
  },
  'prod-08': {
    id: 'prod-08', slug: 'textured-canvas', name: 'Textured Canvas', basePrice: 290,
    sizes: [
      { label: 'Round · 80 cm Diameter', widthMm: 800, heightMm: 800, priceDelta: 0 },
      { label: 'Grand · 120 cm Diameter', widthMm: 1200, heightMm: 1200, priceDelta: 260 },
    ],
  },

  // Geometric & Metal Frames Series
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

// Augment and index from defaultCatalogProducts
if (Array.isArray(defaultCatalogProducts)) {
  for (const p of defaultCatalogProducts) {
    const item: CatalogProductPricing = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      basePrice: p.price,
      sizes: p.sizes || [],
    };
    CATALOG_PRODUCTS[p.id] = item;
    CATALOG_PRODUCTS[p.slug] = item;
  }
}

// Map slugs to product entries
for (const p of Object.values(CATALOG_PRODUCTS)) {
  if (p.slug) {
    CATALOG_PRODUCTS[p.slug] = p;
  }
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
  shippingFee: 40,
  taxRate: 0.18,
};

export function calculateServerOrderPricing(
  items: PricingLineItem[],
  currency = 'INR',
  options?: PricingEngineOptions
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
    let name = item.productName || 'Bespoke Architectural Masterwork';

    // 1. Catalog item lookup
    const lookupKey = item.productId || item.productSlug || '';
    if (CATALOG_PRODUCTS[lookupKey]) {
      const cat = CATALOG_PRODUCTS[lookupKey];
      name = cat.name;
      unitPrice = cat.basePrice;

      let sizeMatched = false;

      // Priority 1: Match by sizeLabel
      if (item.sizeLabel && cat.sizes && cat.sizes.length > 0) {
        const normLabel = item.sizeLabel.toLowerCase().trim();
        const matchingSizeByLabel = cat.sizes.find(
          s => s.label.toLowerCase().trim() === normLabel ||
               normLabel.includes(s.label.toLowerCase().trim()) ||
               s.label.toLowerCase().trim().includes(normLabel)
        );
        if (matchingSizeByLabel) {
          unitPrice += matchingSizeByLabel.priceDelta;
          sizeMatched = true;
        }
      }

      // Priority 2: Match by closest dimensions
      if (!sizeMatched && cat.sizes && cat.sizes.length > 0) {
        const matchingSize = cat.sizes.find(
          s => Math.abs(s.widthMm - width) <= 60 && Math.abs(s.heightMm - height) <= 60
        );
        if (matchingSize) {
          unitPrice += matchingSize.priceDelta;
          sizeMatched = true;
        }
      }

      // Priority 3: If item.unitPrice matches any valid basePrice or size delta, honor item.unitPrice
      if (typeof item.unitPrice === 'number' && item.unitPrice > 0) {
        const validPrices = [cat.basePrice, ...(cat.sizes?.map(s => cat.basePrice + s.priceDelta) || [])];
        if (validPrices.includes(item.unitPrice)) {
          unitPrice = item.unitPrice;
        }
      }
    } else if (item.productId === 'custom-bespoke' || item.customDesignRef) {
      // 2. Custom CAD Crafting Studio Piece
      name = item.productName || 'Bespoke Architectural Metal Sign';
      const finishKey = (item.finish || 'steel').toLowerCase();
      const basePrice = 149;
      const areaRate = finishKey.includes('brass') || finishKey.includes('copper') || finishKey.includes('gold') ? 450 : 250;
      const expectedCustom = Math.round(basePrice + areaSqM * areaRate);
      if (typeof item.unitPrice === 'number' && item.unitPrice >= 95) {
        unitPrice = item.unitPrice;
      } else {
        unitPrice = expectedCustom;
      }
    } else if (typeof item.unitPrice === 'number' && item.unitPrice > 0) {
      // 3. Admin / Firestore custom product
      unitPrice = item.unitPrice;
      name = item.productName || `Vernox Commission (${lookupKey})`;
    } else {
      // 4. Fallback CAD area formula
      unitPrice = Math.round(95 + areaSqM * 260);
      name = item.productName || `Custom Plate (${width}×${height}mm)`;
    }

    // 5. Finish markup if applicable
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

  const discount = Math.min(subtotal, Math.max(0, options?.discountAmount ?? 0));
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const freeShippingThreshold = options?.freeShippingThreshold ?? PRICING_CONFIG.freeShippingThreshold;
  const shippingFee = options?.shippingFee ?? PRICING_CONFIG.shippingFee;
  const rawTaxRate = options?.taxRate ?? PRICING_CONFIG.taxRate;
  const taxRate = rawTaxRate > 1 ? rawTaxRate / 100 : rawTaxRate;

  // Free shipping on orders >= threshold (calculated on original merchandise subtotal)
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  // Tax calculation on discounted subtotal
  const tax = Math.round(discountedSubtotal * taxRate * 100) / 100;
  const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;
  const amountInSubunits = Math.round(total * 100);

  return {
    subtotal,
    discount,
    discountedSubtotal,
    couponCode: options?.couponCode,
    shipping,
    tax,
    total,
    currency,
    amountInSubunits,
    items: calculatedItems,
  };
}
