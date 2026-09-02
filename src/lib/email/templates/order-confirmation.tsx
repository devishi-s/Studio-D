import type { CSSProperties } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import type { OrderEmailCustomer, OrderEmailData } from "@/lib/email/types";

const colors = {
  cream: "#FDF5F0",
  blush: "#F5E6DB",
  brown: "#6B3A2A",
  brownLight: "#8B5E3C",
  coral: "#D4856A",
  sage: "#7B9E87",
  muted: "#8A7A70",
  white: "#FFFFFF",
  border: "#E8D9CE",
};

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type OrderConfirmationEmailProps = {
  order: OrderEmailData;
  customer: OrderEmailCustomer;
};

export function OrderConfirmationEmail({
  order,
  customer,
}: OrderConfirmationEmailProps) {
  const shortId = order.orderId.slice(0, 8).toUpperCase();
  const address = order.shippingAddress;

  return (
    <Html>
      <Head />
      <Preview>
        Thank you, {customer.fullName.split(" ")[0] || "friend"} — your Studio D
        order {shortId} is confirmed.
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>Studio D</Text>
            <Text style={styles.tagline}>Handmade · Thoughtful · Timeless</Text>
          </Section>

          <Section style={styles.card}>
            <Heading style={styles.heading}>Thank you for your order</Heading>
            <Text style={styles.paragraph}>
              Hi {customer.fullName},
            </Text>
            <Text style={styles.paragraph}>
              We&apos;ve received your order and will begin preparing your
              handmade pieces with care. Here&apos;s a quiet little summary of
              what&apos;s on its way.
            </Text>

            <Text style={styles.meta}>
              Order <strong style={{ color: colors.brown }}>{shortId}</strong>
            </Text>

            <Hr style={styles.hr} />

            {order.lines.map((line) => (
              <Section key={`${line.name}-${line.quantity}`} style={styles.lineRow}>
                <Text style={styles.lineName}>
                  {line.name}
                  <br />
                  <span style={styles.lineMeta}>
                    Qty {line.quantity} · {formatInr(line.unitPrice)} each
                  </span>
                </Text>
                <Text style={styles.lineTotal}>{formatInr(line.lineTotal)}</Text>
              </Section>
            ))}

            <Hr style={styles.hr} />

            <Section style={styles.totals}>
              <Text style={styles.totalRow}>
                <span>Subtotal</span>
                <span>{formatInr(order.subtotal)}</span>
              </Text>
              <Text style={styles.totalRow}>
                <span>Delivery</span>
                <span>
                  {order.deliveryFee === 0
                    ? "Free"
                    : formatInr(order.deliveryFee)}
                </span>
              </Text>
              <Text style={styles.grandTotal}>
                <span>Total paid</span>
                <span>{formatInr(order.total)}</span>
              </Text>
            </Section>

            <Hr style={styles.hr} />

            <Heading as="h2" style={styles.subheading}>
              Shipping to
            </Heading>
            <Text style={styles.address}>
              {address.fullName}
              <br />
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.phone}
            </Text>

            <Section style={styles.noteBox}>
              <Text style={styles.noteText}>
                <strong>Estimated delivery:</strong> handmade pieces typically
                leave our studio within 3–5 business days. We&apos;ll share
                tracking once your parcel is on its way.
              </Text>
            </Section>

            <Text style={styles.paragraph}>
              With care,
              <br />
              The Studio D team
            </Text>
          </Section>

          <Text style={styles.footer}>
            Questions? Reply to this email or write to hello@studiod.in
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: colors.cream,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  brand: {
    color: colors.brown,
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    margin: "0 0 4px",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  tagline: {
    color: colors.muted,
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    margin: 0,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    padding: "28px 24px",
  },
  heading: {
    color: colors.brown,
    fontSize: "22px",
    fontWeight: 600,
    margin: "0 0 16px",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  subheading: {
    color: colors.brown,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 8px",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  paragraph: {
    color: colors.brownLight,
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 12px",
  },
  meta: {
    color: colors.muted,
    fontSize: "13px",
    margin: "16px 0 0",
  },
  hr: {
    borderColor: colors.border,
    borderTop: `1px solid ${colors.border}`,
    margin: "18px 0",
  },
  lineRow: {
    marginBottom: "10px",
  },
  lineName: {
    color: colors.brown,
    fontSize: "14px",
    fontWeight: 500,
    margin: "0 0 2px",
  },
  lineMeta: {
    color: colors.muted,
    fontSize: "12px",
    fontWeight: 400,
  },
  lineTotal: {
    color: colors.brown,
    fontSize: "14px",
    fontWeight: 600,
    margin: "4px 0 0",
  },
  totals: {
    margin: 0,
  },
  totalRow: {
    color: colors.muted,
    fontSize: "13px",
    margin: "0 0 6px",
    display: "flex",
    justifyContent: "space-between",
  },
  grandTotal: {
    color: colors.brown,
    fontSize: "16px",
    fontWeight: 700,
    margin: "10px 0 0",
    display: "flex",
    justifyContent: "space-between",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  address: {
    color: colors.brownLight,
    fontSize: "14px",
    lineHeight: "1.55",
    margin: "0 0 16px",
  },
  noteBox: {
    backgroundColor: colors.blush,
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "16px",
  },
  noteText: {
    color: colors.brown,
    fontSize: "13px",
    lineHeight: "1.55",
    margin: 0,
  },
  footer: {
    color: colors.muted,
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "20px",
  },
};
