# Studio D — Payments (Razorpay)

Phase 4.2–4.3: Razorpay Checkout, signature verification, order persistence, stock decrement, and confirmation page.

## Environment variables

Add these to `.env.local` (see `.env.example`):

```bash
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

| Variable | Where used | Notes |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | Server (`orders.create`) | Test or live key id |
| `RAZORPAY_KEY_SECRET` | Server only | Never expose to the browser |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Checkout.js | Same key id as above; safe to publish |
| `RAZORPAY_WEBHOOK_SECRET` | Optional webhook route | Dashboard webhook secret |

Restart `npm run dev` after changing env vars.

## Database prerequisite

For existing Supabase projects, run `supabase/orders-checkout.sql` once (adds shipping/Razorpay columns, insert RLS, and `decrement_product_stock`).

## Flow

1. Client validates the checkout form (RHF + Zod).
2. `POST /api/checkout/create-order` recalculates totals from Supabase product prices, then creates a Razorpay order (amount in **paise**).
3. Client loads `checkout.js` and opens the Razorpay modal (Studio D branding + prefilled contact).
4. On success, client sends payment fields + address + cart items to `POST /api/checkout/verify-payment`.
5. Server verifies HMAC SHA256 (`order_id|payment_id`), then:
   - inserts `orders` (`status: confirmed`, shipping JSONB, Razorpay ids)
   - inserts `order_items` with `price_at_purchase` snapshots
   - decrements stock via `decrement_product_stock` (shortfalls flag `needs_manual_review`)
   - revalidates cart/order paths
6. Client clears the Zustand cart and redirects to `/order-confirmation/[orderId]`.
7. `POST /api/checkout/webhook` acknowledges dashboard webhooks (signature check when secret is set).

## Paid but order save failed

If signature verification succeeds but DB insert fails, the API returns **500** with a support message including the Razorpay payment ID (`hello@studiod.in`). The cart is **not** cleared. Check server logs for `[verify-payment] CRITICAL`.

## Security rules

- Never trust client-sent amounts — always recalculate from catalog prices.
- Never trust browser “payment success” without signature verification.
- Keep `RAZORPAY_KEY_SECRET` out of `NEXT_PUBLIC_*` variables.
- `createOrder` is idempotent on `razorpay_payment_id`.

## Local testing without real keys

Placeholder values are fine for UI work. Create-order will return a friendly error until real test keys are set. Apply `orders-checkout.sql` before end-to-end payment tests.
