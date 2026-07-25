import { SITE_NAME } from "@/lib/constants";

/** Safe to import from Client Components (no secrets). */
export const RAZORPAY_CHECKOUT_BRAND = {
  name: SITE_NAME,
  description: "Handmade crochet flowers, paintings, and gifts",
  theme: { color: "#5C4033" },
} as const;
