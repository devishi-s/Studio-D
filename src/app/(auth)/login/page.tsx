import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Studio D account.",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  return (
    <>
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 h-px w-10 bg-brand-coral" />
        <h1 className="font-heading text-2xl font-semibold text-brand-brown">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view your account and future orders.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-brand-blush/50" />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
