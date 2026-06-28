import type { NavLink } from "@/types";

export const SITE_NAME = "Studio D";
export const SITE_DESCRIPTION =
  "Handmade crochet flowers, paintings, and decorative crafts — thoughtfully made, timeless in design.";
export const SITE_URL = "https://studiod.in";
export const SITE_TAGLINE = "Handmade · Thoughtful · Timeless";

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

export const CATEGORIES = [
  "crochet-flowers",
  "paintings",
  "handmade-gifts",
  "decorative-items",
] as const;

export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "\u20B9";

export const MAX_CART_ITEMS = 99;
export const FREE_SHIPPING_THRESHOLD = 999;
