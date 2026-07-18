"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import {
  AUTH_FIELD_CLASS,
  getAuthErrorMessage,
  isValidEmail,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      toast.error("Please check your email");
      return;
    }

    setEmailError("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/account`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        const message = getAuthErrorMessage(error);
        setEmailError(message);
        toast.error(message);
        return;
      }

      setSubmittedEmail(email);
      setIsSuccess(true);
      toast.success("Password reset email sent");
    } catch (error) {
      const message = getAuthErrorMessage(
        error instanceof Error ? error : { message: "Reset request failed." }
      );
      setEmailError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 rounded-2xl border border-brand-sage/30 bg-brand-blush/40 p-6 text-center">
        <h2 className="font-heading text-xl font-semibold text-brand-brown">
          Check your email
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If an account exists for{" "}
          <span className="font-medium text-brand-brown">{submittedEmail}</span>,
          you&apos;ll receive a link to reset your password.
        </p>
        <Link
          href="/login"
          className="inline-flex text-sm font-medium text-brand-coral transition-colors hover:text-brand-brown"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-brand-brown">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : "email-hint"}
          className={AUTH_FIELD_CLASS}
          disabled={isSubmitting}
        />
        {emailError ? (
          <p id="email-error" role="alert" className="mt-1.5 text-xs text-destructive">
            {emailError}
          </p>
        ) : (
          <p id="email-hint" className="mt-1.5 text-xs text-muted-foreground">
            We&apos;ll email you a secure link to choose a new password.
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            Sending link…
          </>
        ) : (
          <>
            <Mail data-icon="inline-start" />
            Send reset link
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-coral transition-colors hover:text-brand-brown"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
