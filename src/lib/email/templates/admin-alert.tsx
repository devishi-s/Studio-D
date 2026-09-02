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
  brown: "#6B3A2A",
  brownLight: "#8B5E3C",
  muted: "#8A7A70",
  white: "#FFFFFF",
  border: "#E8D9CE",
  coral: "#D4856A",
};

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type AdminOrderAlertEmailProps = {
  order: OrderEmailData;
  customer: OrderEmailCustomer;
};

export function AdminOrderAlertEmail({
  order,
  customer,
}: AdminOrderAlertEmailProps) {
  const shortId = order.orderId.slice(0, 8).toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>
        New Studio D order {shortId} · {formatInr(order.total)} from{" "}
        {customer.fullName}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>New order received</Heading>
          <Text style={styles.paragraph}>
            A customer just completed checkout on Studio D.
          </Text>

          <Section style={styles.card}>
            <Text style={styles.label}>Order</Text>
            <Text style={styles.value}>{shortId}</Text>

            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>
              {customer.fullName}
              <br />
              {customer.email}
              <br />
              {order.shippingAddress.phone}
            </Text>

            <Text style={styles.label}>Total</Text>
            <Text style={styles.total}>{formatInr(order.total)}</Text>

            {order.needsManualReview ? (
              <Text style={styles.flag}>Needs manual review (stock)</Text>
            ) : null}

            <Hr style={styles.hr} />

            <Text style={styles.label}>Items</Text>
            {order.lines.map((line) => (
              <Text key={`${line.name}-${line.quantity}`} style={styles.item}>
                {line.name} × {line.quantity} — {formatInr(line.lineTotal)}
              </Text>
            ))}
          </Section>

          <Text style={styles.footer}>
            Studio D admin alert · do not reply to customers from this message
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
    padding: "28px 12px",
  },
  container: {
    maxWidth: "520px",
    margin: "0 auto",
  },
  heading: {
    color: colors.brown,
    fontSize: "20px",
    fontWeight: 600,
    margin: "0 0 8px",
  },
  paragraph: {
    color: colors.brownLight,
    fontSize: "14px",
    margin: "0 0 16px",
  },
  card: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "20px",
  },
  label: {
    color: colors.muted,
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    margin: "12px 0 4px",
  },
  value: {
    color: colors.brown,
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
  },
  total: {
    color: colors.brown,
    fontSize: "18px",
    fontWeight: 700,
    margin: 0,
  },
  flag: {
    color: colors.coral,
    fontSize: "13px",
    fontWeight: 600,
    margin: "12px 0 0",
  },
  hr: {
    borderColor: colors.border,
    margin: "16px 0",
  },
  item: {
    color: colors.brownLight,
    fontSize: "13px",
    margin: "0 0 6px",
  },
  footer: {
    color: colors.muted,
    fontSize: "11px",
    textAlign: "center" as const,
    marginTop: "16px",
  },
};
