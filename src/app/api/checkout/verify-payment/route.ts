import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  getRazorpayCredentials,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay";
import { checkoutFormSchema, toCheckoutAddress } from "@/lib/checkout";
import {
  isCartItemArray,
  revalidateCartAgainstCatalog,
} from "@/lib/checkout/revalidate-cart";
import { createOrder } from "@/lib/supabase/orders";
import { sendOrderEmailsSafe } from "@/lib/email/resend";
import type { OrderEmailData } from "@/lib/email/types";

type VerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  address?: unknown;
  items?: unknown;
};

const SUPPORT_EMAIL = "hello@studiod.in";

/**
 * Verifies Razorpay Checkout.js success signatures, then persists the order.
 */
export async function POST(request: Request) {
  let razorpayOrderId: string | undefined;
  let razorpayPaymentId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to verify payment." },
        { status: 401 }
      );
    }

    let body: VerifyBody;
    try {
      body = (await request.json()) as VerifyBody;
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    razorpayOrderId = body.razorpay_order_id?.trim();
    razorpayPaymentId = body.razorpay_payment_id?.trim();
    const signature = body.razorpay_signature?.trim();

    if (!razorpayOrderId || !razorpayPaymentId || !signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    try {
      getRazorpayCredentials();
    } catch {
      return NextResponse.json(
        {
          error:
            "Payments are not configured yet. Add Razorpay keys to .env.local.",
        },
        { status: 503 }
      );
    }

    const valid = verifyRazorpayPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature,
    });

    if (!valid) {
      return NextResponse.json(
        { error: "Payment signature mismatch. Payment was not accepted." },
        { status: 400 }
      );
    }

    const addressParsed = checkoutFormSchema.safeParse(body.address);
    if (!addressParsed.success) {
      return NextResponse.json(
        {
          error: `Payment succeeded, but delivery details were incomplete. Contact ${SUPPORT_EMAIL} with payment ID ${razorpayPaymentId}.`,
          razorpayPaymentId,
          razorpayOrderId,
          paid: true,
        },
        { status: 400 }
      );
    }

    const items = isCartItemArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json(
        {
          error: `Payment succeeded, but the cart was empty when saving the order. Contact ${SUPPORT_EMAIL} with payment ID ${razorpayPaymentId}.`,
          razorpayPaymentId,
          razorpayOrderId,
          paid: true,
        },
        { status: 400 }
      );
    }

    const cart = await revalidateCartAgainstCatalog(supabase, items);
    if (!cart.ok) {
      console.error("[verify-payment] Cart invalid after paid signature", {
        userId: user.id,
        razorpayOrderId,
        razorpayPaymentId,
        error: cart.error,
      });
      return NextResponse.json(
        {
          error: `Payment succeeded, but we could not rebuild your order (${cart.error}). Contact ${SUPPORT_EMAIL} with payment ID ${razorpayPaymentId}.`,
          razorpayPaymentId,
          razorpayOrderId,
          paid: true,
        },
        { status: 400 }
      );
    }

    const address = toCheckoutAddress(addressParsed.data);

    let created;
    try {
      created = await createOrder(
        user.id,
        items,
        cart.total,
        address,
        {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
        }
      );
    } catch (err) {
      console.error(
        "[verify-payment] CRITICAL: Payment verified but order creation failed",
        {
          userId: user.id,
          razorpayOrderId,
          razorpayPaymentId,
          error: err instanceof Error ? err.message : err,
        }
      );

      return NextResponse.json(
        {
          error: `Your payment went through, but we could not save the order. Please email ${SUPPORT_EMAIL} with payment ID ${razorpayPaymentId} — we will fix this by hand.`,
          razorpayPaymentId,
          razorpayOrderId,
          paid: true,
        },
        { status: 500 }
      );
    }

    revalidatePath("/cart");
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${created.orderId}`);
    revalidatePath(`/order-confirmation/${created.orderId}`);
    revalidatePath("/products");

    // Email is best-effort — never block a paid order on delivery failure.
    if (!created.alreadyExisted) {
      const emailPayload: OrderEmailData = {
        orderId: created.orderId,
        total: cart.total,
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        lines: cart.lines.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          lineTotal: line.lineTotal,
        })),
        shippingAddress: address,
        needsManualReview: created.needsManualReview,
      };

      try {
        await sendOrderEmailsSafe(emailPayload, {
          fullName: address.fullName,
          email: address.email,
        });
      } catch (err) {
        console.error(
          "[verify-payment] Email dispatch failed (order still confirmed)",
          {
            orderId: created.orderId,
            error: err instanceof Error ? err.message : err,
          }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      orderId: created.orderId,
      razorpayOrderId,
      razorpayPaymentId,
      needsManualReview: created.needsManualReview,
      alreadyExisted: created.alreadyExisted,
      redirectTo: `/order-confirmation/${created.orderId}`,
    });
  } catch (err) {
    console.error("[verify-payment] Unexpected error:", {
      razorpayOrderId,
      razorpayPaymentId,
      error: err instanceof Error ? err.message : err,
    });
    return NextResponse.json(
      {
        error: razorpayPaymentId
          ? `Something went wrong after payment. Contact ${SUPPORT_EMAIL} with payment ID ${razorpayPaymentId}.`
          : "Could not verify payment. Please contact support.",
        razorpayPaymentId,
        razorpayOrderId,
        paid: Boolean(razorpayPaymentId),
      },
      { status: 500 }
    );
  }
}
