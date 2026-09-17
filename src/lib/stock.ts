/** Matches admin low-stock: fewer than this many units. */
export const LOW_STOCK_THRESHOLD = 5;

/** Shopper-facing availability. Exact counts only when stock is scarce. */
export function productAvailabilityCopy(stockCount: number): string {
  if (!Number.isFinite(stockCount) || stockCount <= 0) {
    return "Currently out of stock";
  }

  const count = Math.floor(stockCount);
  if (count < LOW_STOCK_THRESHOLD) {
    return `Only ${count} left`;
  }

  return "In stock, ready to ship";
}
