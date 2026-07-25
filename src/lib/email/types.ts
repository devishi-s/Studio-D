import type { CheckoutAddress } from "@/types";

export type OrderEmailLine = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderEmailData = {
  orderId: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  lines: OrderEmailLine[];
  shippingAddress: CheckoutAddress;
  needsManualReview?: boolean;
};

export type OrderEmailCustomer = {
  fullName: string;
  email: string;
};
