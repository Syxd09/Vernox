import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { calculateServerOrderPricing } from './pricingEngine';
import { db } from '../src/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  runTransaction, 
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { products as defaultProducts } from '../src/lib/catalog';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { items, currency = 'INR', idempotencyKey, customer } = req.body || {};

  // 1. Input Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain a non-empty items array' });
  }

  if (!customer?.email || !customer?.name) {
    return res.status(400).json({ error: 'Customer name and email are required for checkout intent' });
  }

  // 2. Idempotency Check: Return existing order if same key received
  if (idempotencyKey && typeof idempotencyKey === 'string') {
    try {
      const q = query(
        collection(db, 'orders'),
        where('idempotencyKey', '==', idempotencyKey.trim())
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const existingOrder = snap.docs[0].data();
        // Return existing active order details without re-charging or re-reserving
        return res.status(200).json({
          success: true,
          isDuplicate: true,
          order_id: existingOrder.razorpayOrderId || existingOrder.id,
          amount: Math.round(existingOrder.total * 100),
          currency: existingOrder.currency || currency,
          pricing: {
            subtotal: existingOrder.subtotal,
            shipping: existingOrder.shipping,
            tax: existingOrder.tax,
            total: existingOrder.total,
            items: existingOrder.items,
          }
        });
      }
    } catch (idemErr) {
      console.warn('Idempotency query notice:', idemErr);
      // Proceed if Firestore query fails on non-indexed field
    }
  }

  // 3. Server-Authoritative Pricing Recalculation
  let pricing: ReturnType<typeof calculateServerOrderPricing>;
  try {
    pricing = calculateServerOrderPricing(items, currency);
  } catch (priceErr: any) {
    return res.status(400).json({ error: priceErr.message || 'Invalid item parameters for pricing' });
  }

  // 4. Concurrency-Safe Stock Reservation (Best-effort for standard catalog items)
  // Custom bespoke pieces are made-to-order and do not decrement finite stock
  const catalogItemsToReserve = items.filter(
    (itm: any) => itm.productId && !itm.productId.startsWith('custom') && itm.productId !== 'custom-bespoke'
  );

  const productDeltas: Array<{ ref: any; newStock: number; currentStock: number; id: string }> = [];

  if (catalogItemsToReserve.length > 0) {
    const itemQtyMap = new Map<string, number>();
    for (const itm of catalogItemsToReserve) {
      const pId = itm.productId;
      itemQtyMap.set(pId, (itemQtyMap.get(pId) || 0) + (itm.quantity || 1));
    }

    try {
      await runTransaction(db, async (transaction) => {
        for (const [productId, reqQty] of itemQtyMap.entries()) {
          const pRef = doc(db, 'products', productId);
          const pSnap = await transaction.get(pRef);

          let availableStock: number;
          let trackInventory = true;

          if (pSnap.exists()) {
            const pData = pSnap.data();
            trackInventory = pData.trackInventory !== false;
            availableStock = typeof pData.stock === 'number' ? pData.stock : 25;
          } else {
            // Fallback to static catalog definition
            const catalogItem = defaultProducts.find(p => p.id === productId);
            trackInventory = catalogItem?.trackInventory !== false;
            availableStock = catalogItem?.stock ?? 25;
          }

          if (trackInventory) {
            if (availableStock < reqQty) {
              throw new Error(
                `INSUFFICIENT_STOCK: Product ID [${productId}] only has ${availableStock} units remaining (requested ${reqQty}).`
              );
            }

            const updatedStock = availableStock - reqQty;
            productDeltas.push({ ref: pRef, newStock: updatedStock, currentStock: availableStock, id: productId });
            transaction.set(pRef, { stock: updatedStock, updatedAt: Date.now() }, { merge: true });
          }
        }
      });
    } catch (txError: any) {
      if (txError.message && txError.message.includes('INSUFFICIENT_STOCK')) {
        return res.status(409).json({ error: txError.message });
      }
      // If Firestore security rules restrict write in unauthenticated serverless context,
      // log warning and proceed so the customer checkout flow is not blocked.
      console.warn('Notice: Firestore stock reservation skipped or deferred:', txError?.message || txError);
    }
  }

  // 5. Razorpay Gateway Order Creation
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    await rollbackStock(productDeltas);
    return res.status(500).json({ error: 'Server configuration error: Missing Razorpay credentials in environment' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `vx_rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(pricing.amountInSubunits),
      currency: pricing.currency,
      receipt,
      notes: {
        customerEmail: customer.email,
        customerName: customer.name,
        idempotencyKey: idempotencyKey || 'none',
      }
    });

    // 6. Record Pending Order Intent in Cloud Firestore
    const orderRecord = {
      id: rzpOrder.id,
      orderNumber: `VX-${new Date().getFullYear()}-${rzpOrder.id.slice(-6).toUpperCase()}`,
      razorpayOrderId: rzpOrder.id,
      status: 'Pending_Payment',
      idempotencyKey: idempotencyKey || null,
      total: pricing.total,
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      tax: pricing.tax,
      currency: pricing.currency,
      items: pricing.items,
      email: customer.email.trim().toLowerCase(),
      shippingName: customer.name,
      shippingAddress: customer.address || '',
      shippingCity: customer.city || '',
      shippingZip: customer.zip || '',
      shippingCountry: customer.country || '',
      reservationExpiresAt: Date.now() + 15 * 60 * 1000, // 15-minute hold
      placedAt: Date.now(),
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', rzpOrder.id), orderRecord);
    } catch (orderSaveErr: any) {
      console.warn('Firestore order record notice (proceeding):', orderSaveErr?.message || orderSaveErr);
    }

    return res.status(200).json({
      success: true,
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      pricing: {
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        tax: pricing.tax,
        total: pricing.total,
        items: pricing.items,
      }
    });

  } catch (rzpErr: any) {
    console.error('Razorpay Order Creation notice:', rzpErr);
    await rollbackStock(productDeltas);

    // In local development or preview environments, if gateway rejects test keys, provide fallback
    if (process.env.NODE_ENV !== 'production') {
      const mockOrderId = `order_dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      console.warn(`DEV MODE: Falling back to mock test order intent (${mockOrderId})`);
      return res.status(200).json({
        success: true,
        order_id: mockOrderId,
        amount: Math.round(pricing.amountInSubunits),
        currency: pricing.currency,
        isDevFallback: true,
        pricing: {
          subtotal: pricing.subtotal,
          shipping: pricing.shipping,
          tax: pricing.tax,
          total: pricing.total,
          items: pricing.items,
        }
      });
    }

    return res.status(502).json({
      error: rzpErr?.error?.description || rzpErr.message || 'Payment provider order initiation failed. Please check gateway credentials.'
    });
  }
}

/**
 * Compensating transaction helper to rollback reserved stock in case of payment gateway failure
 */
async function rollbackStock(deltas: Array<{ ref: any; newStock: number; currentStock: number; id: string }>) {
  if (deltas.length === 0) return;
  try {
    await runTransaction(db, async (tx) => {
      for (const d of deltas) {
        tx.set(d.ref, { stock: d.currentStock, updatedAt: Date.now() }, { merge: true });
      }
    });
  } catch (rbErr: any) {
    console.warn('Stock rollback notice:', rbErr?.message || rbErr);
  }
}
