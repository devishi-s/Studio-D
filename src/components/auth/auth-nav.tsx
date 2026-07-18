"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2, LogOut, UserRound } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export type AuthUserSummary = {
  email: string | null;
  fullName: string | null;
};

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="rounded-full text-brand-brown-light hover:text-brand-brown"
      disabled={pending}
      aria-label="Sign out"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">Sign out</span>
    </Button>
  );
}

type AuthNavProps = {
  user: AuthUserSummary | null;
};

export function AuthNav({ user }: AuthNavProps) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden rounded-full px-3 py-2 text-sm font-medium text-brand-brown-light transition-colors hover:text-brand-brown md:inline-flex"
      >
        Login
      </Link>
    );
  }

  const label = user.fullName?.trim() || user.email || "Account";
  const initials = (user.fullName?.trim() || user.email || "A")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="hidden items-center gap-1 md:flex">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-blush/70"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blush text-xs font-semibold text-brand-brown">
          {initials || <UserRound className="h-4 w-4" />}
        </span>
        <span className="max-w-[9rem] truncate">{label}</span>
      </Link>
      <form action={logout}>
        <LogoutSubmitButton />
      </form>
    </div>
  );
}

type MobileAuthLinksProps = {
  user: AuthUserSummary | null;
  onNavigate?: () => void;
};

export function MobileAuthLinks({ user, onNavigate }: MobileAuthLinksProps) {
  if (!user) {
    return (
      <div className="space-y-1 border-t border-border px-4 py-4">
        <Link
          href="/login"
          onClick={onNavigate}
          className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-brown"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={onNavigate}
          className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-brown-light"
        >
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1 border-t border-border px-4 py-4">
      <Link
        href="/account"
        onClick={onNavigate}
        className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-brown"
      >
        Account
      </Link>
      <form action={logout}>
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start rounded-md px-3 text-brand-brown-light"
        >
          <LogOut data-icon="inline-start" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
