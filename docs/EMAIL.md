# Studio D — Email (Resend)

Phase 4.5 sends transactional email after a verified paid order:

1. **Order confirmation** → customer  
2. **New order alert** → studio / admin inbox  

Email failures are logged and **never** block order creation.

## Environment variables

Add to `.env.local` (see `.env.example`):

```bash
RESEND_API_KEY=your_resend_api_key
```

Optional:

```bash
# Verified sender once your domain is set up (defaults to Resend onboarding address)
RESEND_FROM_EMAIL=Studio D <orders@studiod.in>

# Where admin alerts go (defaults to hello@studiod.in)
ADMIN_NOTIFICATION_EMAIL=you@example.com
```

Restart `npm run dev` after changing env vars.

## How to get a real Resend API key

1. Create an account at [https://resend.com](https://resend.com).
2. Open **API Keys** → **Create API Key** (permission: Sending access is enough).
3. Copy the key into `.env.local` as `RESEND_API_KEY=re_...`.
4. **Do not commit** the real key.

Until you replace `your_resend_api_key`, Studio D **skips** sending and logs:

`[email] Skipping order confirmation: RESEND_API_KEY is missing or still a placeholder…`

## Sending domain setup

Resend’s free onboarding sender (`onboarding@resend.dev`) only delivers to **your Resend account email** in test mode.

For production (customers receiving mail from Studio D):

1. In Resend → **Domains** → **Add Domain** (e.g. `studiod.in`).
2. Add the DNS records Resend shows (SPF, DKIM, and usually DMARC).
3. Wait until the domain status is **Verified**.
4. Set:

```bash
RESEND_FROM_EMAIL=Studio D <orders@studiod.in>
```

Use an address on the verified domain (e.g. `orders@`, `hello@`).

## Code map

| File | Role |
| --- | --- |
| `src/lib/email/resend.ts` | Resend client, `sendOrderConfirmation`, `sendAdminOrderAlert`, `sendOrderEmailsSafe` |
| `src/lib/email/templates/order-confirmation.tsx` | Customer React Email template |
| `src/lib/email/templates/admin-alert.tsx` | Admin React Email template |
| `src/app/api/checkout/verify-payment/route.ts` | Calls `sendOrderEmailsSafe` after a new order is created |

## Behaviour notes

- Emails run only when `createOrder` reports `alreadyExisted: false` (avoids duplicate mail on payment retries).
- Placeholders / missing keys → skip + info log.
- API / network errors → error log; HTTP response to the shopper still returns success for the order.
