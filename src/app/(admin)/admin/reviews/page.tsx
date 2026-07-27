import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAdminReviews } from "@/lib/supabase/reviews";
import { formatDate } from "@/lib/format";
import { StarRating } from "@/components/product/star-rating";
import { AdminReviewControls } from "@/components/admin/admin-review-controls";

export const metadata: Metadata = {
  title: "Admin reviews",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await getAdminReviews();
  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-xl font-semibold text-brand-brown">
          Reviews
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {pending.length} pending · {approved.length} approved
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-brand-brown">
          Pending moderation
        </h3>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-border/60 bg-white p-6 text-sm text-muted-foreground">
            No reviews waiting for approval.
          </p>
        ) : (
          <ul className="space-y-4">
            {pending.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl border border-border/60 bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="font-heading text-base font-semibold text-brand-brown">
                        {review.title}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Link
                        href={
                          review.productSlug
                            ? `/products/${review.productSlug}`
                            : "/admin/products"
                        }
                        className="font-medium text-brand-brown hover:text-brand-coral"
                      >
                        {review.productName}
                      </Link>
                      {" · "}
                      {review.reviewerName}
                      {" · "}
                      {formatDate(review.createdAt)}
                    </p>
                    <p className="text-sm leading-relaxed text-brand-brown-light">
                      {review.body}
                    </p>
                  </div>
                  <AdminReviewControls
                    reviewId={review.id}
                    productSlug={review.productSlug}
                    isApproved={false}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-brand-brown">
          Approved reviews
        </h3>
        {approved.length === 0 ? (
          <p className="rounded-2xl border border-border/60 bg-white p-6 text-sm text-muted-foreground">
            No approved reviews yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {approved.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl border border-border/60 bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="font-heading text-base font-semibold text-brand-brown">
                        {review.title}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Link
                        href={
                          review.productSlug
                            ? `/products/${review.productSlug}`
                            : "/admin/products"
                        }
                        className="font-medium text-brand-brown hover:text-brand-coral"
                      >
                        {review.productName}
                      </Link>
                      {" · "}
                      {review.reviewerName}
                      {" · "}
                      {formatDate(review.createdAt)}
                    </p>
                    <p className="text-sm leading-relaxed text-brand-brown-light">
                      {review.body}
                    </p>
                  </div>
                  <AdminReviewControls
                    reviewId={review.id}
                    productSlug={review.productSlug}
                    isApproved
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
