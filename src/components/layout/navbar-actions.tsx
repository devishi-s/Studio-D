"use client";

import dynamic from "next/dynamic";

import { AuthNav, type AuthUserSummary } from "@/components/auth/auth-nav";

const CartSheet = dynamic(
  () =>
    import("@/components/cart/cart-sheet").then((mod) => mod.CartSheet),
  {
    ssr: false,
    loading: () => (
      <div
        className="inline-flex h-9 w-9 items-center justify-center"
        aria-hidden
      />
    ),
  }
);

const MobileNav = dynamic(
  () =>
    import("@/components/layout/mobile-nav").then((mod) => mod.MobileNav),
  {
    ssr: false,
    loading: () => (
      <div
        className="inline-flex h-9 w-9 md:hidden"
        aria-hidden
      />
    ),
  }
);

type NavbarActionsProps = {
  user: AuthUserSummary | null;
};

/** Lazily loads heavy cart sheet + mobile nav Client Components. */
export function NavbarActions({ user }: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <AuthNav user={user} />
      <CartSheet />
      <MobileNav user={user} />
    </div>
  );
}
