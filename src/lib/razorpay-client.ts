import { RAZORPAY_CHECKOUT_BRAND } from "@/lib/razorpay-brand";
import type { CheckoutAddress } from "@/types";

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      if (window.Razorpay) resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export type OpenRazorpayCheckoutParams = {
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency?: string;
  address: CheckoutAddress;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss: () => void;
  onFailure?: (message: string) => void;
};

export async function openRazorpayCheckout(
  params: OpenRazorpayCheckoutParams
): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Could not load Razorpay. Check your connection and try again.");
  }

  const rzp = new window.Razorpay({
    key: params.keyId,
    amount: params.amountPaise,
    currency: params.currency ?? "INR",
    name: RAZORPAY_CHECKOUT_BRAND.name,
    description: RAZORPAY_CHECKOUT_BRAND.description,
    order_id: params.orderId,
    prefill: {
      name: params.address.fullName,
      email: params.address.email,
      contact: params.address.phone,
    },
    theme: RAZORPAY_CHECKOUT_BRAND.theme,
    handler: params.onSuccess,
    modal: {
      ondismiss: params.onDismiss,
    },
  });

  rzp.on("payment.failed", (response: unknown) => {
    const description =
      response &&
      typeof response === "object" &&
      "error" in response &&
      response.error &&
      typeof response.error === "object" &&
      "description" in response.error
        ? String((response.error as { description?: string }).description)
        : "Payment failed. Please try again.";
    params.onFailure?.(description);
  });

  rzp.open();
}
