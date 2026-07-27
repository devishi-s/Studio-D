import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ProductReview, ReviewRatingSummary } from "@/types";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. See docs/SUPABASE.md."
    );
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function assertNoError(error: { message: string } | null, context: string) {
  if (error) {
    throw new Error(`Supabase ${context}: ${error.message}`);
  }
}

type ReviewJoinRow = ReviewRow & {
  profiles:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null;
  products?:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null;
};

function profileName(
  profiles:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null
    | undefined
): string {
  const row = Array.isArray(profiles) ? profiles[0] : profiles;
  const name = row?.full_name?.trim();
  return name && name.length > 0 ? name : "Studio D customer";
}

function productMeta(
  products:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null
    | undefined
) {
  const row = Array.isArray(products) ? products[0] : products;
  return {
    productName: row?.name ?? "Unknown product",
    productSlug: row?.slug ?? null,
  };
}

function mapReview(row: ReviewJoinRow): ProductReview {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    isApproved: row.is_approved,
    createdAt: row.created_at,
    reviewerName: profileName(row.profiles),
  };
}

/** Approved reviews for a product, newest first (public). */
export async function getApprovedReviews(
  productId: string
): Promise<ProductReview[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  assertNoError(error, "getApprovedReviews");
  return ((data ?? []) as ReviewJoinRow[]).map(mapReview);
}

/** Average + count from approved reviews only. */
export async function getAverageRating(
  productId: string
): Promise<ReviewRatingSummary> {
  const reviews = await getApprovedReviews(productId);
  if (reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

/** Current user's review for a product (approved or pending). */
export async function getUserReview(
  userId: string,
  productId: string
): Promise<ProductReview | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  assertNoError(error, "getUserReview");
  return data ? mapReview(data as ReviewJoinRow) : null;
}

export type SubmitReviewInput = {
  userId: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
};

/** Insert a pending review for the authenticated user. */
export async function submitReview(
  input: SubmitReviewInput
): Promise<ProductReview> {
  const rating = Math.round(input.rating);
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const title = input.title.trim();
  const body = input.body.trim();
  if (!title) throw new Error("Title is required.");
  if (body.length < 20) {
    throw new Error("Review must be at least 20 characters.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: input.productId,
      user_id: input.userId,
      rating,
      title,
      body,
      is_approved: false,
    })
    .select("*, profiles(full_name)")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You have already reviewed this product.");
    }
    throw new Error(`Supabase submitReview: ${error.message}`);
  }

  return mapReview(data as ReviewJoinRow);
}

export type AdminReviewListItem = ProductReview & {
  productName: string;
  productSlug: string | null;
};

/** All reviews for admin moderation, newest first. */
export async function getAdminReviews(): Promise<AdminReviewListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name), products(id, name, slug)")
    .order("created_at", { ascending: false });

  assertNoError(error, "getAdminReviews");

  return ((data ?? []) as ReviewJoinRow[]).map((row) => {
    const review = mapReview(row);
    const meta = productMeta(row.products);
    return {
      ...review,
      productName: meta.productName,
      productSlug: meta.productSlug,
    };
  });
}

/** Admin: set is_approved = true. */
export async function approveReview(reviewId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", reviewId);

  assertNoError(error, "approveReview");
}

/** Admin: set is_approved = false. */
export async function unapproveReview(reviewId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: false })
    .eq("id", reviewId);

  assertNoError(error, "unapproveReview");
}

/** Admin: delete (reject) a review. */
export async function deleteReview(reviewId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  assertNoError(error, "deleteReview");
}
