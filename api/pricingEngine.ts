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

const CATALOG_BASE_PRICES: Record<string, { name: string; basePrice: number }> = {
  'p-01': { name: 'Ember Round Frame', basePrice: 189 },
  'ember-round-frame': { name: 'Ember Round Frame', basePrice: 189 },
  'p-02': { name: 'Atrium Square', basePrice: 149 },
  'atrium-square': { name: 'Atrium Square', basePrice: 149 },
  'p-03': { name: 'Nova Star', basePrice: 129 },
  'nova-star': { name: 'Nova Star', basePrice: 129 },
  'p-04': { name: 'Solstice Hexagon', basePrice: 169 },
  'solstice-hexagon': { name: 'Solstice Hexagon', basePrice: 169 },
  'p-05': { name: 'Aura Arch Frame', basePrice: 199 },
  'aura-arch-frame': { name: 'Aura Arch Frame', basePrice: 199 },
};

const FINISH_MARKUPS: Record<string, number> = {
  gold: 35,
  mirror_polish: 35,
  brass: 25,
  antique_brass: 25,
  copper: 20,
  verdigris: 20,
  corten: 15,
  corten_rust: 15,
  corten_weathering: 15,
  stainless: 15,
  stainless_304: 15,
  brushed_hairline: 15,
  steel: 0,
  mild_steel: 0,
  natural_mill: 0,
  black_patina: 10,
};

export function calculateServerOrderPricing(
  items: PricingLineItem[],
  currency = 'USD'
): CalculatedPricingResult {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one line item');
  }

  const calculatedItems: CalculatedLineItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const width = Math.max(100, item.widthMm || 300);
    const height = Math.max(100, item.heightMm || 300);
    const areaSqM = (width * height) / 1000000;

    let unitPrice = 0;
    let name = 'Bespoke Architectural Sign';

    // 1. Catalog item lookup
    const lookupKey = item.productId || item.productSlug || '';
    if (CATALOG_BASE_PRICES[lookupKey]) {
      const cat = CATALOG_BASE_PRICES[lookupKey];
      name = cat.name;
      unitPrice = cat.basePrice;

      // Size delta adjustments
      const maxDim = Math.max(width, height);
      if (maxDim > 600) {
        unitPrice += 220;
      } else if (maxDim > 400) {
        unitPrice += 70;
      }
    } else {
      // 2. Custom CAD sign pricing formula: Base + (Area * Rate)
      // Base fabrication setup: $95
      // Raw sheet material & laser cut rate: $260 / sq. meter
      unitPrice = Math.round(95 + areaSqM * 260);
      name = `Custom Plate (${width}×${height}mm)`;
    }

    // 3. Finish markup
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
