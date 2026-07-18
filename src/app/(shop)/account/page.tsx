import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";

import { requireUser } from "@/lib/supabase/require-user";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AccountAvatar } from "@/components/account/account-avatar";
import { ProfileEditForm } from "@/components/account/profile-edit-form";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Studio D profile and orders.",
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ??
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null);
  const email = profile?.email ?? user.email ?? null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 h-px w-10 bg-brand-coral" />
          <h1 className="font-heading text-3xl font-semibold text-brand-brown">
            Your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your profile and review your orders.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <AccountAvatar name={fullName} email={email} />
              <div className="min-w-0">
                <p className="font-heading text-xl font-semibold text-brand-brown">
                  {fullName || "Studio D member"}
                </p>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {email}
                </p>
                {profile?.avatar_url ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Custom avatar coming soon — using initials for now.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Avatar placeholder — initials based on your name.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-heading text-lg font-semibold text-brand-brown">
                Edit profile
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Email is managed by your sign-in method. You can update your
                display name below.
              </p>
              <div className="mt-4">
                <ProfileEditForm initialFullName={fullName ?? ""} />
              </div>
            </div>
          </div>

          <Link
            href="/account/orders"
            className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-white px-5 py-4 transition-colors hover:border-brand-coral/40 hover:bg-brand-blush/30"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blush">
                <Package className="h-4 w-4 text-brand-coral" />
              </span>
              <div>
                <p className="font-medium text-brand-brown">Order history</p>
                <p className="text-sm text-muted-foreground">
                  View past and current orders
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
            <form action={logout}>
              <Button type="submit" variant="ghost" className="rounded-full">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
