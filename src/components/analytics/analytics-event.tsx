"use client";

import { useEffect, useRef } from "react";

import {
  trackCheckoutStarted,
  trackOrderCompleted,
  trackProductViewed,
} from "@/lib/analytics";

type ProductViewedProps = {
  event: "product_viewed";
  productId: string;
  productName: string;
  category: string;
};

type CheckoutStartedProps = {
  event: "checkout_started";
};

type OrderCompletedProps = {
  event: "order_completed";
  orderId: string;
  total: number;
};

type AnalyticsEventProps =
  | ProductViewedProps
  | CheckoutStartedProps
  | OrderCompletedProps;

/**
 * Fires a funnel event once on mount. Use from Server Component pages that
 * cannot call `track()` during SSR.
 */
export function AnalyticsEvent(props: AnalyticsEventProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    switch (props.event) {
      case "product_viewed":
        trackProductViewed({
          productId: props.productId,
          productName: props.productName,
          category: props.category,
        });
        break;
      case "checkout_started":
        trackCheckoutStarted();
        break;
      case "order_completed":
        trackOrderCompleted({
          orderId: props.orderId,
          total: props.total,
        });
        break;
    }
    // Intentional: fire once per mount with the initial props.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only funnel ping
  }, []);

  return null;
}
