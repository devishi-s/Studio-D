import { createClient } from "@/lib/supabase/client";
import {
  buildProductImagePath,
  isProductImageMimeType,
  isStorageImagePath,
  isValidProductImageFolder,
  validateProductImageFile,
} from "@/lib/product-images";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/supabase/storage";

/**
 * Uploads catalog photos to the public `product-images` bucket.
 * Call from Client Components only (uses the browser Supabase client).
 */
export async function uploadProductImages(
  productId: string,
  files: File[]
): Promise<{ ok: true; paths: string[] } | { ok: false; error: string }> {
  if (!isValidProductImageFolder(productId)) {
    return {
      ok: false,
      error: "Add a product name first, then attach photos.",
    };
  }

  const supabase = createClient();
  const paths: string[] = [];

  for (const file of files) {
    const valid = validateProductImageFile(file);
    if (!valid.ok) return valid;
    if (!isProductImageMimeType(file.type)) {
      return { ok: false, error: "Use a JPEG, PNG, WebP, or GIF photo." };
    }

    const path = buildProductImagePath(productId, file.type);
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return {
        ok: false,
        error: error.message || "Could not upload that photo.",
      };
    }
    paths.push(path);
  }

  return { ok: true, paths };
}

/** Best-effort delete. Removing a photo from the product still succeeds if this fails. */
export async function deleteProductImage(path: string): Promise<void> {
  if (!isStorageImagePath(path)) return;
  const supabase = createClient();
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
}
