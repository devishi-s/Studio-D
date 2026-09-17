/** Matches `supabase/storage.sql` file_size_limit. */
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

export const MAX_PRODUCT_IMAGES = 8;

export const PRODUCT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type ProductImageMimeType = (typeof PRODUCT_IMAGE_MIME_TYPES)[number];

const MIME_TO_EXT: Record<ProductImageMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isProductImageMimeType(
  value: string
): value is ProductImageMimeType {
  return (PRODUCT_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

/** Product ids / slugs used as Storage folder names. */
export function isValidProductImageFolder(id: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,79}$/.test(id);
}

export function validateProductImageFile(
  file: File
): { ok: true } | { ok: false; error: string } {
  if (!isProductImageMimeType(file.type)) {
    return {
      ok: false,
      error: "Use a JPEG, PNG, WebP, or GIF photo.",
    };
  }
  if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
    return {
      ok: false,
      error: `${file.name} is over 5 MB.`,
    };
  }
  return { ok: true };
}

export function buildProductImagePath(
  productId: string,
  mimeType: ProductImageMimeType
): string {
  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`;
  return `${productId}/${unique}.${MIME_TO_EXT[mimeType]}`;
}

/** True when this path lives in the product-images bucket (not a local or remote URL). */
export function isStorageImagePath(path: string): boolean {
  if (!path) return false;
  if (path.startsWith("http://") || path.startsWith("https://")) return false;
  if (path.startsWith("/")) return false;
  return true;
}
