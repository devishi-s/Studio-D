import { Resend } from "resend";

import { SITE_NAME } from "@/lib/constants";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { AdminOrderAlertEmail } from "@/lib/email/templates/admin-alert";
import type {
  OrderEmailCustomer,
  OrderEmailData,
} from "@/lib/email/types";

const PLACEHOLDER_KEY = "your_resend_api_key";

function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key === PLACEHOLDER_KEY || key.includes("your_resend")) {
    return null;
  }
  return key;
}

function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${SITE_NAME} <onboarding@resend.dev>`
  );
}

function getAdminInbox(): string {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    process.env.RESEND_ADMIN_EMAIL?.trim() ||
    "hello@studiod.in"
  );
}

function createResendClient(): Resend | null {
  const apiKey = getResendApiKey();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export type SendEmailResult =
  | { sent: true; id?: string }
  | { sent: false; skipped: true; reason: string }
  | { sent: false; skipped: false; error: string };

/**
 * Sends the customer-facing order confirmation.
 * Safe to call without a real API key — returns skipped instead of throwing.
 */
export async function sendOrderConfirmation(
  order: OrderEmailData,
  customer: OrderEmailCustomer
): Promise<SendEmailResult> {
  const resend = createResendClient();
  if (!resend) {
    const reason =
      "RESEND_API_KEY is missing or still a placeholder. See docs/EMAIL.md.";
    console.info("[email] Skipping order confirmation:", reason);
    return { sent: false, skipped: true, reason };
  }

  if (!customer.email) {
    return {
      sent: false,
      skipped: false,
      error: "Customer email is missing.",
    };
  }

  try {
    const shortId = order.orderId.slice(0, 8).toUpperCase();
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: customer.email,
      subject: `Your Studio D order ${shortId} is confirmed`,
      react: OrderConfirmationEmail({ order, customer }),
    });

    if (error) {
      console.error("[email] Order confirmation failed:", error);
      return { sent: false, skipped: false, error: error.message };
    }

    return { sent: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[email] Order confirmation threw:", message);
    return { sent: false, skipped: false, error: message };
  }
}

/**
 * Sends a short new-order alert to the studio inbox.
 */
export async function sendAdminOrderAlert(
  order: OrderEmailData,
  customer: OrderEmailCustomer
): Promise<SendEmailResult> {
  const resend = createResendClient();
  if (!resend) {
    const reason =
      "RESEND_API_KEY is missing or still a placeholder. See docs/EMAIL.md.";
    console.info("[email] Skipping admin alert:", reason);
    return { sent: false, skipped: true, reason };
  }

  try {
    const shortId = order.orderId.slice(0, 8).toUpperCase();
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: getAdminInbox(),
      subject: `New order ${shortId} · ${customer.fullName}`,
      react: AdminOrderAlertEmail({ order, customer }),
    });

    if (error) {
      console.error("[email] Admin alert failed:", error);
      return { sent: false, skipped: false, error: error.message };
    }

    return { sent: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[email] Admin alert threw:", message);
    return { sent: false, skipped: false, error: message };
  }
}

/**
 * Fire-and-forget both post-checkout emails.
 * Never throws — order flow must not depend on email delivery.
 */
export async function sendOrderEmailsSafe(
  order: OrderEmailData,
  customer: OrderEmailCustomer
): Promise<void> {
  const [confirmation, alert] = await Promise.all([
    sendOrderConfirmation(order, customer),
    sendAdminOrderAlert(order, customer),
  ]);

  if (!confirmation.sent && !("skipped" in confirmation && confirmation.skipped)) {
    console.error("[email] Customer confirmation not sent", confirmation);
  }
  if (!alert.sent && !("skipped" in alert && alert.skipped)) {
    console.error("[email] Admin alert not sent", alert);
  }
}
