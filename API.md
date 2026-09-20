# VERNOX API SPECIFICATION

## 1. `POST /api/checkout-intent`
Initializes a checkout intent with server-authoritative pricing recalculation and concurrency-safe inventory reservation.

### Request Headers
- `Content-Type`: `application/json`

### Request Body
```json
{
  "items": [
    {
      "productId": "p-01",
      "widthMm": 300,
      "heightMm": 150,
      "finish": "Brushed Brass",
      "quantity": 1
    }
  ],
  "currency": "INR",
  "idempotencyKey": "uuid-v4-string",
  "customer": {
    "email": "customer@example.com",
    "name": "Jane Doe",
    "address": "123 High Street",
    "city": "Bengaluru",
    "zip": "560001",
    "country": "India"
  }
}
```

### Response `200 OK`
```json
{
  "success": true,
  "order_id": "order_RZP123456789",
  "amount": 3180100,
  "currency": "INR",
  "pricing": {
    "subtotal": 26950,
    "shipping": 0,
    "tax": 4851,
    "total": 31801,
    "items": [...]
  }
}
```

### Error Responses
- `400 Bad Request`: Missing items, invalid dimensions, or missing customer details.
- `409 Conflict`: `INSUFFICIENT_STOCK` (Product stock lower than requested quantity).
- `500 Internal Server Error`: Payment gateway API error or database transaction abort.

---

## 2. `POST /api/verify-payment`
Cryptographically verifies Razorpay payment signatures using HMAC-SHA256 and transitions order status to `Paid`.

### Request Body
```json
{
  "razorpay_order_id": "order_RZP123456789",
  "razorpay_payment_id": "pay_RZP987654321",
  "razorpay_signature": "cryptographic_hmac_hex_hash"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Payment verified and order confirmed successfully",
  "order_id": "order_RZP123456789",
  "payment_id": "pay_RZP987654321",
  "orderNumber": "VX-2026-123456"
}
```

### Idempotency
- Multiple submissions with the same signature and order ID return `200 OK` with `"isDuplicate": true`, preventing duplicate payment accounting.
