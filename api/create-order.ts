import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { calculateServerOrderPricing } from './pricingEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { items, currency = 'USD', receipt, amount } = req.body || {};

  let orderAmount: number = 0;
  let pricing: any = null;

  // Case A: Cart items provided - authoritative server pricing
  if (items && Array.isArray(items) && items.length > 0) {
    try {
      pricing = calculateServerOrderPricing(items, currency);
      orderAmount = pricing.amountInSubunits;
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Invalid item parameters for pricing' });
    }
  } else if (amount !== undefined) {
    // Case B: Direct amount in smallest unit (paise/cents)
    orderAmount = Number(amount);
  } else {
    return res.status(400).json({ error: 'Order must contain either a valid items array or amount in paise' });
  }

  // Minimum amount validation: at least 100 paise (or 100 cents / 1 currency unit)
  if (isNaN(orderAmount) || orderAmount < 100) {
    return res.status(400).json({ error: 'Order amount must be at least 100 paise' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Server configuration error: Missing Razorpay credentials' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(orderAmount),
      currency: currency || (pricing ? pricing.currency : 'INR'),
      receipt: receipt || `receipt_${Date.now()}`,
      notes: pricing ? {
        itemCount: String(pricing.items.length),
        calculatedSubtotal: String(pricing.subtotal),
      } : undefined,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      ...(pricing ? {
        pricing: {
          subtotal: pricing.subtotal,
          shipping: pricing.shipping,
          tax: pricing.tax,
          total: pricing.total,
          items: pricing.items,
        }
      } : {}),
    });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);

    // Handle authentication failure
    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.message?.toLowerCase().includes('auth')) {
      return res.status(401).json({ error: 'Razorpay authentication failed: Invalid Key ID or Secret' });
    }

    // Handle general Razorpay API errors
    return res.status(500).json({ 
      error: error?.error?.description || error.message || 'Razorpay Order Creation Failed' 
    });
  }
}
