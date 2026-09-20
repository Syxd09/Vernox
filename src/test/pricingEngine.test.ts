import { describe, it, expect } from 'vitest';
import { calculateServerOrderPricing, PRICING_CONFIG } from '../../api/pricingEngine';

describe('Authoritative Pricing Engine', () => {
  it('correctly calculates base pricing and subtotal for standard catalog products', () => {
    const items = [
      {
        productId: 'p-01',
        productSlug: 'the-savile-brass-crest',
        widthMm: 300,
        heightMm: 150,
        finish: 'Brushed Brass',
        quantity: 1,
      }
    ];

    const result = calculateServerOrderPricing(items, 'INR');

    // Base price of p-01 is 24,500; Brushed Brass +10% = 2,450; Size delta = 0
    // Expected unit price: 26,950
    expect(result.items[0].unitPrice).toBe(26950);
    expect(result.subtotal).toBe(26950);
    expect(result.currency).toBe('INR');

    // Free shipping threshold is 15,000; 26,950 > 15,000 => shipping is 0
    expect(result.shipping).toBe(0);

    // GST 18% of 26,950 = 4,851
    expect(result.tax).toBe(4851);

    // Total = 26,950 + 0 + 4,851 = 31,801
    expect(result.total).toBe(31801);
    expect(result.amountInSubunits).toBe(3180100);
  });

  it('correctly applies size delta for larger plaques', () => {
    const items = [
      {
        productId: 'p-01',
        widthMm: 450,
        heightMm: 225,
        finish: 'Satin Brass', // 0% surcharge
        quantity: 2,
      }
    ];

    const result = calculateServerOrderPricing(items, 'INR');

    // Base price = 24,500 + delta 16,000 = 40,500; finish surcharge 0%
    expect(result.items[0].unitPrice).toBe(40500);
    expect(result.subtotal).toBe(81000); // 40,500 * 2
  });

  it('charges standard shipping when subtotal is below the threshold', () => {
    const items = [
      {
        productId: 'p-10', // Industrial Number Plaque base price: 9,500
        widthMm: 150,
        heightMm: 150,
        finish: 'Raw Steel', // 0% surcharge
        quantity: 1,
      }
    ];

    const result = calculateServerOrderPricing(items, 'INR');

    expect(result.subtotal).toBe(9500);
    expect(result.shipping).toBe(PRICING_CONFIG.shippingFee); // 500
    // Tax 18% of 9,500 = 1,710
    expect(result.tax).toBe(1710);
    // Total = 9,500 + 500 + 1,710 = 11,710
    expect(result.total).toBe(11710);
  });

  it('rejects unknown or invalid product IDs', () => {
    const items = [
      {
        productId: 'hacker-nonexistent-id',
        widthMm: 300,
        heightMm: 150,
        finish: 'Raw Steel',
        quantity: 1,
      }
    ];

    expect(() => calculateServerOrderPricing(items, 'INR')).toThrow(
      /Product not found in catalog/
    );
  });

  it('rejects negative or zero item quantities', () => {
    const items = [
      {
        productId: 'p-01',
        widthMm: 300,
        heightMm: 150,
        finish: 'Raw Steel',
        quantity: -5,
      }
    ];

    expect(() => calculateServerOrderPricing(items, 'INR')).toThrow(
      /Quantity must be a positive integer/
    );
  });
});
