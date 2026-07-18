# Studio D — Authoritative Development Roadmap

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

- **Current phase:** Phase 3 — Supabase + Auth + Real Data
- **Current step:** Phase 4.1 — Checkout form
- **Completed phases:** Phases 1 and 2
- **Completed Phase 2 steps:** 5 of 5
- **Completed Phase 3 steps:** 6 of 6
- **Backend:** Catalog + auth + account/orders + Storage + search/filters live; no checkout orders yet
- **Payments:** Not started
- **Checkout:** Not started
- **Deployment:** Intended for Vercel; current deployment status is unverified

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

# Phase 1 — Foundation + Static Storefront

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

# Phase 2 — Cart + Interactivity

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

# Phase 3 — Supabase + Auth + Real Data

**Original goal:** Real database, user accounts, and dynamic product data.

**Dependency:** Begin only after Phase 2 is complete.

## 3.1 Supabase setup

- [x] Create the Supabase project (operator creates the cloud project; steps documented in `docs/SUPABASE.md`).
- [x] Configure environment variables (`.env.example` + local `.env.local` placeholders).
- [x] Add browser and server Supabase clients (`src/lib/supabase/*` + Next.js 16 `src/proxy.ts`).
- [x] Define the PostgreSQL schema (`supabase/schema.sql`).
- [x] Seed initial catalog data (`supabase/seed.sql` — 12 products).
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

## 3.5 Image storage — **COMPLETE**

- [x] Configure Supabase Storage buckets and access policies (`supabase/storage.sql`, docs in `docs/SUPABASE.md`).
- [x] Keep seeded mock `/images/...` paths; document how to upload real assets later.
- [x] Resolve storage-relative paths via `getPublicImageUrl` / `resolveProductImagePath`.
- [x] Render product photos through `next/image` (`ProductImage` + `remotePatterns`).
- [x] Provide width/height or `fill`, responsive `sizes`, and meaningful alt text.
- [x] Add fallbacks for missing / mock assets (`ImagePlaceholder`).
- [x] Use `priority` on primary gallery image; lazy load elsewhere via `next/image` defaults.

## 3.6 Search and filters — **COMPLETE**

- [x] Add search by product name (`ilike` via Supabase).
- [x] Filter by category.
- [x] Filter by price (min/max).
- [x] Preserve sort options (applied in the catalog query).
- [x] Keep state in URL search parameters (`search`, `category`, `minPrice`, `maxPrice`, `sort`).
- [x] Query the real Supabase catalog efficiently (`getAllProducts(filters)`).
- [x] Add no-results and reset-filter states.

---

# Phase 4 — Checkout + Payments

**Original goal:** Complete the purchase flow with Razorpay integration.

**Dependencies:** Real catalog data, secure server environment, authentication decision, database schema, and verified cart behavior.

## 4.1 Checkout form — **CURRENT STEP**

- [ ] Build `/checkout`.
- [ ] Collect shipping address.
- [ ] Collect customer contact information.
- [ ] Display an order summary.
- [ ] Validate forms with React Hook Form and Zod.
- [ ] Revalidate product existence, prices, quantities, and stock on the server.
- [ ] Define shipping and tax behavior.
- [ ] Prevent checkout for invalid or unavailable items.
- [ ] Keep sensitive logic off the client.

## 4.2 Razorpay integration

- [ ] Create Razorpay orders on the server.
- [ ] Launch Razorpay checkout from the client using the server-created order.
- [ ] Verify payment signatures on the server.
- [ ] Handle Razorpay webhooks securely and idempotently.
- [ ] Store provider order/payment identifiers.
- [ ] Handle success, failure, cancellation, retry, and duplicate-event cases.
- [ ] Show an order confirmation only after verified server state.

**Non-negotiable security rule:** Never trust prices, totals, inventory, user identity, or payment success supplied by the browser.

## 4.3 Order management

- [ ] Create orders and immutable order-item snapshots.
- [ ] Track order status.
- [ ] Reserve/decrement inventory safely.
- [ ] Handle failed or abandoned payments.
- [ ] Add order-confirmation experience.
- [ ] Expose customer order history.
- [ ] Support operational status updates.

## 4.4 Admin dashboard

- [ ] Build protected `/admin`.
- [ ] Build `/admin/products`.
- [ ] Build `/admin/orders`.
- [ ] Add product creation, editing, activation, and inventory management.
- [ ] Add order listing, detail, and status management.
- [ ] Add basic analytics.
- [ ] Enforce admin authorization on the server and through RLS.

## 4.5 Email notifications

- [ ] Select Resend or Supabase Edge Functions.
- [ ] Send order confirmation.
- [ ] Send shipping/status updates.
- [ ] Use branded responsive templates.
- [ ] Handle delivery failures and retries.
- [ ] Keep email credentials server-side.

---

# Phase 5 — Polish + Launch

**Original goal:** Production-ready SEO, performance, analytics, reviews, and future engagement features.

**Dependency:** Core purchase flow must be secure and stable.

## 5.1 SEO

- [ ] Add complete page metadata.
- [ ] Add canonical URLs.
- [ ] Add Open Graph and social sharing metadata.
- [ ] Add product and organization JSON-LD.
- [ ] Generate `sitemap.xml`.
- [ ] Configure `robots.txt`.
- [ ] Verify indexability and invalid-page behavior.
- [ ] Add meaningful alt text and semantic headings.

## 5.2 Performance

- [ ] Optimize all images.
- [ ] Add lazy loading where appropriate.
- [ ] Tune Core Web Vitals.
- [ ] Minimize Client Component boundaries and shipped JavaScript.
- [ ] Add loading skeletons where they improve perceived speed.
- [ ] Audit fonts, caching, data fetching, and bundle size.
- [ ] Test on slower mobile devices and networks.

## 5.3 Analytics

- [ ] Select Google Analytics or Plausible.
- [ ] Add privacy-conscious page analytics.
- [ ] Track product views.
- [ ] Track Add to Cart.
- [ ] Track checkout progress.
- [ ] Track purchase conversion.
- [ ] Avoid collecting sensitive customer/payment information.

## 5.4 Reviews system

- [ ] Add customer ratings and reviews to product pages.
- [ ] Build a reusable `StarRating`.
- [ ] Restrict submission appropriately.
- [ ] Add moderation/approval.
- [ ] Add empty, loading, and error states.
- [ ] Ensure aggregate rating data is accurate.

## 5.5 Wishlist

- [ ] Add authenticated “save for later” behavior.
- [ ] Add wishlist UI on product cards and details.
- [ ] Add an account wishlist view.
- [ ] Persist wishlist data in Supabase.
- [ ] Handle signed-out users gracefully.

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

- [ ] `/checkout`
- [ ] `/admin`
- [ ] `/admin/products`
- [ ] `/admin/orders`

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

- [ ] Verify environment variable separation between local, preview, and production.
- [ ] Deploy to Vercel when explicitly requested.
- [ ] Connect production Supabase and Razorpay credentials only through secure environment variables.
- [ ] Configure domains, redirects, headers, and image hosts.
- [ ] Run production smoke tests.
- [ ] Verify SEO, analytics, email, webhooks, and payment callbacks in production.
- [ ] Document rollback and operational recovery steps.

---

# Known Improvements to Address in Their Relevant Steps

- [ ] Enforce product `stockCount` in every cart quantity control, not only the product-detail selector.
- [ ] Decide whether shared quantity controls should replace duplicated Sheet/page implementations.
- [x] Wire Supabase Storage + `next/image` for product photos (real asset upload still optional; mocks OK).
- [ ] Add cart persistence versioning/migration before catalog identifiers change.
- [ ] Add stronger loading and error boundaries during backend migration.
- [ ] Confirm Vercel deployment status.

---

# Current Handoff

Phase 3 is complete. Catalog search and filters are URL-driven and query Supabase. The next agent must begin with:

## Phase 4.1 — Checkout form

Do not begin Razorpay, admin, reviews, or wishlist work until the checkout form step is complete and both project memory files have been updated.
