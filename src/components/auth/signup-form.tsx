"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import {
  AUTH_FIELD_CLASS,
  getAuthErrorMessage,
  isValidEmail,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";

type FieldName = "fullName" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldName, string>>;

export function SignupForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const nextErrors: FieldErrors = {};

    if (fullName.length < 2) {
      nextErrors.fullName = "Please enter at least 2 characters.";
    }
    if (!isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please check the signup form");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=/account`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo,
        },
      });

      if (error) {
        const message = getAuthErrorMessage(error);
        toast.error(message);
        setErrors({ email: message });
        return;
      }

      // Supabase may return a user with empty identities when the email
      // already exists and confirmations are enabled (anti-enumeration).
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        const message =
          "An account with this email may already exist. Try signing in or resetting your password.";
        toast.error(message);
        setErrors({ email: message });
        return;
      }

      setSubmittedEmail(email);
      setIsSuccess(true);
      toast.success("Check your email to verify your account");
    } catch (error) {
      const message = getAuthErrorMessage(
        error instanceof Error ? error : { message: "Sign-up failed." }
      );
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
          We sent a verification link to{" "}
          <span className="font-medium text-brand-brown">{submittedEmail}</span>.
          Open it to activate your account, then sign in.
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
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-brand-brown"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={AUTH_FIELD_CLASS}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p
            id="fullName-error"
            role="alert"
            className="mt-1.5 text-xs text-destructive"
          >
            {errors.fullName}
          </p>
        )}
      </div>

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
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={AUTH_FIELD_CLASS}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1.5 text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-brand-brown"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={AUTH_FIELD_CLASS}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="mt-1.5 text-xs text-destructive"
          >
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-brand-brown"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
          className={AUTH_FIELD_CLASS}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            role="alert"
            className="mt-1.5 text-xs text-destructive"
          >
            {errors.confirmPassword}
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
            Creating account…
          </>
        ) : (
          <>
            <UserPlus data-icon="inline-start" />
            Create account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
