# Studio D — Supabase Setup

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

In the Supabase dashboard **SQL Editor**, run in order:

1. `supabase/schema.sql` — tables, indexes, profile trigger, RLS
2. `supabase/seed.sql` — all 12 catalog products
3. `supabase/storage.sql` — `product-images` bucket + Storage policies

To regenerate the seed after editing the static catalog:

```bash
node --experimental-strip-types scripts/generate-seed.mjs
```

## Product image storage (Phase 3.5)

### Bucket

| Setting | Value |
| --- | --- |
| Bucket id / name | `product-images` |
| Public | yes (public read via public object URLs) |
| Write | authenticated users only (insert / update / delete) |
| Max size | 5 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |

`supabase/storage.sql` creates the bucket and these policies on `storage.objects`:

- **Public read** — anyone can `SELECT` objects in `product-images`
- **Authenticated write** — signed-in users can upload, update, and delete

### App helpers

| Helper | File | Behavior |
| --- | --- | --- |
| `getPublicImageUrl(bucket, path)` | `src/lib/supabase/storage.ts` | Builds `{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}` |
| `resolveProductImagePath(path)` | same | Absolute URLs stay as-is; `/images/...` mocks stay as-is; relative paths become public Storage URLs |
| `uploadProductImage(file, path)` | same | Uploads to `product-images` (for future admin); requires an authenticated session |
| `ProductImage` | `src/components/product/product-image.tsx` | Uses `next/image` for remote URLs; branded placeholder for mocks / missing |

`next.config.ts` allows your Supabase host under `/storage/v1/object/public/**` so `next/image` can optimize Storage URLs.

### How product rows store images

`products.images` is a `text[]`. Each entry may be:

1. **Storage-relative path** (preferred once you upload) — e.g. `prod-1/main.jpg` → resolved to a public URL via `getPublicImageUrl`
2. **Absolute URL** — already a full `https://…` link
3. **Mock path** (current seed) — e.g. `/images/products/prod-1.jpg` → UI keeps the branded placeholder until you replace it

Seeded products still use mock `/images/...` paths. That is intentional: no binary assets are required to run the storefront.

### Uploading real images later

When you are ready to replace placeholders:

1. Confirm `supabase/storage.sql` has been applied.
2. Sign in as an authenticated user (or use the dashboard **Storage** UI).
3. Upload under a stable path convention, e.g. `{productId}/main.jpg`, `{productId}/detail-1.jpg`.
4. Either:
   - Use the dashboard to upload into bucket `product-images`, then update `products.images` to the object paths, or
   - Call `uploadProductImage(file, "prod-1/main.jpg")` from future admin tooling and save the returned `path` on the product row.

Example SQL after uploading `prod-1/main.jpg` in the dashboard:

```sql
update products
set images = array['prod-1/main.jpg']
where id = 'prod-1';
```

After that, `getAllProducts` / `getProductBySlug` resolve the path to a public URL and `ProductImage` renders it through `next/image`.

## Schema decisions

| Table | Notes |
| --- | --- |
| `products` | `id` is text (`prod-1` …) matching the static catalog so cart `productId` values stay valid. `category` stores the category **slug**. Extra columns `compare_at_price`, `tags`, and `is_active` preserve catalog fidelity. |
| `profiles` | `id` references `auth.users`. A trigger creates/updates the row on signup. |
| `orders` | Minimal shape: `user_id`, `status`, `total`, `created_at`. Shipping/payment fields arrive with checkout. |
| `order_items` | Snapshots `price_at_purchase` with `quantity` and `product_id`. |

### Status values

`orders.status` allows: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`.

## RLS policies

| Table | Policy behavior |
| --- | --- |
| `products` | Public `SELECT` for `anon` and `authenticated`. No client write policies — product writes use the **service role** (admin tooling later). |
| `profiles` | Authenticated users can `SELECT` / `INSERT` / `UPDATE` only their own row (`auth.uid() = id`). |
| `orders` | Authenticated users can `SELECT` only their own orders. |
| `order_items` | Authenticated users can `SELECT` items whose parent order belongs to them. |
| `storage.objects` (`product-images`) | Public `SELECT`; authenticated `INSERT` / `UPDATE` / `DELETE`. |

Order creation and payment mutations are intentionally omitted until Phase 4 server actions exist.

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
4. Run `supabase/seed.sql`.
5. Run `supabase/storage.sql`.
6. Confirm `select count(*) from products;` returns `12`.
7. Confirm bucket `product-images` exists under **Storage**.
8. Set Auth redirect URLs (see above).
9. Restart the Next.js app.
10. Visit shop pages (placeholders until you upload real images) and `/account` after signing in.

## Out of scope (deferred)

- Uploading the full catalog photo set (keep mocks until assets are ready)
- Admin UI for image management
- Category hero images from Storage
- Service-role usage in the app
- Real email delivery for contact form
