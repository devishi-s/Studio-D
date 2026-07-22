"use server";

import { createClient } from "@/lib/supabase/server";
import { getCheckoutTotal } from "@/lib/checkout";
import type { CartItem, CheckoutLine } from "@/types";

export type ValidateCheckoutSuccess = {
  ok: true;
  lines: CheckoutLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export type ValidateCheckoutFailure = {
  ok: false;
  error: string;
};

export type ValidateCheckoutResult =
  | ValidateCheckoutSuccess
  | ValidateCheckoutFailure;

/**
 * Revalidates cart lines against live catalog data (existence, active, stock, price).
 * Does not create an order or charge payment — Phase 4.2 / 4.3 handle that.
 *
 * After a successful paid order (Phase 4.3), call:
 *   revalidatePath("/cart");
 *   revalidatePath("/account/orders");
 *   revalidatePath("/account/orders/[id]", "page");
 */
export async function validateCheckoutCart(
  items: CartItem[]
): Promise<ValidateCheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in to continue checkout." };
  }

  if (!items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const productIds = [...new Set(items.map((item) => item.productId))];

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, stock_count, is_active")
    .in("id", productIds);

  if (error) {
    return {
      ok: false,
      error: "We could not verify your cart. Please try again.",
    };
  }

  const byId = new Map((data ?? []).map((row) => [row.id, row]));
  const lines: CheckoutLine[] = [];
  const problems: string[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      problems.push("One or more items have an invalid quantity.");
      continue;
    }

    const product = byId.get(item.productId);

    if (!product || !product.is_active) {
      problems.push("A product in your cart is no longer available.");
      continue;
    }

    if (product.stock_count < item.quantity) {
      problems.push(
        `${product.name} only has ${product.stock_count} in stock.`
      );
      continue;
    }

    const unitPrice = Number(product.price);
    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    });
  }

  if (problems.length > 0) {
    return { ok: false, error: problems[0]! };
  }

  if (lines.length === 0) {
    return { ok: false, error: "Your cart has no valid items." };
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const { deliveryFee, total } = getCheckoutTotal(subtotal);

  return {
    ok: true,
    lines,
    subtotal,
    deliveryFee,
    total,
  };
}
