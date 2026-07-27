"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import {
  approveReview,
  deleteReview,
  submitReview,
  unapproveReview,
} from "@/lib/supabase/reviews";

export type ReviewActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitReviewAction(input: {
  productId: string;
  productSlug: string;
  rating: number;
  title: string;
  body: string;
}): Promise<ReviewActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in to leave a review." };
  }

  try {
    await submitReview({
      userId: user.id,
      productId: input.productId,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
    revalidatePath(`/products/${input.productSlug}`);
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not submit review.",
    };
  }
}

export async function adminApproveReviewAction(
  reviewId: string,
  productSlug?: string | null
): Promise<ReviewActionResult> {
  await requireAdmin();
  try {
    await approveReview(reviewId);
    revalidatePath("/admin/reviews");
    if (productSlug) revalidatePath(`/products/${productSlug}`);
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not approve review.",
    };
  }
}

export async function adminUnapproveReviewAction(
  reviewId: string,
  productSlug?: string | null
): Promise<ReviewActionResult> {
  await requireAdmin();
  try {
    await unapproveReview(reviewId);
    revalidatePath("/admin/reviews");
    if (productSlug) revalidatePath(`/products/${productSlug}`);
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not unapprove review.",
    };
  }
}

export async function adminDeleteReviewAction(
  reviewId: string,
  productSlug?: string | null
): Promise<ReviewActionResult> {
  await requireAdmin();
  try {
    await deleteReview(reviewId);
    revalidatePath("/admin/reviews");
    if (productSlug) revalidatePath(`/products/${productSlug}`);
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not delete review.",
    };
  }
}
