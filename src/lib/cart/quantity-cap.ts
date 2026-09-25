import { MAX_CART_ITEMS } from "@/lib/constants";

/** Upper bound for a cart line: live stock, never above {@link MAX_CART_ITEMS}. */
export function cartQuantityCap(stockCount: number): number {
  if (!Number.isFinite(stockCount) || stockCount <= 0) return 0;
  return Math.min(Math.floor(stockCount), MAX_CART_ITEMS);
}
