# VERNOX DISASTER RECOVERY & INCIDENT RECOVERY PLAN

## 1. Database Backup & Point-in-Time Recovery (PITR)
- **Engine**: Google Cloud Firestore PITR.
- **RPO (Recovery Point Objective)**: Under 1 minute. Cloud Firestore retains continuous revision history for up to 7 days.
- **RTO (Recovery Time Objective)**: Under 15 minutes to restore a collection snapshot to a restored timestamp.
- **Backup Strategy**: Daily automated exports scheduled via Google Cloud Functions to Cloud Storage bucket `gs://vernox-firestore-backups`.

## 2. Payment Gateway Outages & Network Timeouts
- If Razorpay experiences temporary latency or downtime during order creation:
  - Compensating transactions rollback reserved stock automatically in `api/checkout-intent.ts` (`rollbackStock`).
  - Customers are safely informed without funds being deducted.
- If a customer completes payment but closes the browser before redirect:
  - Razorpay Webhook listener delivers the payment event asynchronously.
  - Server confirms payment and updates the order status to `Paid` idempotently.

## 3. Incident Severity Levels & Runbook
- **SEV-1 (Critical)**: Order creation or payment processing failing.
  - Action: Inspect Vercel runtime logs, check Razorpay webhook events, verify Firestore quota and health.
- **SEV-2 (High)**: Catalog or pricing discrepancies.
  - Action: Deploy immediate rollback commit via Vercel instant rollback.
- **SEV-3 (Moderate)**: CAD vector preview generation issues.
  - Action: Client fallback kicks in to standard raster preview.
