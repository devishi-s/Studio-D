export const AUTH_FIELD_CLASS =
  "mt-2 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-coral focus:ring-3 focus:ring-brand-coral/15 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/10";

export function getAuthErrorMessage(error: {
  message?: string;
  code?: string;
}): string {
  const message = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    code === "invalid_credentials"
  ) {
    return "Incorrect email or password.";
  }

  if (
    message.includes("email not confirmed") ||
    code === "email_not_confirmed"
  ) {
    return "Please verify your email before signing in. Check your inbox for the link.";
  }

  if (message.includes("user already registered") || code === "user_already_exists") {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (message.includes("password") && message.includes("least")) {
    return "Password must be at least 6 characters.";
  }

  if (message.includes("rate limit") || code.includes("rate_limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Check your connection and try again.";
  }

  return error.message?.trim() || "Something went wrong. Please try again.";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Only allow same-origin relative paths (blocks open redirects). */
export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/account"
): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
