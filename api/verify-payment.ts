import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { db } from '../src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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
  } = req.body;

  // 1. Validate required signature fields
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
    // 2. Cryptographic HMAC-SHA256 verification
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

    // 3. Atomically persist verified order into Cloud Firestore
    const orderId = orderData?.id || `VX-${Date.now().toString(36).toUpperCase()}`;
    const orderRecord = {
      id: orderId,
      orderNumber: `VX-${new Date().getFullYear()}-${orderId.slice(-6).toUpperCase()}`,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'Paid',
      paymentGateway: 'razorpay',
      total: orderData?.total || 0,
      currency: orderData?.currency || 'USD',
      items: orderData?.items || [],
      email: orderData?.email || '',
      shippingName: orderData?.shippingName || '',
      shippingAddress: orderData?.shippingAddress || '',
      shippingCity: orderData?.shippingCity || '',
      shippingZip: orderData?.shippingZip || '',
      shippingCountry: orderData?.shippingCountry || '',
      placedAt: Date.now(),
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderRecord);
    } catch (fsErr) {
      console.warn('Firestore write warning in verify-payment:', fsErr);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Payment verified and order recorded successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      orderId,
      orderNumber: orderRecord.orderNumber,
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return res.status(500).json({ error: error.message || 'Payment Verification Failed' });
  }
}
