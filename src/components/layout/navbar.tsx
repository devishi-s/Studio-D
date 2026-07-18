import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { CartSheet } from "@/components/cart/cart-sheet";
import { AuthNav, type AuthUserSummary } from "@/components/auth/auth-nav";

async function getAuthUser(): Promise<AuthUserSummary | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  return {
    email: user.email ?? null,
    fullName,
  };
}

export async function Navbar() {
  const user = await getAuthUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-brand-cream/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-semibold text-brand-brown">
              {SITE_NAME}
            </span>
          </Link>

          <NavLinks />

          <div className="flex items-center gap-1 sm:gap-2">
            <AuthNav user={user} />
            <CartSheet />
            <MobileNav user={user} />
          </div>
        </div>
      </Container>
    </header>
  );
}
