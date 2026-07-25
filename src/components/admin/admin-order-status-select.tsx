"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { OrderStatus } from "@/types";
import { adminUpdateOrderStatusAction } from "@/lib/actions/admin";
import { ADMIN_FIELD_CLASS } from "@/lib/admin-product-form";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

type AdminOrderStatusSelectProps = {
  orderId: string;
  status: OrderStatus;
};

export function AdminOrderStatusSelect({
  orderId,
  status,
}: AdminOrderStatusSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      className={`${ADMIN_FIELD_CLASS} mt-0 w-auto min-w-[9rem] py-1.5 capitalize`}
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        startTransition(async () => {
          const result = await adminUpdateOrderStatusAction(orderId, next);
          if (!result.ok) {
            toast.error(result.error);
            e.target.value = status;
            return;
          }
          toast.success(`Status updated to ${next}.`);
          router.refresh();
        });
      }}
    >
      {STATUSES.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
