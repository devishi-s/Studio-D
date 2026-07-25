import type { SupabaseClient } from "@supabase/supabase-js";

import { getCheckoutTotal } from "@/lib/checkout";
import type { Database } from "@/types/database";
import type { CartItem, CheckoutLine } from "@/types";

export type CartRevalidationSuccess = {
  ok: true;
  lines: CheckoutLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Amount in paise for Razorpay. */
  amountPaise: number;
};

export type CartRevalidationFailure = {
  ok: false;
  error: string;
};

export type CartRevalidationResult =
  | CartRevalidationSuccess
  | CartRevalidationFailure;

/**
 * Recalculates cart totals from live Supabase catalog prices.
 * Never trust client-sent amounts.
 */
export async function revalidateCartAgainstCatalog(
  supabase: SupabaseClient<Database>,
  items: CartItem[]
): Promise<CartRevalidationResult> {
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
  const amountPaise = Math.round(total * 100);

  if (amountPaise < 100) {
    return {
      ok: false,
      error: "Order total is too low to process payment.",
    };
  }

  return {
    ok: true,
    lines,
    subtotal,
    deliveryFee,
    total,
    amountPaise,
  };
}

export function isCartItemArray(value: unknown): value is CartItem[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as CartItem).productId === "string" &&
      typeof (item as CartItem).quantity === "number"
  );
}
