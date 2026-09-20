# VERNOX SECURITY ARCHITECTURE & POLICIES

## 1. Threat Model & Mitigations

### A. Broken Authentication & Privilege Escalation
- **Vulnerability Remediated**: Eliminated previous `email.startsWith('admin@')` wildcard checks that permitted arbitrary external users registering an email beginning with `admin@` to gain administrative access.
- **Enforcement**: Access to administrative routes and mutations is restricted to:
  1. Cryptographically verified tokens with role `admin`.
  2. Verified owner accounts (`admin@vernox.com`, `concierge@vernoxatelier.com`).
  3. Strict server-side Firestore security rules in `firestore.rules`.

### B. Payment Verification & Amount Tampering
- **Vulnerability Remediated**: Clients previously passed order totals and line items directly to `/api/verify-payment`.
- **Enforcement**:
  1. Client cannot specify or override amounts. Amounts are computed server-side via `api/pricingEngine.ts`.
  2. Cryptographic signature check: `HMAC_SHA256(razorpay_order_id + '|' + razorpay_payment_id, RAZORPAY_KEY_SECRET)` must match `razorpay_signature` exactly.
  3. Verified transactions transition an existing `Pending_Payment` order document in Firestore to `Paid`.

### C. Cross-User Data Leakage & Cart Isolation
- **Client Separation**: Each client maintains a dedicated cart in local storage (`vernox-cart`), isolated from other browser contexts.
- **Server Separation**: Customer orders in `/orders/{orderId}` are protected by Firestore security rules that require `resource.data.email == request.auth.token.email || isAdmin()`.

### D. Race Conditions & Inventory Exploits
- Concurrent purchase attempts for stock are guarded with Firestore ACID transactions (`runTransaction`).
- Invariant `stock >= 0` is strictly enforced.
- Idempotency keys (`idempotencyKey`) prevent double charges and duplicate order placements upon rapid double-clicking or network retries.

## 2. Secrets Management
- All secrets are injected via secure environment variables:
  - `RAZORPAY_KEY_ID`: Server-side API key ID.
  - `RAZORPAY_KEY_SECRET`: Private HMAC signing secret. Never exposed to browser.
  - `VITE_RAZORPAY_KEY_ID`: Public client-safe gateway identifier.
