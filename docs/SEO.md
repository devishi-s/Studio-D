# Studio D SEO

How search metadata, structured data, sitemap, and robots are set up: and what to update before launch.

## Decisions

| Topic | Choice | Why |
| --- | --- | --- |
| Site URL | `SITE_URL` = `https://studiod.in` in `src/lib/constants.ts` | Single source for canonicals, sitemap, JSON-LD, and `metadataBase` |
| Title template | `%s \| Studio D` in root layout | Consistent branding; homepage uses an absolute title |
| Default description | `SITE_DESCRIPTION` | Warm handmade brand copy shared across OG/Twitter defaults |
| Default share image | `/og-image.jpg` | Placeholder until a branded 1200×630 asset is ready |
| Private routes | `noIndex` metadata + `robots.txt` disallow | Account, cart, checkout, auth, and order confirmation should not rank |
| Product URLs in sitemap | Fetched via `getAllProducts()` | Keeps sitemap in sync with Supabase catalog |
| Categories in sitemap | `mainCategories` from `src/data/categories.ts` (main + subcategory URLs) | Matches two-level category routes |

| Currency in Product JSON-LD | `INR` | Matches storefront pricing |

## Ranking reality

Technical SEO in this repo makes Studio D *eligible* to appear in Google. It does not put the shop above Amazon, Etsy, Flipkart, or established gift brands for broad queries such as “handmade gifts India” or “crochet flowers”.

**What you can realistically win**

- Brand searches: “Studio D”, “studio.d.in”, the exact product name
- Long-tail maker copy: unique piece names + real photos (also Google Images)
- Trust after someone already heard of you on Instagram or WhatsApp

**What will not get you to #1**

- More JSON-LD, an SEO plugin, a blog factory, or a paid “guaranteed first page” agency
- Keyword stuffing in `layout.tsx` (Google largely ignores the keywords meta tag)
- Chasing a 100 Lighthouse score before the domain is even public

**Do at first production deploy**

1. Confirm `SITE_URL` / `NEXT_PUBLIC_SITE_URL` is `https://studiod.in` (and redirect `www` to apex or the reverse, not both indexed).
2. Submit `https://studiod.in/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
3. Replace `public/og-image.jpg` (file is currently missing from `public/`).
4. Noindex Vercel Preview so `*.vercel.app` is not a duplicate of production.
5. Use real Storage (or absolute) image URLs in Product OG and JSON-LD; local `/images/...` paths are skipped today.

**Do later, not now**

- Google Merchant Center / Shopping feed (needs shipping + returns policy)
- BreadcrumbList + AggregateRating JSON-LD once reviews are real
- Hindi pages, a blog, FAQ schema
- Google Business Profile only if you want a public pickup address

Social links: `SITE_SOCIAL.instagram` is `https://www.instagram.com/studio.d.in`.

## Global metadata (`src/app/layout.tsx`)

- `metadataBase` → `SITE_URL`
- Default title + `%s | Studio D` template
- Default description, keywords, authors/publisher
- Canonical default `/`
- Open Graph (`en_IN`, site name, default OG image)
- Twitter `summary_large_image`
- Robots: index/follow with large image preview for Googlebot

Shared helpers live in `src/lib/seo.ts` (`buildPageMetadata`, `absoluteUrl`, JSON-LD builders).

## Page-level metadata

| Route | Index? | Notes |
| --- | --- | --- |
| `/` | Yes | Absolute brand title + Organization JSON-LD |
| `/products` | Yes | “Shop Handmade Gifts & Decor \| Studio D” |
| `/products/[slug]` | Yes | Dynamic name, description (includes price), Product JSON-LD |
| `/categories` | Yes | Category index |
| `/categories/[slug]` | Yes | Main category |
| `/categories/[slug]/[subSlug]` | Yes | Subcategory |

| `/about` | Yes | Story-focused + LocalBusiness JSON-LD |
| `/contact` | Yes | Contact-focused |
| `/cart`, `/checkout` | No | `noIndex` + robots disallow |
| `/account`, `/account/orders`, `/account/orders/[id]` | No | Private |
| `/order-confirmation/[orderId]` | No | Private post-purchase |
| `/login`, `/signup`, `/reset-password` | No | Auth flows |
| `/admin/*` | N/A | Disallowed in robots; not in sitemap |

Canonical URLs are set per page via `buildPageMetadata({ path })`.

## JSON-LD

- **Homepage**: `Organization` (`organizationJsonLd`)
- **Product detail**: `Product` + `Offer` (`productJsonLd`): name, description, image, price, INR, availability
- **About**: `LocalBusiness` (`localBusinessJsonLd`): India areaServed, email, social

Injected with `src/components/seo/json-ld.tsx`.

Social links currently use Instagram `https://www.instagram.com/studio.d.in`. Confirm it is the live profile before launch.

## Sitemap (`src/app/sitemap.ts` → `/sitemap.xml`)

Includes:

- Static: `/`, `/products`, `/categories`, `/about`, `/contact`
- All `/categories/[slug]` and `/categories/[slug]/[subSlug]`
- All active products as `/products/[slug]` (Supabase; empty product list if fetch fails)

Excludes: `/account`, `/cart`, `/checkout`, `/admin`, auth, API, order confirmation.

## Robots (`src/app/robots.ts` → `/robots.txt`)

- Allow `/` for all crawlers
- Disallow: `/admin`, `/account`, `/cart`, `/checkout`, `/api`
- Points to `${SITE_URL}/sitemap.xml`

## OG image

- File: `public/og-image.jpg` (placeholder cream “Studio D” graphic, 1200×630)
- Regenerator: `scripts/generate-og-image.ps1` (optional)

### Before launch: replace the OG image

1. Design a branded 1200×630 JPEG (product collage or logo on cream/blush; keep text large and readable).
2. Replace `public/og-image.jpg` with the final file (same path).
3. Confirm absolute URL `https://studiod.in/og-image.jpg` loads in production.
4. Optionally re-test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator).

## Before-launch checklist

- [ ] Confirm `SITE_URL` matches the live domain (including `https` and no trailing slash).
- [ ] Replace `public/og-image.jpg` with a real branded image.
- [ ] Update Instagram (and any other) URLs in `SITE_SOCIAL`.
- [ ] Update contact email in JSON-LD if it differs from `hello@studiod.in`.
- [ ] Submit sitemap in Google Search Console after first production deploy.
- [ ] Spot-check View Source on home, product, about for title/description/canonical/JSON-LD.
- [ ] Confirm `/cart`, `/account`, `/checkout` send `noindex` and are blocked in `/robots.txt`.
- [ ] When product images are all on Storage, Product OG/JSON-LD will prefer absolute `http` image URLs automatically.

## Related files

- `src/lib/seo.ts`: helpers + schemas
- `src/components/seo/json-ld.tsx`: JSON-LD script tag
- `src/app/layout.tsx`: global metadata
- `src/app/sitemap.ts` / `src/app/robots.ts`
- `public/og-image.jpg`
- `src/lib/constants.ts`: `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_URL`
