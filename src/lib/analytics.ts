import { track } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean | null | undefined>;

/**
 * Safe custom-event helper. No-ops on the server so wrappers can be imported
 * from Server Components without crashing (events only fire in the browser).
 */
function trackEvent(name: string, props?: EventProps) {
  if (typeof window === "undefined") return;

  const cleaned: Record<string, string | number | boolean | null> = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined) continue;
      cleaned[key] = value;
    }
  }

  track(name, cleaned);
}

/** Product detail page visit — catalog identifiers only (no user PII). */
export function trackProductViewed(input: {
  productId: string;
  productName: string;
  category: string;
}) {
  trackEvent("product_viewed", {
    productId: input.productId,
    productName: input.productName,
    category: input.category,
  });
}

/** Add to cart — product id/name/price only. */
export function trackAddToCart(input: {
  productId: string;
  productName: string;
  price: number;
}) {
  trackEvent("add_to_cart", {
    productId: input.productId,
    productName: input.productName,
    price: input.price,
  });
}

/** User landed on /checkout. */
export function trackCheckoutStarted() {
  trackEvent("checkout_started");
}

/** Razorpay checkout modal is about to open. */
export function trackPaymentInitiated() {
  trackEvent("payment_initiated");
}

/** Order confirmation page — order id + total only (no email/address). */
export function trackOrderCompleted(input: {
  orderId: string;
  total: number;
}) {
  trackEvent("order_completed", {
    orderId: input.orderId,
    total: input.total,
  });
}

/** Catalog search committed (debounced URL update). */
export function trackSearchPerformed(input: {
  searchTerm: string;
  resultCount: number;
}) {
  trackEvent("search_performed", {
    searchTerm: input.searchTerm,
    resultCount: input.resultCount,
  });
}

/** Category filter changed on /products. */
export function trackCategoryFiltered(input: { category: string }) {
  trackEvent("category_filtered", {
    category: input.category,
  });
}
