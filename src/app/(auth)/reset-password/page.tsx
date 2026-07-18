import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Studio D account password.",
};

export default async function ResetPasswordPage() {
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
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email linked to your account and we&apos;ll send a reset
          link.
        </p>
      </div>
      <ResetPasswordForm />
    </>
  );
}
