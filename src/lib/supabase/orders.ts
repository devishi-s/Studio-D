import { createClient } from "@/lib/supabase/server";
import { revalidateCartAgainstCatalog } from "@/lib/checkout/revalidate-cart";
import { resolveProductImagePath } from "@/lib/supabase/storage";
import type { CheckoutAddress, CartItem, OrderStatus } from "@/types";
import type { Json } from "@/types/database";

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
  shippingAddress: CheckoutAddress | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  needsManualReview: boolean;
};

export type RazorpayIds = {
  orderId: string;
  paymentId: string;
};

export type CreateOrderResult = {
  orderId: string;
  needsManualReview: boolean;
  alreadyExisted: boolean;
};

export type StockUpdateResult = {
  ok: boolean;
  shortfall: number;
  applied: number;
  remaining: number;
  error?: string;
};

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
  created_at: string;
  shipping_address?: Json | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  needs_manual_review?: boolean | null;
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

function parseShippingAddress(value: Json | null | undefined): CheckoutAddress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.fullName !== "string" ||
    typeof raw.email !== "string" ||
    typeof raw.phone !== "string" ||
    typeof raw.addressLine1 !== "string" ||
    typeof raw.city !== "string" ||
    typeof raw.state !== "string" ||
    typeof raw.pincode !== "string"
  ) {
    return null;
  }

  return {
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    addressLine1: raw.addressLine1,
    ...(typeof raw.addressLine2 === "string" && raw.addressLine2
      ? { addressLine2: raw.addressLine2 }
      : {}),
    city: raw.city,
    state: raw.state,
    pincode: raw.pincode,
  };
}

function addressToJson(address: CheckoutAddress): Json {
  return {
    fullName: address.fullName,
    email: address.email,
    phone: address.phone,
    addressLine1: address.addressLine1,
    ...(address.addressLine2 ? { addressLine2: address.addressLine2 } : {}),
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };
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
      shipping_address,
      razorpay_order_id,
      razorpay_payment_id,
      needs_manual_review,
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

  const row = data as unknown as OrderRow & {
    order_items: OrderItemJoinRow[] | null;
  };
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
    shippingAddress: parseShippingAddress(row.shipping_address),
    razorpayOrderId: row.razorpay_order_id ?? null,
    razorpayPaymentId: row.razorpay_payment_id ?? null,
    needsManualReview: Boolean(row.needs_manual_review),
  };
}

/**
 * Decrements product stock after a paid order.
 * If stock is insufficient (race), applies what remains and reports shortfall.
 */
export async function updateProductStock(
  productId: string,
  quantityOrdered: number
): Promise<StockUpdateResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("decrement_product_stock", {
    p_product_id: productId,
    p_quantity: quantityOrdered,
  });

  if (error) {
    console.error("[updateProductStock] RPC failed", {
      productId,
      quantityOrdered,
      error: error.message,
    });
    return {
      ok: false,
      shortfall: quantityOrdered,
      applied: 0,
      remaining: 0,
      error: error.message,
    };
  }

  const result = (data ?? {}) as {
    ok?: boolean;
    shortfall?: number;
    applied?: number;
    remaining?: number;
    error?: string;
  };

  return {
    ok: Boolean(result.ok),
    shortfall: Number(result.shortfall ?? 0),
    applied: Number(result.applied ?? 0),
    remaining: Number(result.remaining ?? 0),
    error: result.error,
  };
}

/**
 * Creates a confirmed order + immutable line snapshots after payment verification.
 * Idempotent on `razorpayIds.paymentId`.
 *
 * Prices are re-read from the catalog for snapshots — never trust client unit prices.
 * The `total` argument is a sanity check against the recalculated checkout total.
 */
export async function createOrder(
  userId: string,
  cartItems: CartItem[],
  total: number,
  address: CheckoutAddress,
  razorpayIds: RazorpayIds
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("orders")
    .select("id, needs_manual_review")
    .eq("razorpay_payment_id", razorpayIds.paymentId)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Supabase createOrder lookup: ${existingError.message}`);
  }

  if (existing) {
    return {
      orderId: existing.id,
      needsManualReview: Boolean(existing.needs_manual_review),
      alreadyExisted: true,
    };
  }

  const cart = await revalidateCartAgainstCatalog(supabase, cartItems);
  if (!cart.ok) {
    throw new Error(`createOrder cart invalid: ${cart.error}`);
  }

  if (Math.abs(cart.total - total) > 0.01) {
    console.warn("[createOrder] Total mismatch — using server total", {
      clientTotal: total,
      serverTotal: cart.total,
      userId,
      razorpayPaymentId: razorpayIds.paymentId,
    });
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "confirmed",
      total: cart.total,
      shipping_address: addressToJson(address),
      razorpay_order_id: razorpayIds.orderId,
      razorpay_payment_id: razorpayIds.paymentId,
      needs_manual_review: false,
    })
    .select("id")
    .single();

  if (orderError || !orderRow) {
    // Unique race: another request inserted the same payment id.
    if (orderError?.code === "23505") {
      const { data: raced } = await supabase
        .from("orders")
        .select("id, needs_manual_review")
        .eq("razorpay_payment_id", razorpayIds.paymentId)
        .maybeSingle();
      if (raced) {
        return {
          orderId: raced.id,
          needsManualReview: Boolean(raced.needs_manual_review),
          alreadyExisted: true,
        };
      }
    }

    throw new Error(
      `Supabase createOrder insert: ${orderError?.message ?? "unknown error"}`
    );
  }

  const orderId = orderRow.id;

  const itemRows = cart.lines.map((line) => ({
    order_id: orderId,
    product_id: line.productId,
    quantity: line.quantity,
    price_at_purchase: line.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemRows);

  if (itemsError) {
    console.error("[createOrder] order_items insert failed — rolling back order", {
      orderId,
      razorpayPaymentId: razorpayIds.paymentId,
      error: itemsError.message,
    });
    await supabase.from("orders").delete().eq("id", orderId);
    throw new Error(`Supabase createOrder items: ${itemsError.message}`);
  }

  const shortfalls: string[] = [];

  for (const line of cart.lines) {
    const stock = await updateProductStock(line.productId, line.quantity);
    if (!stock.ok || stock.shortfall > 0) {
      shortfalls.push(
        `${line.name} (${line.productId}): ordered ${line.quantity}, shortfall ${stock.shortfall || line.quantity}`
      );
    }
  }

  let needsManualReview = false;
  if (shortfalls.length > 0) {
    needsManualReview = true;
    const reviewNotes = `Stock shortfall after payment — manual review required.\n${shortfalls.join("\n")}`;
    console.error("[createOrder] Stock shortfall — flagged for review", {
      orderId,
      razorpayPaymentId: razorpayIds.paymentId,
      shortfalls,
    });

    const { error: flagError } = await supabase
      .from("orders")
      .update({
        needs_manual_review: true,
        review_notes: reviewNotes,
      })
      .eq("id", orderId)
      .eq("user_id", userId);

    if (flagError) {
      console.error("[createOrder] Failed to set needs_manual_review", {
        orderId,
        error: flagError.message,
      });
    }
  }

  return {
    orderId,
    needsManualReview,
    alreadyExisted: false,
  };
}
