import { createClient } from "@/lib/supabase/server";
import { resolveProductImagePath } from "@/lib/supabase/storage";
import type { OrderStatus } from "@/types";

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
};

export type OrderLineItem = {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  lineTotal: number;
  productName: string;
  productSlug: string | null;
  productImage: string | null;
};

export type OrderDetail = OrderSummary & {
  items: OrderLineItem[];
};

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
  created_at: string;
};

type OrderItemJoinRow = {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number | string;
  products:
    | {
        name: string;
        slug: string;
        images: string[] | null;
      }
    | {
        name: string;
        slug: string;
        images: string[] | null;
      }[]
    | null;
};

function mapStatus(status: string): OrderStatus {
  const allowed: OrderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  return (allowed.includes(status as OrderStatus)
    ? status
    : "pending") as OrderStatus;
}

function mapOrderSummary(row: OrderRow): OrderSummary {
  return {
    id: row.id,
    status: mapStatus(row.status),
    total: Number(row.total),
    createdAt: row.created_at,
  };
}

function unwrapProduct(products: OrderItemJoinRow["products"]) {
  if (!products) return null;
  return Array.isArray(products) ? products[0] ?? null : products;
}

/** Orders for a single user, newest first. Always scoped by userId. */
export async function getOrdersByUser(
  userId: string
): Promise<OrderSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase getOrdersByUser: ${error.message}`);
  }

  return (data ?? []).map((row) => mapOrderSummary(row as OrderRow));
}

/**
 * Single order with line items, scoped by both orderId and userId
 * so users cannot read another customer's order.
 */
export async function getOrderById(
  orderId: string,
  userId: string
): Promise<OrderDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total,
      created_at,
      order_items (
        id,
        product_id,
        quantity,
        price_at_purchase,
        products (
          name,
          slug,
          images
        )
      )
    `
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase getOrderById: ${error.message}`);
  }

  if (!data) return null;

  const row = data as OrderRow & { order_items: OrderItemJoinRow[] | null };
  const items = (row.order_items ?? []).map((item) => {
    const product = unwrapProduct(item.products);
    const priceAtPurchase = Number(item.price_at_purchase);
    const images = (product?.images ?? []).map(resolveProductImagePath);

    return {
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      priceAtPurchase,
      lineTotal: priceAtPurchase * item.quantity,
      productName: product?.name ?? "Unavailable product",
      productSlug: product?.slug ?? null,
      productImage: images[0] ?? null,
    };
  });

  return {
    ...mapOrderSummary(row),
    items,
  };
}
