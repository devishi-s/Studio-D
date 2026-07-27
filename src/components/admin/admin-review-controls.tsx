"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  adminApproveReviewAction,
  adminDeleteReviewAction,
  adminUnapproveReviewAction,
} from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";

type AdminReviewControlsProps = {
  reviewId: string;
  productSlug: string | null;
  isApproved: boolean;
};

export function AdminReviewControls({
  reviewId,
  productSlug,
  isApproved,
}: AdminReviewControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    successMessage: string
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(successMessage);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!isApproved ? (
        <Button
          type="button"
          size="sm"
          className="rounded-full"
          disabled={pending}
          onClick={() =>
            run(
              () => adminApproveReviewAction(reviewId, productSlug),
              "Review approved."
            )
          }
        >
          Approve
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={pending}
          onClick={() =>
            run(
              () => adminUnapproveReviewAction(reviewId, productSlug),
              "Review unapproved."
            )
          }
        >
          Unapprove
        </Button>
      )}
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("Delete this review permanently?")) return;
          run(
            () => adminDeleteReviewAction(reviewId, productSlug),
            "Review deleted."
          );
        }}
      >
        {isApproved ? "Delete" : "Reject"}
      </Button>
    </div>
  );
}
