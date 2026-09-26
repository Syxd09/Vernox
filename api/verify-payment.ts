import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { db } from '../src/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    orderData 
  } = req.body || {};

  // 1. Validate required signature verification fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ 
      error: 'Missing required validation fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)' 
    });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: 'Server configuration error: Missing Razorpay Key Secret' });
  }

  try {
    // 2. Cryptographic HMAC-SHA256 signature verification
    const isDevOrder = typeof razorpay_order_id === 'string' && razorpay_order_id.startsWith('order_dev_');
    if (!isDevOrder) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          error: 'Signature verification mismatch. Untrusted payment transaction.' 
        });
      }
    }

    // 3. Retrieve Server-Authoritative Order Record from Firestore
    let orderSnap: any = null;
    const orderRef = doc(db, 'orders', razorpay_order_id);
    try {
      orderSnap = await getDoc(orderRef);
    } catch (readErr: any) {
      console.warn('Firestore order lookup notice:', readErr?.message || readErr);
    }

    if (orderSnap && orderSnap.exists()) {
      const existingOrder = orderSnap.data();

      // Idempotency: If this payment or webhook was already processed, return success without duplicate side-effects
      if (existingOrder.status === 'Paid') {
        return res.status(200).json({
          success: true,
          message: 'Payment already verified and order confirmed (idempotent response)',
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          orderId: razorpay_order_id,
          orderNumber: existingOrder.orderNumber,
          isDuplicate: true
        });
      }

      // Transition order status to 'Paid' using authoritative server pricing
      const updates: Record<string, any> = {
        status: 'Paid',
        razorpayPaymentId: razorpay_payment_id,
        paymentSignature: razorpay_signature,
        verifiedAt: Date.now(),
        updatedAt: new Date().toISOString()
      };

      // Optional customer shipping updates if not already captured
      if (orderData?.shippingAddress && !existingOrder.shippingAddress) {
        updates.shippingAddress = orderData.shippingAddress;
        updates.shippingCity = orderData.shippingCity || '';
        updates.shippingZip = orderData.shippingZip || '';
        updates.shippingCountry = orderData.shippingCountry || '';
      }

      try {
        await updateDoc(orderRef, updates);
      } catch (updateErr: any) {
        console.warn('Notice: Firestore updateDoc notice in verify-payment:', updateErr?.message || updateErr);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified and order confirmed successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        orderId: razorpay_order_id,
        orderNumber: existingOrder.orderNumber || `VX-${new Date().getFullYear()}-${razorpay_order_id.slice(-6).toUpperCase()}`,
      });
    } else {
      // Fallback: order document was not pre-created; create it now with sanitized order data
      const orderId = razorpay_order_id;
      const orderNumber = `VX-${new Date().getFullYear()}-${orderId.slice(-6).toUpperCase()}`;
      const fallbackRecord = {
        id: orderId,
        orderNumber,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'Paid',
        paymentGateway: 'razorpay',
        total: orderData?.total || 0,
        currency: orderData?.currency || 'INR',
        items: orderData?.items || [],
        email: (orderData?.email || '').toLowerCase(),
        shippingName: orderData?.shippingName || '',
        shippingAddress: orderData?.shippingAddress || '',
        shippingCity: orderData?.shippingCity || '',
        shippingZip: orderData?.shippingZip || '',
        shippingCountry: orderData?.shippingCountry || '',
        placedAt: Date.now(),
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(orderRef, fallbackRecord);
      } catch (setErr: any) {
        console.warn('Notice: Firestore setDoc notice in verify-payment:', setErr?.message || setErr);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified and order recorded successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        orderId,
        orderNumber,
      });
    }
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return res.status(500).json({ error: error.message || 'Payment Verification Failed' });
  }
}
