import { unstable_cache } from "next/cache";

/** Catalog / product pages — 1 hour ISR-style cache. */
export const PRODUCT_REVALIDATE_SECONDS = 3600;

type CacheOptions = {
  keyParts: string[];
  tags?: string[];
  revalidate?: number;
};

/**
 * Wraps a Supabase (or other) data loader with Next.js `unstable_cache`.
 * Prefer this over ad-hoc fetch caching when using the Supabase JS client.
 */
export function cachedQuery<T>(
  loader: () => Promise<T>,
  { keyParts, tags = ["products"], revalidate = PRODUCT_REVALIDATE_SECONDS }: CacheOptions
): Promise<T> {
  return unstable_cache(loader, keyParts, { revalidate, tags })();
}
