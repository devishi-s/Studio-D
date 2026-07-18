"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import {
  AUTH_FIELD_CLASS,
  getAuthErrorMessage,
  getSafeRedirectPath,
  isValidEmail,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(
    searchParams.get("error") ?? ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";
    const nextErrors: FieldErrors = {};

    if (!isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (password.length < 1) {
      nextErrors.password = "Please enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please check the login form");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const supabase = createClient({
        cookieMaxAge: rememberMe ? 60 * 60 * 24 * 400 : 60 * 60 * 12,
      });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message = getAuthErrorMessage(error);
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back");
      const redirectTo =
        searchParams.get("redirectTo") ?? searchParams.get("next");
      const destination = getSafeRedirectPath(redirectTo, "/account");
      router.push(destination);
      router.refresh();
    } catch (error) {
      const message = getAuthErrorMessage(
        error instanceof Error ? error : { message: "Sign-in failed." }
      );
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="password"
            className="text-sm font-medium text-brand-brown"
          >
            Password
          </label>
          <Link
            href="/reset-password"
            className="text-xs font-medium text-brand-coral transition-colors hover:text-brand-brown"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
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

      <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="rememberMe"
          defaultChecked
          className="size-4 rounded border-input text-brand-brown accent-brand-coral"
          disabled={isSubmitting}
        />
        Remember me on this device
      </label>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn data-icon="inline-start" />
            Sign in
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to Studio D?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand-coral transition-colors hover:text-brand-brown"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
