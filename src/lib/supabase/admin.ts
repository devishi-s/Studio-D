import { createClient } from "@/lib/supabase/server";
import type { CheckoutAddress, OrderStatus } from "@/types";
import type { Database, Json } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  images: string[];
  tags: string[];
  featured: boolean;
  isActive: boolean;
  materials: string[];
  dimensions: string;
  stockCount: number;
  createdAt: string;
};

export type AdminOrderSummary = {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  customerName: string;
  customerEmail: string | null;
  needsManualReview: boolean;
};

export type AdminOrderDetail = AdminOrderSummary & {
  shippingAddress: CheckoutAddress | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  reviewNotes: string | null;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    priceAtPurchase: number;
    lineTotal: number;
  }[];
};

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: AdminProduct[];
  recentOrders: AdminOrderSummary[];
};

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function mapStatus(status: string): OrderStatus {
  return (ORDER_STATUSES.includes(status as OrderStatus)
    ? status
    : "pending") as OrderStatus;
}

function mapProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price == null ? null : Number(row.compare_at_price),
    category: row.category,
    images: row.images ?? [],
    tags: row.tags ?? [],
    featured: row.featured,
    isActive: row.is_active,
    materials: row.materials ?? [],
    dimensions: row.dimensions ?? "",
    stockCount: row.stock_count,
    createdAt: row.created_at,
  };
}

function parseShippingAddress(value: Json | null): CheckoutAddress | null {
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

function resolveCustomer(
  shipping: Json | null,
  profile: { full_name: string | null; email: string | null } | undefined
): { name: string; email: string | null } {
  const address = parseShippingAddress(shipping);
  return {
    name: address?.fullName || profile?.full_name || "Customer",
    email: address?.email || profile?.email || null,
  };
}

async function loadProfilesByIds(
  userIds: string[]
): Promise<Map<string, { full_name: string | null; email: string | null }>> {
  const map = new Map<
    string,
    { full_name: string | null; email: string | null }
  >();
  if (userIds.length === 0) return map;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", [...new Set(userIds)]);

  if (error) {
    console.error("[admin] loadProfilesByIds", error.message);
    return map;
  }

  for (const row of data ?? []) {
    map.set(row.id, { full_name: row.full_name, email: row.email });
  }
  return map;
}

function toOrderSummary(
  row: {
    id: string;
    user_id: string;
    status: string;
    total: number | string;
    created_at: string;
    shipping_address: Json | null;
    needs_manual_review: boolean | null;
  },
  profiles: Map<string, { full_name: string | null; email: string | null }>
): AdminOrderSummary {
  const customer = resolveCustomer(
    row.shipping_address,
    profiles.get(row.user_id)
  );
  return {
    id: row.id,
    status: mapStatus(row.status),
    total: Number(row.total),
    createdAt: row.created_at,
    customerName: customer.name,
    customerEmail: customer.email,
    needsManualReview: Boolean(row.needs_manual_review),
  };
}

/** Dashboard metrics for `/admin`. */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [ordersRes, lowStockRes, recentRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, status")
      .neq("status", "cancelled"),
    supabase
      .from("products")
      .select("*")
      .lt("stock_count", 5)
      .order("stock_count", { ascending: true })
      .limit(20),
    supabase
      .from("orders")
      .select(
        "id, user_id, status, total, created_at, shipping_address, needs_manual_review"
      )
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (ordersRes.error) {
    throw new Error(`getAdminStats orders: ${ordersRes.error.message}`);
  }
  if (lowStockRes.error) {
    throw new Error(`getAdminStats lowStock: ${lowStockRes.error.message}`);
  }
  if (recentRes.error) {
    throw new Error(`getAdminStats recent: ${recentRes.error.message}`);
  }

  const profiles = await loadProfilesByIds(
    (recentRes.data ?? []).map((row) => row.user_id)
  );

  return {
    totalOrders: ordersRes.data?.length ?? 0,
    totalRevenue: (ordersRes.data ?? []).reduce(
      (sum, row) => sum + Number(row.total),
      0
    ),
    lowStockProducts: (lowStockRes.data ?? []).map((row) =>
      mapProduct(row as ProductRow)
    ),
    recentOrders: (recentRes.data ?? []).map((row) =>
      toOrderSummary(
        {
          ...row,
          shipping_address: row.shipping_address as Json | null,
        },
        profiles
      )
    ),
  };
}

/** All catalog products for admin (including inactive). */
export async function getAllProducts(): Promise<AdminProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function getAdminProductById(
  id: string
): Promise<AdminProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getAdminProductById: ${error.message}`);
  return data ? mapProduct(data as ProductRow) : null;
}

export async function getAllOrders(): Promise<AdminOrderSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, status, total, created_at, shipping_address, needs_manual_review"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getAllOrders: ${error.message}`);

  const profiles = await loadProfilesByIds(
    (data ?? []).map((row) => row.user_id)
  );

  return (data ?? []).map((row) =>
    toOrderSummary(
      {
        ...row,
        shipping_address: row.shipping_address as Json | null,
      },
      profiles
    )
  );
}

export async function getAdminOrderById(
  orderId: string
): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      user_id,
      status,
      total,
      created_at,
      shipping_address,
      razorpay_order_id,
      razorpay_payment_id,
      needs_manual_review,
      review_notes,
      order_items (
        id,
        product_id,
        quantity,
        price_at_purchase,
        products ( name )
      )
    `
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw new Error(`getAdminOrderById: ${error.message}`);
  if (!data) return null;

  const profiles = await loadProfilesByIds([data.user_id]);
  const summary = toOrderSummary(
    {
      id: data.id,
      user_id: data.user_id,
      status: data.status,
      total: data.total,
      created_at: data.created_at,
      shipping_address: data.shipping_address as Json | null,
      needs_manual_review: data.needs_manual_review,
    },
    profiles
  );

  const rawItems = data.order_items as
    | {
        id: string;
        product_id: string;
        quantity: number;
        price_at_purchase: number | string;
        products: { name: string } | { name: string }[] | null;
      }[]
    | null;

  const items = (rawItems ?? []).map((item) => {
    const product = Array.isArray(item.products)
      ? item.products[0]
      : item.products;
    const price = Number(item.price_at_purchase);
    return {
      id: item.id,
      productId: item.product_id,
      productName: product?.name ?? item.product_id,
      quantity: item.quantity,
      priceAtPurchase: price,
      lineTotal: price * item.quantity,
    };
  });

  return {
    ...summary,
    shippingAddress: parseShippingAddress(
      data.shipping_address as Json | null
    ),
    razorpayOrderId: data.razorpay_order_id,
    razorpayPaymentId: data.razorpay_payment_id,
    reviewNotes: data.review_notes,
    items,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid order status.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(`updateOrderStatus: ${error.message}`);
}

export async function updateProduct(
  id: string,
  patch: ProductUpdate
): Promise<AdminProduct> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`updateProduct: ${error?.message ?? "not found"}`);
  }

  return mapProduct(data as ProductRow);
}

export async function createProduct(
  input: ProductInsert
): Promise<AdminProduct> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`createProduct: ${error?.message ?? "insert failed"}`);
  }

  return mapProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(`deleteProduct: ${error.message}`);
}
