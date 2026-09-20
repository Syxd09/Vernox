# VERNOX DATABASE ARCHITECTURE & INDEXING SPECIFICATION

## 1. Database Model: Google Cloud Firestore
Vernox utilizes Cloud Firestore, a document database offering horizontal scaling, multi-region high availability, and document-level ACID transactions.

## 2. Collections & Schemas

### `products`
- **Document ID**: `productId` (e.g. `p-01`, `p-02`).
- **Fields**:
  - `id`: string (Unique identifier)
  - `slug`: string (URL slug)
  - `name`: string
  - `tagline`: string
  - `description`: string
  - `category`: string (Category ID)
  - `price`: number (Authoritative base price in INR)
  - `shapeId`: string (CAD shape template identifier)
  - `finishes`: string[]
  - `sizes`: Array<{ label: string; widthMm: number; heightMm: number; priceDelta: number }>
  - `stock`: number (Authoritative inventory count)
  - `trackInventory`: boolean (Enforces stock checks when true)
  - `updatedAt`: number (Timestamp of last modification)

### `orders`
- **Document ID**: `razorpayOrderId` or generated order identifier.
- **Fields**:
  - `id`: string (Unique order ID)
  - `orderNumber`: string (Formatted human-readable identifier, e.g. `VX-2026-AB12CD`)
  - `razorpayOrderId`: string
  - `razorpayPaymentId`: string (populated upon verification)
  - `status`: `'Pending_Payment' | 'Paid' | 'Designing' | 'Cutting' | 'Finished' | 'Shipped' | 'Delivered' | 'Cancelled'`
  - `idempotencyKey`: string | null (Guarantees at-most-once order creation)
  - `total`: number (Authoritative total in INR)
  - `subtotal`: number
  - `shipping`: number
  - `tax`: number
  - `currency`: string (`INR`)
  - `items`: OrderItem[] (Frozen product snapshot with dimensions, finish, and purchase price)
  - `email`: string (Customer email)
  - `shippingName`: string
  - `shippingAddress`: string
  - `shippingCity`: string
  - `shippingZip`: string
  - `shippingCountry`: string
  - `reservationExpiresAt`: number (15-minute reservation hold timestamp)
  - `placedAt`: number
  - `createdAt`: string

### `users`
- **Document ID**: Firebase Auth UID.
- **Fields**:
  - `email`: string
  - `name`: string
  - `phone`: string
  - `role`: `'customer' | 'admin'`
  - `isAdmin`: boolean
  - `address`: string
  - `city`: string
  - `zip`: string
  - `country`: string

### `wishlists`
- **Document ID**: Firebase Auth UID.
- **Fields**:
  - `productIds`: string[]

## 3. Indexes & Query Patterns
1. **Orders by Idempotency Key**:
   - Query: `collection('orders').where('idempotencyKey', '==', key)`
   - Used by `/api/checkout-intent` to ensure duplicate clicks return the same order.
2. **Orders by Customer Email & Placed Date**:
   - Query: `collection('orders').where('email', '==', email).orderBy('placedAt', 'desc')`
   - Powers the Customer Account Order History.
3. **Products by Category**:
   - Query: `collection('products').where('category', '==', categoryId)`
   - Powers filtered catalog navigation.
