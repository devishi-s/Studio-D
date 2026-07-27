import type { Metadata } from "next";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";
import type { Product } from "@/types";

export const OG_IMAGE_PATH = "/og-image.jpg";

export const SITE_SOCIAL = {
  instagram: "https://instagram.com/studiod",
  email: "mailto:hello@studiod.in",
} as const;

/** Absolute URL helper for canonicals, sitemap, and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
} as const;

/** Shared Open Graph + Twitter defaults layered onto page metadata. */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  /** Bypass "%s | Studio D" template (homepage). */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? OG_IMAGE_PATH;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/og-image.jpg"),
    description: SITE_DESCRIPTION,
    email: "hello@studiod.in",
    sameAs: [SITE_SOCIAL.instagram],
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl("/og-image.jpg"),
    description:
      "Handmade crochet flowers, original paintings, and thoughtful gifts crafted with care in India.",
    email: "hello@studiod.in",
    priceRange: "₹₹",
    sameAs: [SITE_SOCIAL.instagram],
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

export function productJsonLd(product: Product) {
  const image =
    product.images.find((src) => src.startsWith("http")) ??
    absoluteUrl(OG_IMAGE_PATH);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [image],
    sku: product.id,
    url: absoluteUrl(`/products/${product.slug}`),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "INR",
      price: product.price.toFixed(2),
      availability:
        product.stockCount > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
