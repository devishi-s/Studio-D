"use server";

import { revalidatePath, updateTag } from "next/cache";

import {
  categoryHref,
  getCategoryBySlug,
  getMainCategoryBySlug,
} from "@/data/categories";
import { requireAdmin } from "@/lib/supabase/require-admin";
import {
  createProduct,
  deleteProduct,
  updateOrderStatus,
  updateProduct,
  type AdminProduct,
} from "@/lib/supabase/admin";
import type { OrderStatus } from "@/types";
import type { Database } from "@/types/database";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type AdminActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

/** Bust catalog `unstable_cache` + refresh storefront/admin product views. */
function revalidateProductCatalog(
  product?: Partial<Pick<AdminProduct, "id" | "slug" | "category">>
) {
  // Server Actions: updateTag expires tagged caches immediately (Next.js 16+).
  updateTag("products");
  if (product?.slug) updateTag(`product:${product.slug}`);

  const categorySlug = product?.category;
  if (categorySlug) {
    updateTag(`category:${categorySlug}`);
    const node = getCategoryBySlug(categorySlug);
    if (node?.parentSlug) {
      updateTag(`category:${node.parentSlug}`);
    }
    const main = getMainCategoryBySlug(categorySlug);
    if (main) {
      for (const child of main.children) {
        updateTag(`category:${child.slug}`);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/categories", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  if (product?.id) {
    revalidatePath(`/admin/products/${product.id}/edit`);
  }
  if (product?.slug) {
    revalidatePath(`/products/${product.slug}`);
  }
  if (categorySlug) {
    const node = getCategoryBySlug(categorySlug);
    if (node) {
      revalidatePath(categoryHref(node));
      if (node.parentSlug) {
        revalidatePath(`/categories/${node.parentSlug}`);
      }
    } else {
      revalidatePath(`/categories/${categorySlug}`);
    }
  }
}

export async function adminCreateProductAction(
  input: ProductInsert
): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    const product = await createProduct(input);
    revalidateProductCatalog(product);
    return { ok: true, id: product.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not create product.",
    };
  }
}

export async function adminUpdateProductAction(
  id: string,
  patch: ProductUpdate
): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    const product = await updateProduct(id, patch);
    revalidateProductCatalog(product);
    return { ok: true, id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update product.",
    };
  }
}

export async function adminDeleteProductAction(
  id: string
): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    await deleteProduct(id);
    revalidateProductCatalog({ id });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not delete product.",
    };
  }
}

export async function adminToggleFeaturedAction(
  id: string,
  featured: boolean
): Promise<AdminActionResult> {
  return adminUpdateProductAction(id, { featured });
}

export async function adminUpdateStockAction(
  id: string,
  stockCount: number
): Promise<AdminActionResult> {
  if (!Number.isInteger(stockCount) || stockCount < 0) {
    return { ok: false, error: "Stock must be a non-negative integer." };
  }
  return adminUpdateProductAction(id, { stock_count: stockCount });
}

export async function adminUpdateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);
    return { ok: true, id: orderId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update status.",
    };
  }
}

