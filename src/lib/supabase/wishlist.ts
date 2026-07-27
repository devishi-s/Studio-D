import { createClient } from "@/lib/supabase/server";
import { mapProductRow } from "@/lib/supabase/products";
import type { Database } from "@/types/database";
import type { Product } from "@/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function assertNoError(error: { message: string } | null, context: string) {
  if (error) {
    throw new Error(`Supabase ${context}: ${error.message}`);
  }
}

type WishlistJoinRow = {
  product_id: string;
  created_at: string;
  products: ProductRow | ProductRow[] | null;
};

function unwrapProduct(products: ProductRow | ProductRow[] | null): ProductRow | null {
  if (!products) return null;
  return Array.isArray(products) ? products[0] ?? null : products;
}

/** Full product details for a user's wishlist, newest saves first. */
export async function getWishlist(userId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id, created_at, products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  assertNoError(error, "getWishlist");

  return ((data ?? []) as WishlistJoinRow[])
    .map((row) => unwrapProduct(row.products))
    .filter((row): row is ProductRow => row != null && row.is_active)
    .map(mapProductRow);
}

/** Product IDs currently wishlisted by the user. */
export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", userId);

  assertNoError(error, "getWishlistProductIds");
  return (data ?? []).map((row) => row.product_id);
}

/** Wishlist IDs for the current session user, or `null` when signed out. */
export async function getCurrentUserWishlistIds(): Promise<string[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getWishlistProductIds(user.id);
}

export async function addToWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("wishlist").insert({
    user_id: userId,
    product_id: productId,
  });

  if (error) {
    if (error.code === "23505") return; // already wishlisted
    throw new Error(`Supabase addToWishlist: ${error.message}`);
  }
}

export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  assertNoError(error, "removeFromWishlist");
}

export async function isWishlisted(
  userId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  assertNoError(error, "isWishlisted");
  return Boolean(data);
}
