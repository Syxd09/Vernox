# VERNOX ATELIER · COMPLETE SYSTEM DOSSIER & ARCHITECTURAL SPECIFICATION

> **Target Audience**: AI Engineering Assistants, Lead Architects, Full-Stack Developers, Security Auditors, and Production SREs.
> **Scope**: 100% comprehensive, exhaustive architectural, programmatic, data-model, UX, and operational breakdown of the Vernox platform.

---

## 1. BRAND IDENTITY, AESTHETICS & ATELIER PHILOSOPHY

### 1.1 Brand Positioning
**Vernox Atelier** is an ultra-luxury digital destination and custom fabrication platform specializing in precision laser-cut architectural metal art, bespoke wall reliefs, and sculptural masterworks. 
* **Provenance**: Rooted in Antwerp and European architectural design traditions.
* **Core Product Invariant**: Rejects disposable decor, paper prints, and thin stamped foils. Everything is sculptured from **solid 3.0mm structural plate** (brass, marine stainless steel, Cor-Ten weathering steel, and cold-rolled mild steel).
* **Engineering Precision**: Cut with a **3000W nitrogen-shielded industrial fibre laser** at 18-bar inert gas pressure to eliminate edge oxidation, achieving ±0.05mm kerf computational tolerance.
* **Mounting Standard**: Every piece is engineered for **25mm architectural standoff wall mounts**, projecting genuine light-and-shadow reliefs against limestone, concrete, or plaster gallery walls.

### 1.2 Metallurgical Palette & Alloy Specifications
1. **Antwerp Brass (CZ108 / CW508L)**:
   * Composition: 63% Copper, 37% Zinc.
   * Finish: Hand-grained satin hairline with archival microcrystalline wax sealant.
   * Visual Tone: Warm gold champagne (`#D4AF37` / `#B98B48`).
2. **Surgical Marine Stainless (AISI 316L / 1.4404)**:
   * Composition: Low-carbon austenitic stainless alloyed with 2% molybdenum for marine atmospheric corrosion resistance.
   * Finish: Directional satin scotch-brite or mirror luster.
   * Visual Tone: Pristine silver grey (`#A6B0BB` / `#E2E8F0`).
3. **Cor-Ten Weathering Steel (EN 10025-5 / Cor-Ten A)**:
   * Composition: Structural steel alloyed with copper, chromium, and nickel.
   * Finish: Accelerated patination yielding an insoluble, self-healing iron-oxide surface.
   * Visual Tone: Architectural rust / terracotta (`#994F28` / `#C05621`).
4. **French Bronze Patina**:
   * Chemical liver-of-sulphur cold patination on bronze/brass plate sealed with dark wax.
   * Visual Tone: Deep rich burnished chocolate with golden under-highlights (`#4A3525`).
5. **Obsidian Velvet Powder Coat**:
   * Industrial electrostatic thermoset polymer coat cured at 200°C.
   * Visual Tone: Ultra-matte 5% gloss root black (`#0B0B0B` / `#111111`).

### 1.3 Design System & Typographic Tokens
* **Editorial Headlines**: *Instrument Serif* (`font-editorial`), featuring oversized scales (`text-5xl` to `text-8xl`), italicized emphasis, and ultra-tight line height (`leading-[0.95]`).
* **Technical UI & Metadata**: *Plus Jakarta Sans* / *Inter* (`font-sans`), tracked with small uppercase letter spacing (`tracking-[0.25em]`).
* **Monospace Gauges**: *JetBrains Mono* / *SF Mono* for precise millimetre measurements, kerf offsets, tolerances, and pricing numbers.
* **Core Color Variables**:
  * Root Background: `--background` (`#0B0B0B` / obsidian)
  * Plate Surface: `--card` (`#111111`)
  * Gallery Parchment: `--ivory` (`#F4F2EE`)
  * Champagne Gold: `--brass` / `--gold` (`#D4AF37`)
  * Atelier Oxblood: `--oxblood` / `--burgundy` (`#5B262C` / `#800020`)
  * Slate Border: `--border` (`rgba(255, 255, 255, 0.1)`)

---

## 2. FULL TECHNOLOGY STACK & INFRASTRUCTURE

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend Core** | React 18.3.1, TypeScript 5.5, Vite 5.4 | Single Page Application with SWC compilation |
| **Routing** | React Router DOM v6.26 (v7 future flags enabled) | Client-side routing with scroll reset and view transitions |
| **Styling & UI** | TailwindCSS v3.4, Radix UI Primitives, Lucide Icons | Responsive styling, accessible dropdowns, dialogs, sliders |
| **State Management** | React Context (`CatalogContext`, `CartContext`), TanStack React Query v5 | Global state, local caching, optimistic mutations |
| **Interactive Motion** | Lenis Smooth Scroll, Framer Motion, Custom Cursor Canvas | Fluid gallery scrolling, cursor hover physics, curtain transitions |
| **CAD / Vector Engine** | HTML5 Canvas, Paper.js, Custom SVG/DXF/G-code Math | 2D vector CAD editor, bitmap image tracer, kerf compensation |
| **Backend & APIs** | Vercel Serverless Functions (`/api/*`), Node.js HTTP (`server/index.ts`) | Server-authoritative checkout, HMAC verification, RBAC admin |
| **Database** | Google Cloud Firestore (Cloud Firestore v10 SDK) | Document store for products, orders, coupons, users, audit logs |
| **Authentication** | Firebase Authentication v10 | Google OAuth, Email/Password, JWT ID token management |
| **Payment Gateway** | Razorpay Node.js SDK + Razorpay Checkout.js Modal | Multi-payment rails (Credit/Debit cards, UPI QR, NetBanking) |
| **Validation & Security** | Zod, Crypto HMAC-SHA256, Sliding-Window IP Rate Limiting | Tamper-proof orders, rate limits, schema validation |

---

## 3. COMPLETE SITEMAP & ROUTE DIRECTORY

```
d:\Vernox\src\
├── App.tsx                        # Root router with providers, toaster, and curtain
├── pages/
│   ├── Home.tsx                   # Luxury editorial landing experience
│   ├── Shop.tsx                   # Curated catalog grid with multi-filtering
│   ├── ProductDetail.tsx          # Single artwork showcase, 3D standoff preview, reviews
│   ├── Index.tsx                  # Full-featured 2D Parametric CAD/CAM Studio (/studio, /customize)
│   ├── Cart.tsx                   # Shopping bag review, quantity adjustment, coupon entry
│   ├── Checkout.tsx               # 3-step checkout with server pricing intent & Razorpay
│   ├── OrderConfirmation.tsx      # Real-time CAM status stepper & order invoice
│   ├── Account.tsx                # Customer profile, order history tracker, wishlist
│   ├── About.tsx                  # Atelier history, metallurgy standards, craftsmanship
│   ├── Notebook.tsx               # Editorial design journal & architecture articles
│   ├── Admin.tsx                  # Enterprise Admin Dashboard wrapper
│   └── NotFound.tsx               # 404 luxury fallback with quick navigational links
```

---

## 4. PRODUCT CATALOG & MASTERWORKS DIRECTORY

The catalog contains **18 Curated Editions** in `src/lib/catalog.ts`:

| ID | Slug | Artwork Title | Category | Base Price (INR/USD) | Finishes | Default Sizes |
|---|---|---|---|---|---|---|
| `prod-01` | `abstract-horizon` | Abstract Horizon | Wall Art | ₹240 | Gold, Brass, Steel | 90×50cm, 140×80cm, 180×100cm |
| `prod-02` | `golden-silence` | Golden Silence | Sculptures | ₹310 | Gold, Brass | 22×38cm, 32×60cm |
| `prod-03` | `sculptural-form` | Sculptural Form | Sculptures | ₹285 | Steel, Brass, Corten | 36×42cm, 54×65cm |
| `prod-04` | `maroon-geometry` | Maroon Geometry | Wall Art | ₹195 | Steel, Brass, Gold | 60×60cm, 90×90cm, 120×120cm |
| `prod-05` | `contemporary-bloom` | Contemporary Bloom | Wall Art | ₹260 | Brass, Steel, Copper | 70×70cm, 100×100cm |
| `prod-06` | `minimal-lines` | Minimal Lines | Wall Art | ₹175 | Steel, Brass, Stainless | 60×80cm, 90×120cm |
| `prod-07` | `bronze-figure` | Bronze Figure | Sculptures | ₹340 | Brass, Gold | 14×48cm, 18×72cm |
| `prod-08` | `linear-harmony` | Linear Harmony | Wall Art | ₹210 | Steel, Brass | 80×40cm, 120×60cm |
| `prod-09` | `celestial-sphere` | Celestial Sphere | Statement | ₹390 | Brass, Gold, Stainless | 80×80cm, 110×110cm |
| `prod-10` | `monolith-relief` | Monolith Relief | Statement | ₹450 | Corten, Steel | 60×150cm, 80×200cm |
| `prod-11` | `executive-desk-arch` | Executive Desk Arch | Office | ₹165 | Brass, Stainless | 30×20cm, 45×30cm |
| `prod-12` | `boardroom-diptych` | Boardroom Diptych | Office | ₹520 | Steel, Brass, Stainless | 2×(60×120cm) |
| `prod-13` | `kinetic-balance` | Kinetic Balance | Showpieces | ₹295 | Brass, Steel | 35×45cm |
| `prod-14` | `verdigris-vessel` | Verdigris Vessel | Showpieces | ₹225 | Copper, Brass | 25×35cm |
| `prod-15` | `floating-shadow-frame` | Floating Shadow Frame | Frames | ₹185 | Steel, Brass, Stainless | 50×70cm, 70×100cm |
| `prod-16` | `hexagonal-lattice` | Hexagonal Lattice | Geometric | ₹270 | Brass, Steel, Corten | 80×80cm, 120×120cm |
| `prod-17` | `botanical-contour` | Botanical Contour | Nature | ₹230 | Steel, Brass, Copper | 60×90cm, 90×135cm |
| `prod-18` | `soundwave-horizon` | Soundwave Horizon | Bespoke | ₹380 | Brass, Stainless | 120×45cm, 180×65cm |

---

## 5. CAD / CAM INDUSTRIAL COMPUTATION PIPELINE

* **Vector Document Model v3.0**: Paper.js + HTML5 Canvas 2D engine with real-world millimetre scaling.
* **Auto-Tracer**: In-browser edge detection & vectorization for client-uploaded images (`VectorTraceModal.tsx`).
* **Toolpath Sequencing**: Automatic grouping into `0_CUT_INTERNAL` (holes, cutouts) cut first, and `1_CUT_PERIMETER` cut last.
* **Kerf Computation**: Offsets internal holes inward by $K/2$ and perimeter outward by $K/2$ (standard: 0.15mm kerf).
* **Industrial Exporters**:
  * CNC G-Code Generator (`gcodeGenerator.ts`): Emits `G00`, `G01`, `M03`, `M05`, `M08`, `M09` for laser cutters.
  * AutoCAD Release 12 DXF Exporter (`dxfExporter.ts`): Color-coded layers ready for industrial CNC workstations.

---

## 6. BACKEND API ROUTE DIRECTORY (`/api/*`)

1. `POST /api/checkout-intent`:
   * Atomically locks inventory using Firestore transactions.
   * Calculates subtotal, 18% GST tax, shipping, and discounts server-side.
   * Generates Razorpay payment order and stores reservation intent with `idempotencyKey`.
2. `POST /api/verify-payment`:
   * Verifies Razorpay HMAC-SHA256 signature using `crypto.timingSafeEqual()`.
   * Transitions order to `Paid` status idempotently.
3. `POST /api/validate-coupon`:
   * Validates promotional codes against expiration, cart minimums, and usage limits with 30 req/min rate limiting.
4. `POST /api/admin`:
   * Authenticated RBAC operations (`super_admin`, `catalog_manager`, `order_manager`, `support_agent`).
   * 5-attempt IP brute-force lockout.
   * Emits immutable entries to `/audit_logs`.
5. `GET /api/health`:
   * SRE health and readiness probe.

---

## 7. FIRESTORE DATABASE COLLECTIONS & SECURITY RULES

13 structured collections secured via `firestore.rules`:
* `products`: Public read, Admin write.
* `orders`: Customer-scoped read (`resource.data.email == request.auth.token.email`), Admin full access, immutable after creation except for admin updates.
* `users` & `wishlists`: Owner-only access (`request.auth.uid == userId`).
* `reviews`: Public read, Authenticated create, Admin moderation.
* `coupons`: Public read active, Admin write.
* `admin_users`: Strictly Admin restricted.
* `audit_logs`: Immutable (`allow update, delete: if false`).

---

## 8. CONCURRENCY & TRANSACTIONAL INVARIANTS

* **Zero Overselling**: 100 concurrent purchases against 10 stock items validated; exactly 10 succeed, 90 safely rejected with `INSUFFICIENT_STOCK`. Inventory never drops below zero.
* **Idempotency**: Duplicate clicks with identical `idempotencyKey` return the original order without double-charging or double-decrementing stock.
* **GST Standard**: Authoritative 18% GST calculation across all orders and test suites.
