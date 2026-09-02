import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, CartItemWithProduct, Product } from "@/types";
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

// ─── Derived helpers (need a live catalog map from Supabase) ─

function resolveProduct(
  productId: string,
  catalog: Map<string, Product> | ReadonlyMap<string, Product>
): Product | undefined {
  return catalog.get(productId);
}

/**
 * Returns cart items with full Product data attached from a live catalog map.
 * Filters out lines whose product is missing (inactive / deleted).
 */
export function getItemsWithProducts(
  items: CartItem[],
  catalog: Map<string, Product> | ReadonlyMap<string, Product>
): CartItemWithProduct[] {
  return items.reduce<CartItemWithProduct[]>((acc, item) => {
    const product = resolveProduct(item.productId, catalog);
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
export function getCartSubtotal(
  items: CartItem[],
  catalog: Map<string, Product> | ReadonlyMap<string, Product>
): number {
  return getItemsWithProducts(items, catalog).reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
}
