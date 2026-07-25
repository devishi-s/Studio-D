import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  isCartItemArray,
  revalidateCartAgainstCatalog,
} from "@/lib/checkout/revalidate-cart";
import {
  createRazorpayClient,
  getRazorpayCredentials,
} from "@/lib/razorpay";
import { checkoutFormSchema } from "@/lib/checkout";

/**
 * Creates a Razorpay order after recalculating totals from Supabase catalog prices.
 * Never trusts client-sent amounts.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to continue checkout." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const items =
      body &&
      typeof body === "object" &&
      "items" in body &&
      isCartItemArray((body as { items: unknown }).items)
        ? (body as { items: import("@/types").CartItem[] }).items
        : null;

    if (!items) {
      return NextResponse.json(
        { error: "Cart items are required." },
        { status: 400 }
      );
    }

    // Address is optional here — used only for Razorpay notes / future order rows.
    const addressRaw =
      body && typeof body === "object" && "address" in body
        ? (body as { address: unknown }).address
        : undefined;
    const addressParsed = addressRaw
      ? checkoutFormSchema.safeParse(addressRaw)
      : null;

    const cart = await revalidateCartAgainstCatalog(supabase, items);
    if (!cart.ok) {
      return NextResponse.json({ error: cart.error }, { status: 400 });
    }

    let credentials;
    try {
      credentials = getRazorpayCredentials();
    } catch {
      return NextResponse.json(
        {
          error:
            "Payments are not configured yet. Add Razorpay keys to .env.local.",
        },
        { status: 503 }
      );
    }

    const razorpay = createRazorpayClient();
    const receipt = `sd_${Date.now().toString(36)}`;

    let order: { id: string; amount: number | string; currency: string };
    try {
      order = await razorpay.orders.create({
        amount: cart.amountPaise,
        currency: "INR",
        receipt,
        notes: {
          user_id: user.id,
          item_count: String(cart.lines.length),
          ...(addressParsed?.success
            ? {
                customer_email: addressParsed.data.email,
                customer_phone: addressParsed.data.phone,
              }
            : {}),
        },
      });
    } catch (err) {
      const message =
        err && typeof err === "object" && "error" in err
          ? String(
              (err as { error?: { description?: string } }).error?.description ??
                ""
            )
          : "";

      console.error("[create-order] Razorpay error:", err);

      return NextResponse.json(
        {
          error:
            message ||
            "Could not start payment. Check Razorpay keys or try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      keyId: credentials.publicKeyId,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      lines: cart.lines,
    });
  } catch (err) {
    console.error("[create-order] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong creating the payment order." },
      { status: 500 }
    );
  }
}
