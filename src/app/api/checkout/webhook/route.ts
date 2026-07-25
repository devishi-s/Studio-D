import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Razorpay webhook receiver (server-to-server).
 * Full idempotent order fulfillment lands in Phase 4.3.
 *
 * Configure the webhook URL in the Razorpay dashboard to:
 *   POST /api/checkout/webhook
 *
 * Optional env: RAZORPAY_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (webhookSecret) {
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const actualBuf = Buffer.from(signature, "utf8");

    if (
      expectedBuf.length !== actualBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, actualBuf)
    ) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }
  }

  let event: { event?: string; payload?: unknown } = {};
  try {
    event = JSON.parse(rawBody) as { event?: string; payload?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Acknowledge immediately. Idempotent order updates arrive in Phase 4.3.
  console.info("[razorpay-webhook]", event.event ?? "unknown");

  return NextResponse.json({ received: true });
}
