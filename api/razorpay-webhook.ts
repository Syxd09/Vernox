import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { db } from '../src/lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

/**
 * POST /api/razorpay-webhook
 * Authoritative Serverless Webhook Handler for Razorpay Payment Gateway.
 * Handles payment.captured, order.paid, payment.failed, and refund.processed
 * with cryptographic HMAC-SHA256 signature verification and strict idempotency.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSignature = (req.headers['x-razorpay-signature'] || req.headers['X-Razorpay-Signature']) as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

  if (!webhookSecret) {
    console.error('Webhook Error: Missing RAZORPAY_WEBHOOK_SECRET and RAZORPAY_KEY_SECRET in server environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (!webhookSignature) {
    return res.status(400).json({ error: 'Missing X-Razorpay-Signature header' });
  }

  // 1. Raw Payload & Signature Verification
  // In Vercel or Node HTTP, req.body is parsed JSON or raw buffer
  const rawBody = (req as any).rawBody 
    ? (Buffer.isBuffer((req as any).rawBody) ? (req as any).rawBody.toString('utf8') : String((req as any).rawBody))
    : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const signatureBuffer = Buffer.from(webhookSignature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    const isValidSignature =
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValidSignature) {
      console.warn('Razorpay Webhook: Invalid signature detected.');
      return res.status(400).json({ error: 'Invalid webhook cryptographic signature' });
    }
  } catch (sigErr: any) {
    console.error('Webhook signature verification exception:', sigErr);
    return res.status(400).json({ error: 'Cryptographic signature verification failed' });
  }

  // 2. Event Processing
  const event = req.body?.event;
  const payload = req.body?.payload;

  if (!event || !payload) {
    return res.status(400).json({ error: 'Malformed webhook payload structure' });
  }

  try {
    const paymentEntity = payload.payment?.entity;
    const orderEntity = payload.order?.entity;
    const refundEntity = payload.refund?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;

    if (!razorpayOrderId) {
      // Event not tied to an order (e.g., account settlement) - acknowledge safely
      return res.status(200).json({ received: true, ignored: 'No order association' });
    }

    const orderRef = doc(db, 'orders', razorpayOrderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.warn(`Webhook: Order ${razorpayOrderId} not found in Firestore.`);
      // Acknowledge to prevent Razorpay retry loops on deleted/test orders
      return res.status(200).json({ received: true, warning: 'Order not found' });
    }

    const existingOrder = orderSnap.data();

    switch (event) {
      case 'order.paid':
      case 'payment.captured': {
        // Idempotency: If already paid, do not re-process
        if (existingOrder.status === 'Paid') {
          return res.status(200).json({ received: true, idempotent: true });
        }

        // Financial Verification: Amount and Currency Invariant Check
        if (paymentEntity?.amount !== undefined && existingOrder.total !== undefined) {
          const expectedSubunits = Math.round(existingOrder.total * 100);
          const actualSubunits = Number(paymentEntity.amount);
          // Allow at most 1 subunit delta for fractional rounding
          if (Math.abs(actualSubunits - expectedSubunits) > 1) {
            console.error(
              `SECURITY ALERT: Webhook amount mismatch for order ${razorpayOrderId}. Expected ${expectedSubunits} subunits, received ${actualSubunits} subunits.`
            );
            await updateDoc(orderRef, {
              status: 'Payment_Discrepancy',
              flaggedReason: `Amount mismatch: expected ${expectedSubunits}, gateway reported ${actualSubunits}`,
              flaggedAt: Date.now(),
              updatedAt: new Date().toISOString(),
            });
            return res.status(400).json({ 
              error: 'Payment amount does not match authoritative order total' 
            });
          }
        }

        if (paymentEntity?.currency && existingOrder.currency) {
          if (paymentEntity.currency.toUpperCase() !== existingOrder.currency.toUpperCase()) {
            console.error(
              `SECURITY ALERT: Webhook currency mismatch for order ${razorpayOrderId}. Expected ${existingOrder.currency}, received ${paymentEntity.currency}.`
            );
            await updateDoc(orderRef, {
              status: 'Payment_Discrepancy',
              flaggedReason: `Currency mismatch: expected ${existingOrder.currency}, gateway reported ${paymentEntity.currency}`,
              flaggedAt: Date.now(),
              updatedAt: new Date().toISOString(),
            });
            return res.status(400).json({ 
              error: 'Payment currency does not match authoritative order currency' 
            });
          }
        }

        await updateDoc(orderRef, {
          status: 'Paid',
          razorpayPaymentId: razorpayPaymentId || existingOrder.razorpayPaymentId || '',
          verifiedAt: Date.now(),
          webhookConfirmed: true,
          updatedAt: new Date().toISOString(),
        });

        // Record audit trail
        try {
          await addDoc(collection(db, 'audit_logs'), {
            adminEmail: 'system@razorpay.webhook',
            adminRole: 'system',
            action: 'ORDER_PAID_WEBHOOK',
            targetType: 'order',
            targetId: razorpayOrderId,
            details: {
              paymentId: razorpayPaymentId,
              amount: paymentEntity?.amount,
              currency: paymentEntity?.currency,
            },
            timestamp: Date.now(),
            ip: (req.headers['x-forwarded-for'] as string) || 'razorpay-webhook',
          });
        } catch (_) {}

        return res.status(200).json({ received: true, action: 'order_marked_paid' });
      }

      case 'payment.failed': {
        // If order was already successfully confirmed as Paid, ignore late/out-of-order failure delivery
        if (existingOrder.status === 'Paid') {
          console.warn(`Webhook: Ignoring late payment.failed for already Paid order ${razorpayOrderId}`);
          return res.status(200).json({ received: true, ignored: 'Order already confirmed as Paid' });
        }

        const errorDescription = paymentEntity?.error_description || 'Payment authorization failed at bank';
        await updateDoc(orderRef, {
          status: 'Payment_Failed',
          failureReason: errorDescription,
          updatedAt: new Date().toISOString(),
        });

        return res.status(200).json({ received: true, action: 'payment_failed_recorded' });
      }

      case 'refund.processed': {
        const refundAmount = refundEntity?.amount ? refundEntity.amount / 100 : existingOrder.total;
        await updateDoc(orderRef, {
          status: 'Refunded',
          refundId: refundEntity?.id,
          refundAmount,
          refundedAt: Date.now(),
          updatedAt: new Date().toISOString(),
        });

        return res.status(200).json({ received: true, action: 'refund_recorded' });
      }

      default: {
        return res.status(200).json({ received: true, unhandledEvent: event });
      }
    }
  } catch (procErr: any) {
    console.error('Error handling webhook event:', procErr);
    return res.status(500).json({ error: procErr.message || 'Internal webhook processing failure' });
  }
}
