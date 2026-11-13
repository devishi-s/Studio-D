import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/container";
import { NavbarGooey } from "@/components/layout/navbar-gooey";
import { NavbarActions } from "@/components/layout/navbar-actions";
import { SiteLogo } from "@/components/layout/site-logo";
import type { AuthUserSummary } from "@/components/auth/auth-nav";

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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-brand-cream/90 font-ui backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <SiteLogo priority className="h-10 sm:h-11" />

          <NavbarGooey />

          <NavbarActions user={user} />
        </div>
      </Container>
    </header>
  );
}
