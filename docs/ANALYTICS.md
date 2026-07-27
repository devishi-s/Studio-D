# Studio D Analytics

Privacy-conscious page and funnel analytics using **Vercel Analytics** and **Vercel Speed Insights**.

## Choice

| Option | Decision |
| --- | --- |
| Provider | Vercel Analytics + Speed Insights |
| Why | Free on Vercel, no cookie banner required for this first-party privacy-friendly setup, GDPR-oriented (no advertising cookies / no PII by design) |
| Not chosen | Google Analytics / Plausible — deferred; GA needs consent UX; Plausible is fine but adds a third-party vendor when Vercel already hosts us |

## Setup

Packages:

- `@vercel/analytics`
- `@vercel/speed-insights`

Root layout (`src/app/layout.tsx`) mounts:

- `<Analytics />` — page views + custom events
- `<SpeedInsights />` — Core Web Vitals from real users

Enable **Analytics** and **Speed Insights** for the project in the Vercel dashboard after the first production deploy.

## Local development

Custom events and page beacons may fire in the browser during `next dev`, but **nothing is recorded in the Vercel dashboard until the site is deployed to Vercel**. That is expected.

## Custom funnel events

Wrappers live in `src/lib/analytics.ts`. Each helper no-ops when `window` is undefined (safe to import from Server Components; actual tracking runs in the browser).

| Event | When | Properties (no PII) |
| --- | --- | --- |
| `product_viewed` | Product detail mount | `productId`, `productName`, `category` |
| `add_to_cart` | Add to cart click | `productId`, `productName`, `price` |
| `checkout_started` | `/checkout` mount | — |
| `payment_initiated` | Immediately before Razorpay modal opens | — |
| `order_completed` | Order confirmation mount | `orderId`, `total` |
| `search_performed` | Debounced search commits on `/products` | `searchTerm`, `resultCount` |
| `category_filtered` | Category filter click on `/products` | `category` |

Page-level events use `src/components/analytics/analytics-event.tsx` (client mount ping).

## Privacy

- Do **not** send emails, phone numbers, full shipping addresses, payment tokens, or Supabase user IDs in analytics events.
- Product **catalog** names and IDs are allowed (they are public shop data, not personal data).
- Order IDs and monetary totals are operational metrics, not identity.
- Razorpay still receives checkout prefill for payment (that is payment processing, not Vercel Analytics).
- No analytics cookie consent banner is required for this Vercel Web Analytics setup as documented by Vercel for privacy-friendly first-party analytics; revisit if you later add GA, Meta Pixel, or similar.

If you publish a public Privacy Policy page later, mention:

> We use Vercel Analytics and Speed Insights to understand aggregate traffic and storefront funnel performance. These tools do not use advertising cookies and we do not send personal contact details in custom events.

## Related files

- `src/lib/analytics.ts`
- `src/components/analytics/analytics-event.tsx`
- `src/app/layout.tsx`
- Wire-ups: product detail, `AddToCartButton`, checkout page/form, order confirmation, `ProductCatalogFilters`

## After launch

- [ ] Confirm Analytics + Speed Insights enabled on the Vercel project
- [ ] Spot-check custom events in the Vercel Analytics UI after a test purchase funnel
- [ ] Verify no PII appears in event property payloads
- [ ] Watch Speed Insights for LCP/CLS regressions after marketing campaigns
