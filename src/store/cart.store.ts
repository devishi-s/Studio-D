import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, CartItemWithProduct, Product } from "@/types";
import { MAX_CART_ITEMS } from "@/lib/constants";
import { cartQuantityCap } from "@/lib/cart/quantity-cap";

// ─── Store shape ─────────────────────────────────────────────

type CartState = {
  items: CartItem[];
};

type CartActions = {
  addItem: (
    productId: string,
    quantity?: number,
    maxQuantity?: number
  ) => { added: number; quantity: number; cap: number };
  removeItem: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    maxQuantity?: number
  ) => void;
  clearCart: () => void;
  /** Drop or shrink lines that exceed live stock. */
  clampToCatalog: (
    catalog: Map<string, Product> | ReadonlyMap<string, Product>
  ) => void;
};

type CartStore = CartState & CartActions;

function capFor(maxQuantity?: number): number {
  if (maxQuantity == null) return MAX_CART_ITEMS;
  return cartQuantityCap(maxQuantity);
}

// ─── Store ───────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, quantity = 1, maxQuantity) => {
        const cap = capFor(maxQuantity);
        const { items } = get();
        const existing = items.find((i) => i.productId === productId);
        const current = existing?.quantity ?? 0;
        const next = Math.min(current + Math.max(0, quantity), cap);
        const added = Math.max(0, next - current);

        if (cap <= 0 || added === 0) {
          return { added: 0, quantity: current, cap };
        }

        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === productId ? { ...i, quantity: next } : i
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity: next }] });
        }

        return { added, quantity: next, cap };
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity, maxQuantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const cap = capFor(maxQuantity);
        if (cap <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, cap) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      clampToCatalog: (catalog) => {
        const { items } = get();
        let changed = false;
        const next: CartItem[] = [];

        for (const item of items) {
          const product = catalog.get(item.productId);
          if (!product) {
            next.push(item);
            continue;
          }
          const cap = cartQuantityCap(product.stockCount);
          if (cap <= 0) {
            changed = true;
            continue;
          }
          if (item.quantity > cap) {
            next.push({ ...item, quantity: cap });
            changed = true;
          } else {
            next.push(item);
          }
        }

        if (changed) set({ items: next });
      },
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
      const cap = cartQuantityCap(product.stockCount);
      acc.push({
        product,
        quantity: cap > 0 ? Math.min(item.quantity, cap) : 0,
      });
    }
    return acc;
  }, []).filter((line) => line.quantity > 0);
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
