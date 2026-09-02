"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  addToWishlist,
  getWishlistProductIds,
  removeFromWishlist,
} from "@/lib/supabase/wishlist";

export type WishlistActionResult =
  | { ok: true; wishlisted: boolean }
  | { ok: false; error: string; requiresAuth?: boolean };

export async function toggleWishlistAction(
  productId: string
): Promise<WishlistActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Please sign in to save items.",
      requiresAuth: true,
    };
  }

  try {
    const ids = await getWishlistProductIds(user.id);
    const already = ids.includes(productId);

    if (already) {
      await removeFromWishlist(user.id, productId);
      revalidatePath("/account/wishlist");
      revalidatePath("/account");
      return { ok: true, wishlisted: false };
    }

    await addToWishlist(user.id, productId);
    revalidatePath("/account/wishlist");
    revalidatePath("/account");
    return { ok: true, wishlisted: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update wishlist.",
    };
  }
}
