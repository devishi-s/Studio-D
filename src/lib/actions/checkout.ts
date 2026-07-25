"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidateCartAgainstCatalog } from "@/lib/checkout/revalidate-cart";
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

  const result = await revalidateCartAgainstCatalog(supabase, items);
  if (!result.ok) return result;

  return {
    ok: true,
    lines: result.lines,
    subtotal: result.subtotal,
    deliveryFee: result.deliveryFee,
    total: result.total,
  };
}
