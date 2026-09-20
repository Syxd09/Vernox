import { calculateServerOrderPricing, PRICING_CONFIG } from '../../api/pricingEngine.ts';

// Simulated Transactional Store modeling Cloud Firestore atomic transactions
class SimulatedTransactionalDatabase {
  private products = new Map<string, { id: string; stock: number; trackInventory: boolean }>();
  private orders = new Map<string, any>();
  private idempotencyRegistry = new Map<string, string>();

  constructor() {
    this.products.set('p-test-limited', {
      id: 'p-test-limited',
      stock: 10,
      trackInventory: true
    });
  }

  async reserveStockAndCreateOrderIntent(params: {
    productId: string;
    quantity: number;
    idempotencyKey: string;
    total: number;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { productId, quantity, idempotencyKey, total } = params;

    if (this.idempotencyRegistry.has(idempotencyKey)) {
      const existingOrderId = this.idempotencyRegistry.get(idempotencyKey)!;
      return { success: true, orderId: existingOrderId };
    }

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

  async markOrderPaid(orderId: string): Promise<{ success: boolean; isDuplicate: boolean }> {
    const order = this.orders.get(orderId);
    if (!order) return { success: false, isDuplicate: false };
    if (order.status === 'Paid') return { success: true, isDuplicate: true };
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

async function runAllTests() {
  console.log('================================================================');
  console.log('       VERNOX CONCURRENCY, INVARIANTS & PRICING TEST SUITE      ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // --- SUITE 1: PRICING ENGINE ---
  console.log('TEST SUITE 1: Server-Authoritative Pricing Engine');
  try {
    const p1 = calculateServerOrderPricing([
      { productId: 'p-01', widthMm: 300, heightMm: 300, finish: 'brass', quantity: 1 }
    ], 'INR');

    assert(p1.items[0].unitPrice === 189, 'p-01 Ember Round Frame calculates unit price 189');
    assert(p1.shipping === 0, 'Orders over 150 receive free shipping (shipping: 0)');
    assert(p1.tax === 15.12, 'Tax 8% correctly calculates 15.12');
    assert(p1.total === 204.12, 'Authoritative total equals 204.12');
    assert(p1.amountInSubunits === 20412, 'Subunit (paise) equals 20,412');

    // Size delta check (Medium · 50cm adds +80)
    const pLarge = calculateServerOrderPricing([
      { productId: 'p-01', widthMm: 500, heightMm: 500, finish: 'brass', quantity: 2 }
    ], 'INR');
    assert(pLarge.items[0].unitPrice === 269, 'Size delta (500x500mm) adds 80 accurately (189 + 80 = 269)');
    assert(pLarge.subtotal === 538, 'Subtotal for 2 medium frames equals 538');

    // Standard shipping check (p-05 is 79 < 150)
    const pSmall = calculateServerOrderPricing([
      { productId: 'p-05', widthMm: 250, heightMm: 250, finish: 'steel', quantity: 1 }
    ], 'INR');
    assert(pSmall.shipping === PRICING_CONFIG.shippingFee, 'Subtotal < 150 incurs standard shipping fee (15)');

    // Reject negative quantity
    let rejectedNegative = false;
    try {
      calculateServerOrderPricing([{ productId: 'p-01', widthMm: 300, heightMm: 300, finish: 'steel', quantity: -2 }], 'INR');
    } catch {
      rejectedNegative = true;
    }
    assert(rejectedNegative, 'Negative product quantities are strictly rejected');
  } catch (err: any) {
    console.error('Pricing Suite Error:', err);
    failed++;
  }

  // --- SUITE 2: CONCURRENCY & INVARIANTS ---
  console.log('\nTEST SUITE 2: Concurrency & Transactional Invariants');
  try {
    const db = new SimulatedTransactionalDatabase();
    const initialStock = db.getProductStock('p-test-limited');
    assert(initialStock === 10, 'Initial product stock is set to 10');

    console.log('  -> Simulating 100 concurrent users purchasing simultaneously...');
    const CONCURRENT_USERS = 100;
    const purchasePromises: Promise<{ success: boolean; orderId?: string; error?: string }>[] = [];

    for (let i = 0; i < CONCURRENT_USERS; i++) {
      purchasePromises.push(
        db.reserveStockAndCreateOrderIntent({
          productId: 'p-test-limited',
          quantity: 1,
          idempotencyKey: `user_${i}_checkout_key`,
          total: 189
        })
      );
    }

    const results = await Promise.all(purchasePromises);
    const successful = results.filter(r => r.success);
    const rejected = results.filter(r => !r.success);

    assert(successful.length === 10, `Exactly 10 purchases succeeded (actual: ${successful.length})`);
    assert(rejected.length === 90, `Exactly 90 purchases safely rejected with INSUFFICIENT_STOCK (actual: ${rejected.length})`);

    const finalStock = db.getProductStock('p-test-limited');
    assert(finalStock === 0, `Final stock is exactly 0 (actual: ${finalStock})`);
    assert(finalStock >= 0, 'CRITICAL INVARIANT: Inventory NEVER dropped below zero');
    assert(db.getOrderCount() === 10, 'Total orders recorded matches successful purchase count (10)');

    // --- SUITE 3: IDEMPOTENCY ---
    console.log('\nTEST SUITE 3: Idempotency & Webhook Resilience');
    const dbIdem = new SimulatedTransactionalDatabase();
    const dupKey = 'idempotent_session_token_xyz123';

    console.log('  -> Simulating 10 duplicate double-clicks with identical idempotencyKey...');
    const dupAttempts = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        dbIdem.reserveStockAndCreateOrderIntent({
          productId: 'p-test-limited',
          quantity: 1,
          idempotencyKey: dupKey,
          total: 189
        })
      )
    );

    const allSucceeded = dupAttempts.every(a => a.success);
    const uniqueOrders = new Set(dupAttempts.map(a => a.orderId));
    assert(allSucceeded, 'All 10 duplicate requests returned success to the client');
    assert(uniqueOrders.size === 1, `All 10 duplicate requests returned identical order ID: ${[...uniqueOrders][0]}`);
    assert(dbIdem.getProductStock('p-test-limited') === 9, 'Stock decremented only ONCE (from 10 to 9)');

    // Webhook duplicate deliveries
    const singleOrder = await dbIdem.reserveStockAndCreateOrderIntent({
      productId: 'p-test-limited',
      quantity: 1,
      idempotencyKey: 'webhook_test_key',
      total: 189
    });

    console.log('  -> Simulating 5 duplicate payment provider webhooks arriving simultaneously...');
    const webhookCalls = await Promise.all(
      Array.from({ length: 5 }).map(() => dbIdem.markOrderPaid(singleOrder.orderId!))
    );

    const nonDups = webhookCalls.filter(w => !w.isDuplicate);
    const dups = webhookCalls.filter(w => w.isDuplicate);
    assert(nonDups.length === 1, 'First webhook transitioned status to Paid');
    assert(dups.length === 4, 'Remaining 4 webhooks handled idempotently without duplicate side-effects');

  } catch (err: any) {
    console.error('Concurrency Suite Error:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
