"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchProductsByIds } from "@/lib/cart/fetch-products-by-ids";
import {
  getCartItemCount,
  getCartSubtotal,
  getItemsWithProducts,
  useCartStore,
} from "@/store/cart.store";
import type { CartItemWithProduct, Product } from "@/types";

type CartCatalogState = {
  catalog: Map<string, Product>;
  /** `idsKey` this catalog was fetched for. */
  catalogKey: string;
  isLoading: boolean;
  error: string | null;
};

/**
 * Loads live Supabase product rows for the current cart and returns
 * resolved line items + subtotal (replacing the old static catalog).
 */
export function useResolvedCart(): {
  items: ReturnType<typeof useCartStore.getState>["items"];
  resolved: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
} {
  const items = useCartStore((s) => s.items);
  const idsKey = useMemo(
    () =>
      [...new Set(items.map((item) => item.productId))].sort().join(","),
    [items]
  );

  const [state, setState] = useState<CartCatalogState>({
    catalog: new Map(),
    catalogKey: "",
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!idsKey) {
      setState({
        catalog: new Map(),
        catalogKey: "",
        isLoading: false,
        error: null,
      });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetchProductsByIds(idsKey.split(","))
      .then((products) => {
        if (cancelled) return;
        const catalog = new Map(
          products.map((product) => [product.id, product])
        );
        setState({
          catalog,
          catalogKey: idsKey,
          isLoading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          catalog: new Map(),
          catalogKey: idsKey,
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Could not load cart products.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  const resolved = getItemsWithProducts(items, state.catalog);
  const itemCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items, state.catalog);
  const isLoading =
    Boolean(idsKey) &&
    (state.isLoading || state.catalogKey !== idsKey);

  return {
    items,
    resolved,
    itemCount,
    subtotal,
    isLoading,
    error: state.error,
  };
}
