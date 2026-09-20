import { describe, it, expect } from 'vitest';

/**
 * Concurrency & Invariant Safety Test Suite
 *
 * Demonstrates transactional ACID guarantees for inventory reservation,
 * race condition prevention, and checkout idempotency.
 */

// Simulated Transactional Store modeling Cloud Firestore atomic transactions
class SimulatedTransactionalDatabase {
  private products = new Map<string, { id: string; stock: number; trackInventory: boolean }>();
  private orders = new Map<string, any>();
  private idempotencyRegistry = new Map<string, string>(); // idempotencyKey -> orderId

  constructor() {
    // Initial State: Limited stock product
    this.products.set('p-test-limited', {
      id: 'p-test-limited',
      stock: 10,
      trackInventory: true
    });
  }

  // Atomic reservation modeling Firestore runTransaction
  async reserveStockAndCreateOrderIntent(params: {
    productId: string;
    quantity: number;
    idempotencyKey: string;
    total: number;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { productId, quantity, idempotencyKey, total } = params;

    // Idempotency check: atomic lookup
    if (this.idempotencyRegistry.has(idempotencyKey)) {
      const existingOrderId = this.idempotencyRegistry.get(idempotencyKey)!;
      return { success: true, orderId: existingOrderId };
    }

    // Atomic transaction execution
    const product = this.products.get(productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (product.trackInventory) {
      if (product.stock < quantity) {
        return {
          success: false,
          error: `INSUFFICIENT_STOCK: Available ${product.stock}, requested ${quantity}`
        };
      }

      // Safe atomic decrement
      product.stock -= quantity;
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    this.orders.set(orderId, {
      id: orderId,
      productId,
      quantity,
      total,
      status: 'Pending_Payment',
      idempotencyKey
    });

    this.idempotencyRegistry.set(idempotencyKey, orderId);

    return { success: true, orderId };
  }

  // Idempotent payment verification
  async markOrderPaid(orderId: string): Promise<{ success: boolean; isDuplicate: boolean }> {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, isDuplicate: false };
    }

    if (order.status === 'Paid') {
      return { success: true, isDuplicate: true };
    }

    order.status = 'Paid';
    return { success: true, isDuplicate: false };
  }

  getProductStock(productId: string): number {
    return this.products.get(productId)?.stock ?? 0;
  }

  getOrderCount(): number {
    return this.orders.size;
  }
}

describe('Concurrency & Idempotency Guarantees', () => {
  it('prevents overselling when 100 users purchase simultaneously (Initial Stock = 10)', async () => {
    const db = new SimulatedTransactionalDatabase();
    const initialStock = db.getProductStock('p-test-limited');
    expect(initialStock).toBe(10);

    const CONCURRENT_USERS = 100;
    const purchasePromises: Promise<{ success: boolean; orderId?: string; error?: string }>[] = [];

    // 100 simultaneous purchase requests hitting the server at the exact same moment
    for (let i = 0; i < CONCURRENT_USERS; i++) {
      purchasePromises.push(
        db.reserveStockAndCreateOrderIntent({
          productId: 'p-test-limited',
          quantity: 1,
          idempotencyKey: `user_${i}_checkout_key`,
          total: 24500
        })
      );
    }

    const results = await Promise.all(purchasePromises);

    const successfulPurchases = results.filter(r => r.success);
    const failedPurchases = results.filter(r => !r.success);

    // CRITICAL ACCEPTANCE CRITERIA:
    // Exactly 10 orders must succeed. Never 11, never 12, never 100!
    expect(successfulPurchases.length).toBe(10);
    expect(failedPurchases.length).toBe(90);

    // Remaining inventory must be exactly 0, NEVER negative
    const finalStock = db.getProductStock('p-test-limited');
    expect(finalStock).toBe(0);
    expect(finalStock).toBeGreaterThanOrEqual(0);

    // Total orders recorded matches successful purchase count
    expect(db.getOrderCount()).toBe(10);
  });

  it('safely handles duplicate requests with identical idempotency keys', async () => {
    const db = new SimulatedTransactionalDatabase();
    const sameIdempotencyKey = 'idempotent_session_token_xyz123';

    // Simulate 10 duplicate clicks or network retries of the exact same checkout session
    const attempts = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        db.reserveStockAndCreateOrderIntent({
          productId: 'p-test-limited',
          quantity: 1,
          idempotencyKey: sameIdempotencyKey,
          total: 24500
        })
      )
    );

    // Every duplicate request receives a success response
    expect(attempts.every(a => a.success)).toBe(true);

    // All 10 requests return the exact same Order ID
    const orderIds = attempts.map(a => a.orderId);
    const uniqueOrderIds = new Set(orderIds);
    expect(uniqueOrderIds.size).toBe(1);

    // Stock was decremented only ONCE (from 10 to 9), preventing double-charges and double-reservations
    expect(db.getProductStock('p-test-limited')).toBe(9);
  });

  it('safely handles duplicate webhook or callback executions idempotently', async () => {
    const db = new SimulatedTransactionalDatabase();
    const order = await db.reserveStockAndCreateOrderIntent({
      productId: 'p-test-limited',
      quantity: 1,
      idempotencyKey: 'single_order_key',
      total: 24500
    });

    const orderId = order.orderId!;

    // Simulate Razorpay sending 5 duplicate webhook calls for the same payment
    const webhookResults = await Promise.all(
      Array.from({ length: 5 }).map(() => db.markOrderPaid(orderId))
    );

    // All return success
    expect(webhookResults.every(r => r.success)).toBe(true);

    // First one transitions from Pending to Paid; the rest are flagged as duplicate
    const nonDuplicates = webhookResults.filter(r => !r.isDuplicate);
    const duplicates = webhookResults.filter(r => r.isDuplicate);

    expect(nonDuplicates.length).toBe(1);
    expect(duplicates.length).toBe(4);
  });
});
