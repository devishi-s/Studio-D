import { z } from "zod";

import {
  FLAT_DELIVERY_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";
import type { CheckoutAddress } from "@/types";

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number."),
  addressLine1: z
    .string()
    .trim()
    .min(5, "Please enter your street address."),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Please enter your city."),
  state: z.string().trim().min(2, "Please enter your state."),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function toCheckoutAddress(
  values: CheckoutFormValues
): CheckoutAddress {
  const addressLine2 = values.addressLine2?.trim();
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    addressLine1: values.addressLine1.trim(),
    ...(addressLine2 ? { addressLine2 } : {}),
    city: values.city.trim(),
    state: values.state.trim(),
    pincode: values.pincode.trim(),
  };
}

/**
 * Flat delivery fee below the free-shipping threshold.
 * Product prices are treated as tax-inclusive; no separate tax line in 4.1.
 */
export function getDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_DELIVERY_FEE;
}

export function getCheckoutTotal(subtotal: number): {
  deliveryFee: number;
  total: number;
} {
  const deliveryFee = getDeliveryFee(subtotal);
  return { deliveryFee, total: subtotal + deliveryFee };
}
