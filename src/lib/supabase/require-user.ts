import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/lib/auth";

/**
 * Server-side auth guard for protected account routes.
 * Redirects unauthenticated visitors to `/login?redirectTo=…`.
 */
export async function requireUser(redirectTo = "/account"): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const safePath = getSafeRedirectPath(redirectTo, "/account");
    redirect(`/login?redirectTo=${encodeURIComponent(safePath)}`);
  }

  return user;
}
