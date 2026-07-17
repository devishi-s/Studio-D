"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const CONTACT_EMAIL = "hello@studiod.in";

const REASONS = [
  "Product question",
  "Custom order",
  "Gift recommendation",
  "Order support",
  "Something else",
] as const;

type FieldName = "name" | "email" | "reason" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

function getFieldErrors(formData: FormData): FieldErrors {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const errors: FieldErrors = {};

  if (name.length < 2) {
    errors.name = "Please enter at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!REASONS.includes(reason as (typeof REASONS)[number])) {
    errors.reason = "Please choose a reason for contacting us.";
  }

  if (message.length < 10) {
    errors.message = "Please share at least 10 characters so we can help.";
  }

  return errors;
}

const fieldClassName =
  "mt-2 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-coral focus:ring-3 focus:ring-brand-coral/15 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/10";

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [statusMessage, setStatusMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = getFieldErrors(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage("Please correct the highlighted fields.");
      toast.error("Please check the contact form");

      const firstInvalidField = Object.keys(nextErrors)[0] as FieldName;
      form.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus();
      return;
    }

    setErrors({});

    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const reason = String(formData.get("reason")).trim();
    const message = String(formData.get("message")).trim();
    const subject = encodeURIComponent(`${reason} — ${name}`);
    const body = encodeURIComponent(
      `Hello Studio D,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`
    );

    setStatusMessage(
      "Your email app should open with a draft. Please review it and press send there."
    );
    toast.success("Email draft ready", {
      description: "Review and send it from your email app.",
    });
    window.location.assign(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-brand-brown">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClassName}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.name}
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
            className={fieldClassName}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="text-sm font-medium text-brand-brown">
          What can we help with?
        </label>
        <select
          id="reason"
          name="reason"
          defaultValue=""
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? "reason-error" : undefined}
          className={fieldClassName}
        >
          <option value="" disabled>
            Choose a reason
          </option>
          {REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {errors.reason && (
          <p id="reason-error" role="alert" className="mt-1.5 text-xs text-destructive">
            {errors.reason}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-brand-brown">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell us what you have in mind..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          className={`${fieldClassName} resize-y`}
        />
        {errors.message ? (
          <p id="message-error" role="alert" className="mt-1.5 text-xs text-destructive">
            {errors.message}
          </p>
        ) : (
          <p id="message-hint" className="mt-1.5 text-xs text-muted-foreground">
            Please avoid sharing payment or other sensitive information.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" className="rounded-full px-6">
          <Send data-icon="inline-start" />
          Create email draft
        </Button>
        <p aria-live="polite" className="text-xs leading-relaxed text-muted-foreground">
          {statusMessage ||
            "This form opens your email app; it does not send anything automatically."}
        </p>
      </div>
    </form>
  );
}
