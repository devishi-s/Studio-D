import { createClient } from "@/lib/supabase/client";
import { mapProductRow } from "@/lib/supabase/map-product";
import type { Database } from "@/types/database";
import type { Product } from "@/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/**
 * Fetches active catalog products by id for client-side cart resolution.
 * Uses the public anon client (same RLS as the storefront).
 */
export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", uniqueIds)
    .eq("is_active", true);

  if (error) {
    throw new Error(`fetchProductsByIds: ${error.message}`);
  }

  return ((data ?? []) as ProductRow[]).map(mapProductRow);
}
