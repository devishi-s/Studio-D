import crypto from "node:crypto";
import Razorpay from "razorpay";

export function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

  if (!keyId || !keySecret || !publicKeyId) {
    throw new Error(
      "Missing Razorpay env vars. Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID."
    );
  }

  if (
    keyId.includes("your_") ||
    keySecret.includes("your_") ||
    publicKeyId.includes("your_")
  ) {
    // Placeholder env values are expected until real keys are configured.
    // Callers should surface a friendly error when the Razorpay API rejects them.
  }

  return { keyId, keySecret, publicKeyId };
}

export function createRazorpayClient() {
  const { keyId, keySecret } = getRazorpayCredentials();
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * Verifies Checkout.js payment success payload:
 * HMAC_SHA256(order_id|payment_id, key_secret) === signature
 */
export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getRazorpayCredentials();
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(params.signature, "utf8");

  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

