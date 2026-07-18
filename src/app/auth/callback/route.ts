import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Handles Supabase auth redirects (email verification, password recovery, OAuth).
 * Exchanges the `code` query param for a session cookie, then redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectParam =
    searchParams.get("redirectTo") ?? searchParams.get("next");
  const next =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set(
    "error",
    "Could not complete sign-in. Please try again."
  );
  return NextResponse.redirect(loginUrl);
}
