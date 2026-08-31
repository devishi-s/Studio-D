# Studio D Performance

Decisions for Core Web Vitals (LCP, CLS, INP), caching, and how to monitor after launch.

## Goals

- Fast LCP on home, shop, and product pages (images + fonts).
- Stable layout (fonts, cart badge, skeletons).
- Lean client JS (Server Components by default; lazy-load heavy islands).
- Cached catalog reads; fresh order/account data.

## Decisions

| Topic | Choice | Why |
| --- | --- | --- |
| Product image component | Server `ProductImage` + `next/image` | No JS for static photos; Optimization + `sizes`/`priority` |
| Placeholder | `placeholder="empty"` | Avoid large blurDataURLs until Storage assets have real LQIP hashes |
| Remote images | `images.remotePatterns` for Supabase Storage host | Required for `next/image` on public bucket URLs |
| Catalog cache | `unstable_cache` via `cachedQuery`, **3600s** | Supabase JS client is not `fetch`; taggable cache with 1h freshness |
| Orders / account | No long-lived `unstable_cache` | User-scoped; freshness over CDN caching (`ORDER_REVALIDATE_SECONDS` documented as 30s if ever needed) |
| Page ISR | `export const revalidate = 3600` (literal) on catalog routes | Next.js requires a static number — keep in sync with `PRODUCT_REVALIDATE_SECONDS` |
| Cart / mobile nav | `next/dynamic` (`ssr: false`) in `NavbarActions` | Defers Sheet + cart store until needed |
| Cart badge | Always-rendered fixed badge slot + `invisible` until hydrated | Prevents CLS when count appears from localStorage |
| Fonts | `display: "swap"`; mono `preload: false` | Visible text ASAP; skip unused mono preload |
| Skeletons | Card / grid / detail skeletons in Suspense / `loading.tsx` | Perceived speed while catalog loads |
| Bundle analysis | `@next/bundle-analyzer` + `npm run analyze` | Inspect client chunks before launch |

## Image rules

1. Prefer `ProductImage` for catalog photos (never raw `<img>` for products).
2. Always pass meaningful `alt`, `sizes`, and dimensions (`fill` + sized parent, or `width`/`height`).
3. Set `priority` on above-the-fold images:
   - Product detail primary gallery image
   - First row of featured products (`priorityCount={4}`)
   - First row of shop / category grids (`priorityCount={3}`)
4. Hero / about visuals still use `ImagePlaceholder` until real assets exist — replace with `next/image` + `priority` when ready.
5. Confirm `NEXT_PUBLIC_SUPABASE_URL` is set so `next.config.ts` registers the Storage hostname.

## Client JS audit

Kept as Client Components (hooks / events / browser APIs):

- Cart sheet, cart page, quantity controls, add-to-cart
- Filters, image gallery thumbnails, auth forms, checkout
- Mobile nav, nav active links (`usePathname`), sheets, toasts

Converted / deferred:

- `ProductImage` → Server Component
- `CartSheet` + `MobileNav` → lazy via `NavbarActions`

Do **not** mark a component `"use client"` unless it uses hooks, events, browser APIs, or must wrap a client-only library.

## Skeletons & Suspense

| Route | Mechanism |
| --- | --- |
| `/` featured row | `Suspense` + `ProductGridSkeleton` |
| `/products` | `Suspense` around catalog fetch + filter shell skeleton |
| `/categories/[slug]` | `Suspense` around product list |
| `/products/[slug]` | `loading.tsx` → `ProductDetailSkeleton` |

## Caching helpers

- `src/lib/cache.ts` — `PRODUCT_REVALIDATE_SECONDS` (3600), `ORDER_REVALIDATE_SECONDS` (30), `cachedQuery`
- `src/lib/supabase/products.ts` — all public catalog reads go through `cachedQuery` with `tags: ["products"]`
- Admin product create/update/delete call `updateTag("products")` (and related tags) so the storefront refreshes immediately

Orders stay on the authenticated Supabase server client without catalog-style hour-long caching.

## Bundle analyzer

```bash
npm run analyze
```

This runs `ANALYZE=true next build` and opens the webpack/turbopack analyzer report (interactive HTML).

**Windows PowerShell** if the npm script does not set the env var:

```powershell
$env:ANALYZE="true"; npm run build
```

Look for large client chunks from cart, checkout (Razorpay), admin forms, and lucide icons. Prefer dynamic import for rarely opened UI.

## After launch — monitor

- [ ] Lighthouse / PageSpeed Insights on `/`, `/products`, and a product URL (mobile).
- [ ] CrUX / Search Console Core Web Vitals (LCP, CLS, INP).
- [ ] Confirm LCP element is the intended hero or product image (not a late font or logo).
- [ ] Spot-check CLS with a non-empty persisted cart (badge should not shift layout).
- [ ] Verify Storage images load via `/_next/image` (not raw unoptimized URLs) in production.
- [ ] Re-run `npm run analyze` after adding heavy third-party scripts (analytics in Phase 5.3).
- [ ] When real hero/OG images ship, set `priority` and measure LCP again.

## Related files

- `src/lib/cache.ts`, `src/lib/supabase/products.ts`
- `src/components/product/product-image.tsx`
- `src/components/product/product-card-skeleton.tsx`
- `src/components/product/product-grid-skeleton.tsx`
- `src/components/product/product-detail-skeleton.tsx`
- `src/components/layout/navbar-actions.tsx`
- `src/app/(shop)/products/[slug]/loading.tsx`
- `next.config.ts`, `package.json` (`analyze` script)
