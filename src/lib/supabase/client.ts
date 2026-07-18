import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

type CreateBrowserClientOptions = {
  /** Cookie lifetime in seconds. Used by login "Remember me". */
  cookieMaxAge?: number;
};

/**
 * Browser Supabase client for Client Components.
 * Uses the public anon key and cookie-backed auth via @supabase/ssr.
 */
export function createClient(options?: CreateBrowserClientOptions) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. See docs/SUPABASE.md."
    );
  }

  return createBrowserClient<Database>(url, anonKey, {
    ...(options?.cookieMaxAge != null
      ? {
          cookieOptions: {
            maxAge: options.cookieMaxAge,
          },
        }
      : {}),
  });
}
