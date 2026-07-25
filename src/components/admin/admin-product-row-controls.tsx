"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  adminToggleFeaturedAction,
  adminUpdateStockAction,
} from "@/lib/actions/admin";
import { ADMIN_FIELD_CLASS } from "@/lib/admin-product-form";

type FeaturedToggleProps = {
  productId: string;
  featured: boolean;
};

export function AdminFeaturedToggle({
  productId,
  featured,
}: FeaturedToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={featured}
      disabled={pending}
      aria-label="Toggle featured"
      className="size-4 rounded border-border"
      onChange={(e) => {
        const next = e.target.checked;
        startTransition(async () => {
          const result = await adminToggleFeaturedAction(productId, next);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success(next ? "Marked featured." : "Removed from featured.");
          router.refresh();
        });
      }}
    />
  );
}

type StockEditorProps = {
  productId: string;
  stockCount: number;
};

export function AdminStockEditor({ productId, stockCount }: StockEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="number"
      min={0}
      step={1}
      defaultValue={stockCount}
      disabled={pending}
      aria-label="Update stock"
      className={`${ADMIN_FIELD_CLASS} mt-0 w-20 py-1.5 text-center`}
      onBlur={(e) => {
        const value = Number(e.target.value);
        if (!Number.isInteger(value) || value < 0 || value === stockCount) {
          e.target.value = String(stockCount);
          return;
        }
        startTransition(async () => {
          const result = await adminUpdateStockAction(productId, value);
          if (!result.ok) {
            toast.error(result.error);
            e.target.value = String(stockCount);
            return;
          }
          toast.success("Stock updated.");
          router.refresh();
        });
      }}
    />
  );
}
