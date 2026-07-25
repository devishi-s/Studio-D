"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/require-admin";
import {
  createProduct,
  deleteProduct,
  updateOrderStatus,
  updateProduct,
} from "@/lib/supabase/admin";
import type { OrderStatus } from "@/types";
import type { Database } from "@/types/database";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type AdminActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export async function adminCreateProductAction(
  input: ProductInsert
): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    const product = await createProduct(input);
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products");
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
    await updateProduct(id, patch);
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/products");
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
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products");
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

