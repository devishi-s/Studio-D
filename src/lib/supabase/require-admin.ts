import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/lib/auth";

/**
 * Requires a signed-in admin (`profiles.is_admin = true`).
 * Non-admins are sent home with `?error=unauthorized`.
 */
export async function requireAdmin(
  redirectTo = "/admin"
): Promise<{ user: User; fullName: string | null; email: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const safePath = getSafeRedirectPath(redirectTo, "/admin");
    redirect(`/login?redirectTo=${encodeURIComponent(safePath)}`);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[requireAdmin] profile lookup failed", error.message);
    redirect("/?error=unauthorized");
  }

  if (!profile?.is_admin) {
    redirect("/?error=unauthorized");
  }

  return {
    user,
    fullName: profile.full_name,
    email: profile.email ?? user.email ?? null,
  };
}
