export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: Category;
  tags: string[];
  materials: string[];
  dimensions: string;
  stockCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
};

/**
 * Lean cart item stored in Zustand / localStorage.
 * Only holds the product ID and quantity — not the full Product object.
 * This keeps the persisted state small and avoids stale nested data.
 */
export type CartItem = {
  productId: string;
  quantity: number;
};

/**
 * Resolved cart item with full product data attached.
 * Used by UI components that need to display product details.
 * Created on-the-fly by the cart store's `getItemsWithProducts()` helper.
 */
export type CartItemWithProduct = {
  product: Product;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type NavLink = {
  label: string;
  href: string;
};

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";
