# Studio D Analytics

Privacy-conscious page and funnel analytics.

## Choice (updated for Render)

| Option | Decision |
| --- | --- |
| Original | Vercel Analytics + Speed Insights (chosen when Vercel was the planned host) |
| Now | Hosting is **Render**. Vercel Analytics/Speed Insights will not serve as the live dashboard. |
| Phase 6.5 | Replace with **Plausible** (preferred, privacy-friendly) or **GA4** if you already live in Google tools |

Until Phase 6.5 lands, the app still mounts `@vercel/analytics` / `@vercel/speed-insights` in `src/app/layout.tsx`. Treat that as transitional code, not the final production tracker.

## Current code map

Custom funnel wrappers live in `src/lib/analytics.ts`. Each helper no-ops when `window` is undefined.

| Event | When | Properties (no PII) |
| --- | --- | --- |
| `product_viewed` | Product detail mount | `productId`, `productName`, `category` |
| `add_to_cart` | Add to cart click | `productId`, `productName`, `price` |
| `checkout_started` | `/checkout` mount | none |
| `payment_initiated` | Immediately before Razorpay modal opens | none |
| `order_completed` | Order confirmation mount | `orderId`, `total` |
| `search_performed` | Debounced search commits on `/products` | `searchTerm`, `resultCount` |
| `category_filtered` | Category filter click on `/products` | `category` |

Page-level events use `src/components/analytics/analytics-event.tsx` (client mount ping).

## Privacy

- Do **not** send emails, phone numbers, full shipping addresses, payment tokens, or Supabase user IDs in analytics events.
- Product **catalog** names and IDs are allowed (public shop data).
- Order IDs and monetary totals are operational metrics, not identity.
- Razorpay still receives checkout prefill for payment (payment processing, not analytics).
- If you switch to GA4, plan a simple consent/privacy note. Plausible usually needs less consent UX.

## Phase 6.5 checklist

- [ ] Pick Plausible or GA4
- [ ] Remove or gate `@vercel/analytics` and `@vercel/speed-insights`
- [ ] Re-wire `src/lib/analytics.ts` to the new provider
- [ ] Confirm events on a Render URL
- [ ] Update this doc’s “Choice” table to the final provider only

## Related files

- `src/lib/analytics.ts`
- `src/components/analytics/analytics-event.tsx`
- `src/app/layout.tsx`
- Wire-ups: product detail, `AddToCartButton`, checkout page/form, order confirmation, `ProductCatalogFilters`
