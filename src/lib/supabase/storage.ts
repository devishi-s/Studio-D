/** Public Storage bucket for catalog product photos. */
export const PRODUCT_IMAGES_BUCKET = "product-images";

/**
 * Builds the public URL for an object in a Storage bucket.
 * Does not perform a network request.
 */
export function getPublicImageUrl(bucket: string, path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. See docs/SUPABASE.md."
    );
  }

  const cleanPath = path.replace(/^\/+/, "");
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

/**
 * Normalizes a product image reference for the storefront:
 * - Absolute http(s) URLs are returned as-is.
 * - Local public paths (`/images/...`) are left as-is.
 * - Relative storage object paths become public Supabase URLs.
 */
export function resolveProductImagePath(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return getPublicImageUrl(PRODUCT_IMAGES_BUCKET, path);
}

/** True when `src` can be passed to `next/image` as a remote or public asset. */
export function canOptimizeProductImage(src: string | null | undefined): boolean {
  if (!src) return false;
  if (src.startsWith("/images/")) return true;
  return src.startsWith("http://") || src.startsWith("https://");
}
