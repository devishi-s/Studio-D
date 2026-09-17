# Studio D: Supabase Setup

Phase 3 foundation: project configuration, typed clients, schema, RLS, catalog seed, auth, and Storage for product images.

## Prerequisites

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Note the project region (choose one close to your Vercel region when you deploy).
3. Install dependencies (already done in this repo):

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Where to find URL and anon key

In the Supabase dashboard:

1. Open your project.
2. Go to **Project Settings → API**.
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the **anon** / **public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Never commit the **service_role** key. It bypasses RLS and belongs only in server-only secrets when an admin or seed script needs it later.

Newer Supabase docs may label the public key as a “publishable” key. Studio D uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` to match this codebase and the classic dashboard label.

## Environment setup

1. Copy `.env.example` to `.env.local` (a placeholder `.env.local` already exists locally).
2. Replace placeholders with your Project URL and anon key.
3. Restart `npm run dev` after changing env vars.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel / production, add the same two variables in the project Environment Variables UI. Do not paste service-role keys into `NEXT_PUBLIC_*` variables.

Until real values replace the placeholders, `src/lib/supabase/middleware.ts` skips session refresh so the static storefront keeps running.

## Apply schema, seed, and storage

In the Supabase dashboard **SQL Editor**, run in order. `storage.sql` needs `public.is_admin()` from `admin-rls.sql`, so run step 5 before re-running step 3 on a new project.

1. `supabase/schema.sql`: tables, indexes, profile trigger, RLS, stock RPC
2. `supabase/seed.sql`: full catalog (truncates products; for fresh projects)
3. `supabase/storage.sql`: `product-images` bucket + Storage policies (run **after** `admin-rls.sql` so `is_admin()` exists; if the bucket already exists this is safe to re-run)
4. `supabase/orders-checkout.sql`: **required for existing projects** that already ran an older `schema.sql` (adds Razorpay/shipping columns + insert policies + stock RPC)
5. `supabase/admin-rls.sql`: `profiles.is_admin`, admin RLS, promote yourself via the SQL comment at the bottom
6. `supabase/reviews.sql`: Phase 5.4 product reviews + moderation RLS
7. `supabase/wishlist.sql`: Phase 5.5 authenticated save-for-later wishlist
8. `supabase/categories-restructure.sql`: maps old product category slugs → two-level taxonomy (Wearables, Keychains & Charms, Crochet Creations, Art & Decor + subs)
9. `supabase/catalog-polish.sql`: **existing projects only**: upserts the current catalog (22 products, subcategory alignment, local image paths) without truncating reviews/wishlist/orders

**Catalog note:** Category metadata for the storefront is defined in `src/data/categories.ts` (two-level tree); `products.category` stores a slug from that tree. Gift-box seeds are filed under the subcategory that matches what is in the box (flowers, keychains, plushies). Wearables, keychains, bag charms, and plushies each have dedicated pieces.

To regenerate `seed.sql` and `catalog-polish.sql` after editing `src/data/catalog-seed.json`:

```bash
node --experimental-strip-types scripts/generate-seed.mjs
```

## Product image storage (Phase 3.5)

### Bucket

| Setting | Value |
| --- | --- |
| Bucket id / name | `product-images` |
| Public | yes (public read via public object URLs) |
| Write | admins only (`public.is_admin()`, insert / update / delete) |
| Max size | 5 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |

`supabase/storage.sql` creates the bucket and these policies on `storage.objects`:

- **Public read**: anyone can `SELECT` objects in `product-images`
- **Admin write**: signed-in admins can upload, update, and delete (`public.is_admin()`). Run `admin-rls.sql` before `storage.sql` so that function exists.

### App helpers

| Helper | File | Behavior |
| --- | --- | --- |
| `getPublicImageUrl(bucket, path)` | `src/lib/supabase/storage.ts` | Builds `{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}` |
| `resolveProductImagePath(path)` | same | Absolute URLs stay as-is; `/images/...` public paths stay as-is; relative paths become public Storage URLs |
| `uploadProductImages` / `deleteProductImage` | `src/lib/supabase/upload-product-image.ts` | Admin browser upload/delete into `product-images` |
| `ProductImage` | `src/components/product/product-image.tsx` | Uses `next/image` for `/images/...` and remote URLs; branded placeholder when `src` is missing |

`next.config.ts` allows your Supabase host under `/storage/v1/object/public/**` so `next/image` can optimize Storage URLs.

### How product rows store images

`products.images` is a `text[]`. Each entry may be:

1. **Storage-relative path** (preferred once you upload to the bucket): e.g. `prod-1/main.jpg` → resolved to a public URL via `getPublicImageUrl`
2. **Absolute URL**: already a full `https://…` link
3. **Local public path** (current seed): e.g. `/images/products/rose-bouquet-1.jpg` → files under `public/images/products/`

Seeded products ship with JPEG files in `public/images/products/`. Replace those with studio photos, or upload to the `product-images` bucket and store storage-relative paths instead.

### Uploading real images

Admins add photos on `/admin/products/new` and `/admin/products/[id]/edit` with **Add photos**. Files go to the `product-images` bucket as `{productId}/{uuid}.jpg` (or png/webp/gif). Saving the product stores those storage-relative paths on `products.images`.

JPEG, PNG, WebP, and GIF, 5 MB each, up to 8 photos. The first photo is the shop thumbnail. iPhone **HEIC** is not accepted: export as JPEG first.

To create the bucket on a new project:

1. Run `supabase/admin-rls.sql` (defines `is_admin()`).
2. Run `supabase/storage.sql`.
3. Sign in as an admin and use **Add photos**.

You can still paste a `/images/...` path or a public URL under **Or paste a link**.

## Schema decisions

| Table | Notes |
| --- | --- |
| `products` | `id` is text (`prod-1` …) matching the static catalog so cart `productId` values stay valid. `category` stores the category **slug**. Extra columns `compare_at_price`, `tags`, and `is_active` preserve catalog fidelity. |
| `profiles` | `id` references `auth.users`. A trigger creates/updates the row on signup. |
| `orders` | `user_id`, `status`, `total`, `shipping_address` (JSONB), `razorpay_order_id`, `razorpay_payment_id`, `needs_manual_review`, `review_notes`. |
| `order_items` | Snapshots `price_at_purchase` with `quantity` and `product_id`. |

### Status values

`orders.status` allows: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`.

## RLS policies

| Table | Policy behavior |
| --- | --- |
| `products` | Public `SELECT` for `anon` and `authenticated`. No client write policies: product writes use the **service role** (admin tooling later). |
| `profiles` | Authenticated users can `SELECT` / `INSERT` / `UPDATE` only their own row (`auth.uid() = id`). |
| `profiles` | Authenticated users can `SELECT` / `INSERT` / `UPDATE` only their own row (`auth.uid() = id`). Admins can `SELECT` all profiles. `is_admin` changes are blocked for non-admins via trigger. |
| `orders` | Authenticated users can `SELECT` / `INSERT` / `UPDATE` only their own orders. Admins can `SELECT` / `UPDATE` all orders. |
| `order_items` | Authenticated users can `SELECT` / `INSERT` items whose parent order belongs to them. Admins can `SELECT` all items. |
| `products` | Public `SELECT`. Admins can `INSERT` / `UPDATE` / `DELETE`. |
| `storage.objects` (`product-images`) | Public `SELECT`; admin `INSERT` / `UPDATE` / `DELETE` via `is_admin()`. |
| `decrement_product_stock()` | Security-definer RPC; `authenticated` can execute (used after paid checkout). |
| `is_admin()` | Security-definer helper for admin RLS policies. |

Promote an admin after applying `admin-rls.sql` (run in the SQL Editor: it has no JWT, so bootstrapping is allowed):

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

If you already applied an older `admin-rls.sql` and the promote step fails with `Only an existing admin can change is_admin`, re-run the updated `prevent_is_admin_escalation` function from `admin-rls.sql` (or the bootstrap snippet in the handoff), then run the update again.

Order creation runs from `POST /api/checkout/verify-payment` after Razorpay signature verification.

## App clients

| File | Use |
| --- | --- |
| `src/lib/supabase/client.ts` | Browser / Client Components |
| `src/lib/supabase/server.ts` | Server Components, Route Handlers, Server Actions |
| `src/lib/supabase/middleware.ts` | `updateSession()` for the Next.js proxy |
| `src/lib/supabase/storage.ts` | Public URL helpers + product image upload |
| `src/lib/supabase/products.ts` | Catalog queries; maps image paths through `resolveProductImagePath` |
| `src/proxy.ts` | Next.js 16 request proxy (replaces deprecated `middleware.ts`) |
| `src/types/database.ts` | Hand-written table types until `supabase gen types` is wired |

### Protected routes

The proxy redirects unauthenticated visitors away from:

- `/account` and nested paths
- `/orders` and nested paths
- `/checkout`
- `/order-confirmation` and nested paths
- `/admin` and nested paths (also requires `profiles.is_admin` via `requireAdmin`)

Redirect target: `/login?redirectTo=…`.

Session verification uses `supabase.auth.getClaims()`, not `getSession()`.

## Auth redirect URLs

In Supabase **Authentication → URL configuration**, add:

- Site URL: `http://localhost:3000` (local) or your production domain
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-production-domain/auth/callback`

Email confirmation and password-reset links must land on `/auth/callback` so the app can exchange the auth code for a session cookie.

## Local checklist for a new environment

1. Create Supabase project.
2. Fill `.env.local` from `.env.example`.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql` on a fresh database, or `supabase/catalog-polish.sql` on an existing one.
5. Run `supabase/storage.sql`.
6. Run `supabase/orders-checkout.sql` if the project was created before Phase 4.3.
7. Run `supabase/admin-rls.sql`, then `reviews.sql`, `wishlist.sql`, and `categories-restructure.sql`.
8. Confirm products exist (`select count(*) from products;`) and bucket `product-images` under **Storage**.
9. Set Auth redirect URLs (see above).
10. Restart the Next.js app.
11. Visit shop pages and `/account` after signing in.

## Out of scope (deferred)

- Replacing seed JPEGs with original Studio D studio photos
- Category hero images from Storage
- Service-role usage in the app
- Real email delivery for contact form
