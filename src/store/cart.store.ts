import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, CartItemWithProduct, Product } from "@/types";
import { products as allProducts } from "@/data/products";
import { MAX_CART_ITEMS } from "@/lib/constants";

// ─── Store shape ─────────────────────────────────────────────

type CartState = {
  items: CartItem[];
};

type CartActions = {
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

type CartStore = CartState & CartActions;

// ─── Store ───────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === productId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_CART_ITEMS) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, MAX_CART_ITEMS) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "studio-d-cart",
    }
  )
);

// ─── Derived selectors (called outside the store) ────────────

function resolveProduct(productId: string): Product | undefined {
  return allProducts.find((p) => p.id === productId);
}

/**
 * Returns cart items with full Product data attached.
 * Filters out any items whose product no longer exists
 * (e.g. if a product was removed from the catalog).
 */
export function getItemsWithProducts(items: CartItem[]): CartItemWithProduct[] {
  return items.reduce<CartItemWithProduct[]>((acc, item) => {
    const product = resolveProduct(item.productId);
    if (product) {
      acc.push({ product, quantity: item.quantity });
    }
    return acc;
  }, []);
}

/** Total number of individual items in the cart (sum of quantities). */
export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Cart subtotal in the base currency (before shipping/tax). */
export function getCartSubtotal(items: CartItem[]): number {
  return getItemsWithProducts(items).reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
}
