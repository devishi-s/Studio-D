import type { NavLink } from "@/types";

export const SITE_NAME = "Studio D";
export const SITE_DESCRIPTION =
  "Handmade crochet flowers, paintings, and decorative crafts. Thoughtfully made, timeless in design.";
/** Fallback until NEXT_PUBLIC_SITE_URL is set to the live Render / custom domain. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://studiod.in";
export const SITE_TAGLINE = "Handmade · Thoughtful · Timeless";

/**
 * Public studio inbox for contact / support copy.
 * Prefer NEXT_PUBLIC_CONTACT_EMAIL; falls back to ADMIN_NOTIFICATION_EMAIL.
 */
export function getSiteContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    "hello@studiod.in"
  );
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const CURRENCY = "INR";

export const MAX_CART_ITEMS = 99;
export const FREE_SHIPPING_THRESHOLD = 999;
/** Flat delivery fee (INR) when subtotal is below the free-shipping threshold. */
export const FLAT_DELIVERY_FEE = 79;
