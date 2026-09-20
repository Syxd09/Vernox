# VERNOX PRODUCTION DEPLOYMENT & DEVOPS SPECIFICATION

## 1. Hosting Architecture
- **Frontend SPA**: Hosted on Vercel Edge Global CDN with immutable static caching for compiled bundles and aggressive asset hashing.
- **Serverless API**: Vercel Serverless Functions running Node.js 20.x in `iad1` (US East) or closest geographical region to customer clusters.
- **Database**: Google Cloud Firestore configured in multi-region high availability (`nam5` or `asia-south1`).

## 2. Environment Variables Configuration
| Variable Name | Environment | Description |
|---|---|---|
| `RAZORPAY_KEY_ID` | Serverless (Private) | Razorpay API Gateway Identifier |
| `RAZORPAY_KEY_SECRET` | Serverless (Private) | Secret key for generating/validating HMAC signatures |
| `VITE_RAZORPAY_KEY_ID` | Client (Public) | Razorpay client checkout modal key |
| `FIREBASE_API_KEY` | Client (Public) | Firebase Auth & Firestore client connection |

## 3. Build & CI/CD Pipeline
- **Validation Pipeline**:
  ```bash
  npm run lint
  npx tsc --noEmit
  npm test
  npm run build
  ```
- **Zero Downtime Deployments**: Vercel automatically deploys atomic preview builds with instant rollback capabilities to any previous production commit.

## 4. Production Health Checks & Readiness
- `/api/checkout-intent` responds with `405 Method Not Allowed` on `GET`, confirming the serverless function is warm and healthy.
- Continuous synthetic monitoring via Pingdom/BetterUptime pinging the root endpoint.
