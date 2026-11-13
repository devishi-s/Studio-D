# Studio D: Authoritative Development Roadmap

> This document preserves the original Studio D architecture canvas roadmap and its supporting implementation plan.
>
> **Do not reorder, merge, simplify, or skip roadmap steps without explicit user approval.**

## How to Use This Roadmap

1. Read `AI_CONTEXT.md` first.
2. Continue from the first unchecked item in roadmap order.
3. Complete only one roadmap step at a time unless the user instructs otherwise.
4. Respect the dependencies and implementation notes attached to each step.
5. After completing one step:
   - mark its checkbox complete;
   - move the **Current Step** marker;
   - update the project state in `AI_CONTEXT.md`;
   - verify the implementation before reporting completion.
6. Never execute Git commands automatically. Recommend them and wait for explicit confirmation.

## Status

- **Current phase:** Phase 6 — Launch / production readiness (**paused** for UI polish)
- **Current step:** 6.3 Razorpay test mode (local) — resume when asked
- **Completed phases:** Phases 1–5 (feature work) + launch prep done so far: remote DB SQL + admin user, product photos in Storage
- **Backend:** Full Phase 4 commerce path live (checkout, Razorpay, orders, admin, Resend hooks)
- **Payments:** Razorpay wired (test/live keys still required)
- **Email:** Resend code ready; real key + inbox config still open (Studio D mailbox deferred)
- **Analytics:** Currently Vercel Analytics/Speed Insights — must switch for Render hosting
- **Deployment:** **Render** (user decision; replaces earlier Vercel plan). Deploy only when explicitly requested.

## Original Delivery Strategy

The original plan has five phases. Each phase should produce a working, deployable milestone. The strategy is to ship early, validate the experience, and add complexity only when the preceding layer is stable.

Core dependency chain:

```text
Static storefront
  → Cart and interaction
  → Supabase, authentication, and real catalog data
  → Secure checkout, orders, and Razorpay
  → SEO, performance, analytics, reviews, wishlist, and launch
```

---

# Phase 1: Foundation + Static Storefront

**Original goal:** A beautiful, browsable storefront with hardcoded data. Deploy to Vercel.

**Milestone state:** Storefront implementation is complete and the production build passed. The project is deployable, but an actual Vercel deployment has not been verified.

## 1.1 Project setup

- [x] Initialize Next.js with the App Router.
- [x] Enable TypeScript, Tailwind CSS, ESLint, `src/`, and the `@/` import alias.
- [x] Initialize shadcn/ui.
- [x] Establish the scalable source folder structure.

**Original implementation note:** Install only the libraries needed for the current phase. Do not install the entire future stack at project initialization.

## 1.2 Brand theming

- [x] Define the Studio D brand palette.
- [x] Configure cream, blush, brown, warm brown, sage, coral, and honey-gold tokens.
- [x] Configure Playfair Display for headings and Geist for body copy.
- [x] Establish global styling and subtle animation utilities.

**Reasoning:** The logo is the visual source of truth. Shared tokens keep the experience consistent and make later design adjustments safe.

## 1.3 Layout shell

- [x] Build the global `RootLayout`.
- [x] Build a responsive Navbar.
- [x] Add Studio D logo/text.
- [x] Add desktop navigation.
- [x] Add responsive mobile hamburger navigation.
- [x] Build the Footer.
- [x] Build a reusable page `Container`.
- [x] Integrate the global Sonner toaster.

**Planned shell behavior:**

- Navbar includes navigation and cart access.
- Footer contains navigation, brand copy, social placeholders, and room for a future newsletter.
- Layout remains elegant, warm, minimal, and mobile responsive.

## 1.4 Homepage

- [x] Build the Hero section.
- [x] Build the Category showcase.
- [x] Build the Featured products section.
- [x] Build the Brand story section.
- [x] Use static mock data.
- [x] Add responsive layouts and subtle motion.

**Original homepage composition:**

```text
RootLayout
├── Navbar
├── HomePage
│   ├── HeroBanner
│   ├── CategoryShowcase
│   │   └── CategoryCard
│   ├── FeaturedProducts
│   │   └── ProductCard
│   ├── BrandStory
│   └── Testimonials (planned future enhancement)
└── Footer
```

**Implementation decision:** The hero’s “Our Story” secondary button was removed at the user’s request. “Explore Collection” remains the primary CTA.

## 1.5 Product listing page

- [x] Build `/products`.
- [x] Render a responsive `ProductGrid`.
- [x] Build reusable `ProductCard` components.
- [x] Add category filtering.
- [x] Add sorting by newest, price, and name.
- [x] Store filter and sort state in URL search parameters.
- [x] Add sale, bestseller, and new badges.

**Reasoning:** URL state is shareable, bookmarkable, refresh-safe, and compatible with server-rendered pages.

## 1.6 Product detail page

- [x] Build `/products/[slug]`.
- [x] Resolve products from static catalog data.
- [x] Handle invalid product slugs with `notFound()`.
- [x] Generate static route parameters.
- [x] Generate product metadata.
- [x] Build a simple interactive image gallery.
- [x] Display name, category, price, sale price, description, materials, and dimensions.
- [x] Show stock messaging.
- [x] Add related products from the same category.
- [x] Add trust badges.

**Original planned component:** `ProductGallery` with carousel/zoom behavior. The current implementation provides an interactive gallery using placeholders; full real-image carousel and zoom remain future polish.

## 1.7 Category page

- [x] Build `/categories`.
- [x] Build `/categories/[slug]`.
- [x] Filter products by category.
- [x] Reuse `ProductGrid` and `ProductCard`.
- [x] Add category title, description, product count, and sorting.
- [x] Handle invalid category slugs.
- [x] Generate static category parameters.

## 1.8 About page

- [x] Build `/about`.
- [x] Present the Studio D origin story.
- [x] Add brand values.
- [x] Add timeline/milestones.
- [x] Add team placeholders.
- [x] Keep the page responsive and consistent with the brand.

---

# Phase 2: Cart + Interactivity

**Original goal:** Users can add items to a cart, adjust quantities, and see totals.

## 2.1 Zustand cart store

- [x] Install Zustand.
- [x] Create a global cart store.
- [x] Add items with quantity.
- [x] Remove items.
- [x] Update quantity.
- [x] Clear the cart.
- [x] Calculate total item count.
- [x] Calculate subtotal.
- [x] Persist cart state to `localStorage`.
- [x] Keep persisted items lean: product reference plus quantity only.

**Current persisted shape:**

```ts
type CartItem = {
  productId: string;
  quantity: number;
};
```

**Reasoning:** Persisting complete product objects duplicates catalog data and allows stale names, prices, and inventory. Product details are resolved when rendering.

## 2.2 Add-to-cart button

- [x] Create a reusable Client Component.
- [x] Connect it to the Zustand store.
- [x] Use it on product cards.
- [x] Use it on product detail pages.
- [x] Add a product-detail quantity selector.
- [x] Respect selected quantity.
- [x] Show Sonner confirmation.
- [x] Disable or show feedback for out-of-stock products.
- [x] Support compact and full-size styling variants.

## 2.3 Cart page

- [x] Build `/cart`.
- [x] Display all Zustand cart items.
- [x] Show product image, name, category, unit price, quantity controls, remove action, and line total.
- [x] Show item count and subtotal.
- [x] Add a branded empty state and shopping CTA.
- [x] Add continue-shopping navigation.
- [x] Add clear-cart behavior.
- [x] Make the layout mobile responsive.
- [x] Keep checkout disabled.

**Reasoning:** This step is cart management only. Payment or order creation must not be simulated.

## 2.4 Cart drawer/sidebar

- [x] Add a quick-access cart Sheet from the Navbar.
- [x] Add a live cart-count badge.
- [x] Show line items, quantity controls, removal, and subtotal.
- [x] Add empty-cart behavior.
- [x] Link to the full cart page.
- [x] Prevent persisted-state hydration mismatch with `useMounted()`.

**Base UI note:** Do not render a Next.js `Link` through `SheetClose` when it expects native button semantics. Close the Sheet via state when navigating.

## 2.5 Contact page

- [x] Build `/contact`.
- [x] Add a simple, branded contact form.
- [x] Include name, email, subject/reason, and message fields.
- [x] Add clear validation and accessible labels.
- [x] Add success and error feedback.
- [x] Add Studio D contact details/social placeholders where appropriate.
- [x] Make the page mobile responsive.
- [x] Preserve the handmade, warm brand voice.
- [x] Keep direct email delivery explicitly deferred until a backend/email service is available; use an honest `mailto:` draft handoff for now.

**Dependency note:** A presentational form can be built now. Reliable email delivery requires a later service such as Resend, Supabase Edge Functions, or another explicitly approved endpoint. Do not pretend a message was delivered if no backend exists.

---

# Phase 3: Supabase + Auth + Real Data

**Original goal:** Real database, user accounts, and dynamic product data.

**Dependency:** Begin only after Phase 2 is complete.

## 3.1 Supabase setup

- [x] Create the Supabase project (operator creates the cloud project; steps documented in `docs/SUPABASE.md`).
- [x] Configure environment variables (`.env.example` + local `.env.local` placeholders).
- [x] Add browser and server Supabase clients (`src/lib/supabase/*` + Next.js 16 `src/proxy.ts`).
- [x] Define the PostgreSQL schema (`supabase/schema.sql`).
- [x] Seed initial catalog data (`supabase/seed.sql`: 22 products).
- [x] Configure Row Level Security policies.
- [x] Add required indexes and constraints.
- [x] Document local and production configuration (`docs/SUPABASE.md`).

### Original high-level entities

#### `products`

`id`, `name`, `slug`, `description`, `price`, `compare_at_price`, `images[]`, `category_id`, `tags[]`, `stock_count`, `is_featured`, `is_active`, `created_at`

#### `categories`

`id`, `name`, `slug`, `description`, `image_url`, `display_order`, `is_active`

#### `orders`

`id`, `user_id`, `status`, `total_amount`, `shipping_address`, `payment_id`, `created_at`

Expected statuses: `pending`, `confirmed`, `shipped`, `delivered`, and `cancelled`.

#### `order_items`

`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `total_price`

#### Supabase Auth and `profiles`

Auth user ID plus `email`, `full_name`, `phone`, and `avatar_url` in an application profile linked to `auth.users`.

#### `reviews`

`id`, `product_id`, `user_id`, `rating`, `comment`, `is_approved`, `created_at`

**Reasoning:** Supabase provides PostgreSQL, authentication, file storage, realtime capabilities, and a practical free tier while retaining relational SQL.

## 3.2 Product data migration

- [x] Move categories from static TypeScript data to Supabase (product `category` slug is live; category metadata/index still uses static `categories` until a dedicated table lands).
- [x] Move products from static TypeScript data to Supabase.
- [x] Preserve existing product/category TypeScript contracts where practical.
- [x] Replace static lookups with server-side data access helpers (`src/lib/supabase/products.ts`).
- [x] Update static/dynamic rendering strategy appropriately (`revalidate = 60`, public client without cookies).
- [x] Add loading, error, empty, and unavailable-product states.
- [x] Ensure inactive products are excluded from storefront results.

**Dependency:** Requires Supabase schema, seed data, and RLS.

## 3.3 Authentication flow

- [x] Build `/login`.
- [x] Build `/signup`.
- [x] Add password-reset flow (`/reset-password`).
- [x] Add email/password authentication through Supabase Auth.
- [ ] Add Google OAuth if approved/configured.
- [x] Store sessions securely in cookies (`@supabase/ssr` + `/auth/callback`).
- [x] Add middleware/server authorization where needed (proxy guards `/account`).
- [x] Add validation and actionable error messages.

**Security note:** Never treat client-side auth state as authorization. Protected data and mutations require server/RLS enforcement.

## 3.4 User profile and order history

- [x] Build `/account`.
- [x] Build `/account/orders`.
- [x] Build `/account/orders/[id]`.
- [x] Display profile information.
- [x] Display order history.
- [x] Display individual order details and status.
- [x] Protect all account routes (`requireUser` + proxy `redirectTo`).

**Dependency:** Requires authentication and the order schema. Meaningful order history also depends on Phase 4 order creation.

## 3.5 Image storage: **COMPLETE**

- [x] Configure Supabase Storage buckets and access policies (`supabase/storage.sql`, docs in `docs/SUPABASE.md`).
- [x] Keep seeded mock `/images/...` paths; document how to upload real assets later.
- [x] Resolve storage-relative paths via `getPublicImageUrl` / `resolveProductImagePath`.
- [x] Render product photos through `next/image` (`ProductImage` + `remotePatterns`).
- [x] Provide width/height or `fill`, responsive `sizes`, and meaningful alt text.
- [x] Add fallbacks for missing / mock assets (`ImagePlaceholder`).
- [x] Use `priority` on primary gallery image; lazy load elsewhere via `next/image` defaults.

## 3.6 Search and filters: **COMPLETE**

- [x] Add search by product name (`ilike` via Supabase).
- [x] Filter by category.
- [x] Filter by price (min/max).
- [x] Preserve sort options (applied in the catalog query).
- [x] Keep state in URL search parameters (`search`, `category`, `minPrice`, `maxPrice`, `sort`).
- [x] Query the real Supabase catalog efficiently (`getAllProducts(filters)`).
- [x] Add no-results and reset-filter states.

---

# Phase 4: Checkout + Payments

**Original goal:** Complete the purchase flow with Razorpay integration.

**Dependencies:** Real catalog data, secure server environment, authentication decision, database schema, and verified cart behavior.

## 4.1 Checkout form: **COMPLETE**

- [x] Build `/checkout`.
- [x] Collect shipping address.
- [x] Collect customer contact information.
- [x] Display an order summary.
- [x] Validate forms with React Hook Form and Zod.
- [x] Revalidate product existence, prices, quantities, and stock on the server.
- [x] Define shipping and tax behavior (flat ₹79 delivery under ₹999; prices tax-inclusive).
- [x] Prevent checkout for invalid or unavailable items.
- [x] Keep sensitive logic off the client (server `validateCheckoutCart`; no payment yet).

## 4.2 Razorpay integration: **COMPLETE**

- [x] Create Razorpay orders on the server (`/api/checkout/create-order`).
- [x] Launch Razorpay checkout from the client using the server-created order.
- [x] Verify payment signatures on the server (`/api/checkout/verify-payment`).
- [x] Handle Razorpay webhooks securely (`/api/checkout/webhook`; fulfillment idempotency in 4.3).
- [x] Store provider order/payment identifiers (returned to client; DB persistence in 4.3).
- [x] Handle success, failure, cancellation, retry, and duplicate-event cases (client toasts + verify; DB dedupe in 4.3).
- [x] Show an order confirmation only after verified server state (payment-received UI; full order page in 4.3).

**Non-negotiable security rule:** Never trust prices, totals, inventory, user identity, or payment success supplied by the browser.

## 4.3 Order management: **COMPLETE**

- [x] Create orders and immutable order-item snapshots.
- [x] Track order status (`confirmed` on paid checkout; history UI already live).
- [x] Reserve/decrement inventory safely (`decrement_product_stock` + shortfall review flag).
- [x] Handle failed or abandoned payments (no DB row until verify; paid-but-save-failed support message).
- [x] Add order-confirmation experience (`/order-confirmation/[orderId]`).
- [x] Expose customer order history (`/account/orders`: already wired; now receives real rows).
- [x] Support operational status updates (schema + account badges; admin tooling in 4.4).

## 4.4 Admin dashboard: **COMPLETE**

- [x] Build protected `/admin` (`requireAdmin` + `profiles.is_admin` + RLS).
- [x] Build `/admin/products` (list, featured/stock controls, add/edit/delete).
- [x] Build `/admin/orders` (list, detail, status updates).
- [x] Add product creation, editing, activation, and inventory management.
- [x] Add order listing, detail, and status management.
- [x] Add basic analytics (orders, revenue, low stock, recent orders).
- [x] Enforce admin authorization on the server and through RLS (`supabase/admin-rls.sql`).

## 4.5 Email notifications: **COMPLETE**

- [x] Select Resend (React Email templates + server helpers).
- [x] Send order confirmation (customer) after verified payment.
- [x] Send new-order admin alert at the same time.
- [ ] Send shipping/status updates (deferred: admin status changes can hook later).
- [x] Use branded responsive templates (`lib/email/templates`).
- [x] Handle delivery failures without blocking orders (log + continue).
- [x] Keep email credentials server-side (`RESEND_API_KEY`).

---

# Phase 5: Polish + Launch

**Original goal:** Production-ready SEO, performance, analytics, reviews, and future engagement features.

**Dependency:** Core purchase flow must be secure and stable.

## 5.1 SEO: **COMPLETE**

- [x] Add complete page metadata.
- [x] Add canonical URLs.
- [x] Add Open Graph and social sharing metadata.
- [x] Add product and organization JSON-LD.
- [x] Generate `sitemap.xml`.
- [x] Configure `robots.txt`.
- [x] Verify indexability and invalid-page behavior.
- [ ] Add meaningful alt text and semantic headings.

## 5.2 Performance: **COMPLETE**

- [x] Optimize all images.
- [x] Add lazy loading where appropriate.
- [x] Tune Core Web Vitals.
- [x] Minimize Client Component boundaries and shipped JavaScript.
- [x] Add loading skeletons where they improve perceived speed.
- [x] Audit fonts, caching, data fetching, and bundle size.
- [ ] Test on slower mobile devices and networks.

## 5.3 Analytics: **COMPLETE**

- [x] Select Google Analytics or Plausible. → Chose Vercel Analytics + Speed Insights
- [x] Add privacy-conscious page analytics.
- [x] Track product views.
- [x] Track Add to Cart.
- [x] Track checkout progress.
- [x] Track purchase conversion.
- [x] Avoid collecting sensitive customer/payment information.

## 5.4 Reviews system: **COMPLETE**

- [x] Add customer ratings and reviews to product pages.
- [x] Build a reusable `StarRating`.
- [x] Restrict submission appropriately.
- [x] Add moderation/approval.
- [x] Add empty, loading, and error states.
- [x] Ensure aggregate rating data is accurate.

## 5.5 Wishlist: **COMPLETE**

- [x] Add authenticated “save for later” behavior.
- [x] Add wishlist UI on product cards and details.
- [x] Add an account wishlist view.
- [x] Persist wishlist data in Supabase.
- [x] Handle signed-out users gracefully.

---

# Phase 6: Launch / production readiness

**Goal:** Soft-launch Studio D on **Render** with real payments, workable email, and production verification. Not another feature build phase.

**Already done (do not re-do):**
- [x] Remote DB: `orders-checkout.sql`, `admin-rls.sql`, `reviews.sql`, `wishlist.sql` (+ related catalog/storage SQL as needed)
- [x] Admin user: `profiles.is_admin = true`
- [x] Product photos uploaded to Supabase Storage
- [x] Storefront UI polish beyond the original Phase 5 checklist

**Hosting decision:** Deploy on **Render**, not Vercel. Do not reconnect launch docs to Vercel Preview/Production assumptions.

**Constraint:** No Studio D business email yet. Use a personal inbox for admin alerts until a domain mailbox exists. Branded `orders@studiod.in` / Resend domain verification is deferred (6.11), not a hard block for first soft launch.

## 6.1 Interim contact + admin inbox: **COMPLETE**

- [x] Pick the studio inbox for new-order alerts (`ADMIN_NOTIFICATION_EMAIL`).
- [x] Document the inbox in `.env.local` (never commit secrets; repeat on Render in 6.8).
- [x] Contact / support / SEO JSON-LD use `getSiteContactEmail()` (env-driven; no hardcoded `hello@studiod.in`).

## 6.2 SEO assets for share/preview: **COMPLETE** (site URL deferred)

- [x] Replace OG image → `public/images/og-image.png` (wired as `OG_IMAGE_PATH`).
- [ ] Set `NEXT_PUBLIC_SITE_URL` when a Render URL or custom domain exists (no domain yet; code falls back to `https://studiod.in`).

## 6.3 Razorpay test mode (local): **CURRENT**

- [ ] Add Razorpay **test** keys to `.env.local` (`docs/PAYMENTS.md`).
- [ ] Complete one successful test checkout locally (UPI/card test methods).
- [ ] Confirm order appears in `/account/orders` and `/admin/orders`.
- [ ] Keep **live** keys out of `.env.local`; live keys only on Render Production later.

## 6.4 Resend (workable without Studio D mailbox)

- [ ] Create Resend account + real `RESEND_API_KEY` in `.env.local`.
- [ ] Set `ADMIN_NOTIFICATION_EMAIL` to the interim personal inbox from 6.1.
- [ ] Accept interim sender limits: without a verified domain, onboarding sender only reliably reaches the Resend account email — enough to prove the pipeline.
- [ ] Trigger one paid test order and confirm admin alert and/or customer mail path logs successfully.

## 6.5 Analytics for Render (“live tracking”)

- [ ] Replace Vercel Analytics + Speed Insights (they do not serve Render hosting).
- [ ] Choose **Plausible** (preferred, privacy-friendly) or **GA4** (if already using Google tools).
- [ ] Wire page views + existing funnel events from `src/lib/analytics.ts`.
- [ ] Update `docs/ANALYTICS.md` to match the new provider.
- [ ] Verify events fire locally / on a Render preview URL.

## 6.6 Local full-funnel smoke test

Walk once before deploy:

- [ ] Browse → search/filter → wishlist → cart → checkout → Razorpay test pay → order confirmation
- [ ] Admin: see order + approve a review
- [ ] Login/logout, account/orders/wishlist, contact, mobile layout

## 6.7 Production Supabase project

- [ ] Create a separate **PROD** Supabase project (current cloud project stays **DEV**).
- [ ] Apply schema/SQL in order (`docs/SUPABASE.md`); never run `seed.sql` on PROD if it truncates.
- [ ] Promote admin on PROD; copy/migrate Storage images as needed.
- [ ] Point only Render **production** at PROD. Local + any Render preview stay on DEV.

## 6.8 Render deploy (only when user explicitly asks)

- [ ] Add Render Web Service for Next.js (`npm run build` / `npm run start`, Node version aligned with local).
- [ ] Set production env vars (Supabase PROD, Razorpay, Resend, `ADMIN_NOTIFICATION_EMAIL`, site URL).
- [ ] Configure custom domain when ready; update Supabase Auth Site URL + redirect allowlist.
- [ ] Point Razorpay webhook to the public HTTPS `/api/checkout/webhook` URL.
- [ ] Do **not** put Razorpay live keys on preview/staging if one exists.

## 6.9 Post-deploy verification

- [ ] Production smoke test (same funnel as 6.6, test mode first; live mode only when ready)
- [ ] Sitemap/robots + OG share preview
- [ ] Analytics events appearing
- [ ] Email + Razorpay webhook callbacks
- [ ] Soft-launch CWV monitoring (`docs/PERFORMANCE.md`)

## 6.10 Later / not blocking soft launch

- [ ] Studio D business email + verified Resend sending domain (`orders@` / `hello@`)
- [ ] Contact form beyond `mailto:`
- [ ] Formal test suite / a11y / reduced-motion polish (cross-cutting backlog)
- [ ] Google OAuth (never required)
- [ ] Shipping status emails when admin updates order status

---

# Planned Route Inventory

This route inventory was part of the original canvas and must remain aligned with the phases above.

## Phase 1

- [x] `/`
- [x] `/products`
- [x] `/products/[slug]`
- [x] `/categories/[slug]`
- [x] `/about`

## Phase 2

- [x] `/cart`
- [x] `/contact`

## Phase 3

- [x] `/login`
- [x] `/signup`
- [x] `/account`
- [x] `/account/orders`
- [x] `/account/orders/[id]`

## Phase 4

- [x] `/checkout`
- [x] `/admin`
- [x] `/admin/products`
- [x] `/admin/orders`

## Phase 5

- [x] `/admin/reviews`
- [x] `/account/wishlist`

---

# Planned Reusable Component Inventory

These components were identified in the original architecture. Existing equivalents count as implementation even when the final name differs.

## Layout

- [x] Navbar
- [x] Footer
- [x] Container
- [ ] PageHeader
- [x] Responsive mobile navigation
- [x] Cart count badge
- [ ] Auth-state navigation
- [ ] Footer newsletter signup

## Product

- [x] ProductCard
- [x] ProductGrid
- [x] Interactive ProductGallery foundation
- [ ] Full real-image carousel/zoom
- [x] Price formatting/display behavior
- [x] AddToCartButton
- [x] QuantitySelector
- [ ] Product-grid loading skeletons

## Cart

- [x] CartDrawer/CartSheet
- [x] CartItem
- [x] CartSummary
- [x] CartBadge

## Common

- [x] Logo
- [x] Branded empty states in cart experiences
- [ ] General reusable EmptyState abstraction
- [ ] LoadingSkeleton
- [x] CategoryCard
- [ ] StarRating
- [x] Product badges for sale/new/bestseller

---

# Cross-Cutting Quality Requirements

These requirements apply throughout the original roadmap rather than replacing any phase item.

## Responsive Design

- [x] Existing storefront, navigation, product, and cart experiences are responsive.
- [ ] Verify every new route at mobile, tablet, laptop, and wide desktop breakpoints.
- [ ] Verify touch targets and overflow on real or emulated mobile devices.

## Motion

- [x] Establish subtle global entrance and hover motion.
- [ ] Respect reduced-motion preferences during final polish.
- [ ] Keep motion understated and purposeful.

## Accessibility

- [ ] Verify semantic headings and landmarks on every route.
- [ ] Verify labels, descriptions, validation, and errors for every form.
- [ ] Verify keyboard navigation, focus visibility, and Sheet/Dialog behavior.
- [ ] Verify color contrast and meaningful image alt text.
- [ ] Avoid incorrect Base UI native element semantics.

## Testing and Verification

The original canvas did not create a separate testing phase; testing is a completion requirement for each step and a launch gate.

- [ ] Add unit tests for cart store actions and derived totals.
- [ ] Add tests for filtering, sorting, and data helpers.
- [ ] Add form validation tests.
- [ ] Add integration tests for authentication and protected routes.
- [ ] Add checkout/order/payment integration tests before launch.
- [ ] Add end-to-end coverage for browse → cart → checkout → confirmation.
- [ ] Test empty, loading, error, out-of-stock, invalid-route, and payment-failure paths.
- [ ] Run TypeScript, lint, build, and relevant tests after each roadmap step.

## Deployment and Launch

Superseded in detail by **Phase 6**. Keep these as launch gates:

- [ ] Verify environment variable separation between local, Render preview (if any), and Render production.
- [ ] Deploy to **Render** only when explicitly requested (Phase 6.8).
- [ ] Connect production Supabase and Razorpay credentials only through secure environment variables.
- [ ] Configure domains, redirects, headers, and image hosts.
- [ ] Run production smoke tests.
- [ ] Verify SEO, analytics, email, webhooks, and payment callbacks in production.
- [ ] Document rollback and operational recovery steps.

---

# Known Improvements to Address in Their Relevant Steps

- [ ] Enforce product `stockCount` in every cart quantity control, not only the product-detail selector.
- [ ] Decide whether shared quantity controls should replace duplicated Sheet/page implementations.
- [x] Wire Supabase Storage + `next/image` for product photos (real photos uploaded for launch prep).
- [ ] Add cart persistence versioning/migration before catalog identifiers change.
- [x] Add stronger loading and error boundaries during backend migration (`src/app/not-found.tsx`, `error.tsx`, `global-error.tsx`).
- [ ] Confirm Render deployment status (was Vercel; hosting decision changed).

---

# Current Handoff

Phases 1–5 feature work are complete. **Current focus: Phase 6 Launch** — **6.3 Razorpay test keys** locally, then 6.4 → 6.10 in order.

**Done already:** remote DB + `is_admin`, product photos in Storage, storefront UI polish.

**Hosting:** **Render** (not Vercel). Analytics must leave `@vercel/analytics` / Speed Insights (6.5).

**Launch / env decisions:** two Supabase projects at go-live (current cloud = DEV; new = PROD). Local + any Render preview use DEV; Render production uses PROD. Never run `supabase/seed.sql` on PROD. Razorpay webhooks need a public HTTPS URL (Render). No Studio D business email yet — personal `ADMIN_NOTIFICATION_EMAIL` until 6.10/6.11. Full brief: Cursor canvas `studio-d-launch-readiness.canvas.tsx` and `AI_CONTEXT.md` section "Launch and ops decisions".
