# VERNOX HORIZONTAL SCALABILITY & PEAK TRAFFIC DESIGN

## 1. Zero In-Memory Shared State
To support scaling to $N$ independent node instances behind a load balancer without data collisions or session affinity requirements:
- **Stateless Web Tier**: No sessions, carts, or order holds are stored in local RAM (`process.memory`).
- **Distributed Invariants**: All critical state (order status, inventory stock levels, idempotency tokens) resides in Cloud Firestore.
- **Client Cache**: Carts and guest states reside in localStorage on the client device and are synchronized with Firestore on login.

## 2. Handling High-Traffic Drops & Flash Sales
- **Atomic Stock Reservation**:
  - Instead of standard `read-then-write` queries which cause race conditions and overselling, Vernox employs Firestore ACID transactions (`runTransaction`).
  - During concurrent requests on the same product, transactions detect version mutations and re-evaluate stock atomically.
  - Transactions ensure `stock >= 0` invariant strictly.
- **Idempotency Keys**:
  - When users double-click checkout buttons or submit rapid network retries, the server checks the `idempotencyKey`. If an intent already exists, the server returns the existing order intent without decrementing stock a second time or creating duplicate payments.

## 3. Rate Limiting & Edge Caching
- Static catalog data, category listings, and aesthetic assets are cached at the edge via CDN with `stale-while-revalidate` policies.
- Dynamic endpoints (`/api/checkout-intent`, `/api/verify-payment`) bypass CDN caches and execute directly against the serverless database layer.
