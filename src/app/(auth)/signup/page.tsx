import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Studio D account to save orders and preferences.",
};

export default async function SignupPage() {
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
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join Studio D for a warmer, more personal shopping experience.
        </p>
      </div>
      <SignupForm />
    </>
  );
}
