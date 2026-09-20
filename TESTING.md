# VERNOX AUTOMATED TESTING & CONCURRENCY VERIFICATION SPECIFICATION

## 1. Automated Test Suite Architecture
The test suite ensures correctness across three mission-critical domains:
1. **Authoritative Pricing Engine**: Verifies base prices, dimensional area rates, finish markups, tax percentages, and shipping thresholds.
2. **Concurrency & Inventory Invariants**: Simulates peak traffic drops with 100 simultaneous purchase requests hitting limited stock.
3. **Idempotency & Webhook Resilience**: Simulates browser double-clicks and repeated payment provider webhook calls.

## 2. Test Execution
Execute the automated test suite with:
```bash
node --experimental-strip-types src/test/runAllVerifications.ts
```

## 3. Verified Invariants
- **Inventory Invariant**: $\text{Stock} \ge 0$. Stock can never drop below zero under any concurrency condition.
- **Overselling Prevention**: When 100 users buy a product with stock = 10 simultaneously, exactly 10 orders succeed and 90 are safely rejected with `INSUFFICIENT_STOCK`.
- **Checkout Idempotency**: 10 duplicate checkout clicks with the same `idempotencyKey` create exactly 1 order in the database and decrement inventory only once.
- **Webhook Idempotency**: 5 duplicate webhook calls for the same payment transaction transition the order state to `Paid` once, and subsequent calls return `200 OK` with `isDuplicate: true`.
