import Link from "next/link";

import type { ProductReview, ReviewRatingSummary } from "@/types";
import { formatDate } from "@/lib/format";
import { SectionHeader } from "@/components/common/section-header";
import { StarRating } from "@/components/product/star-rating";
import { ReviewForm } from "@/components/product/review-form";

type ProductReviewsSectionProps = {
  productId: string;
  productSlug: string;
  summary: ReviewRatingSummary;
  reviews: ProductReview[];
  isAuthenticated: boolean;
  existingReview: ProductReview | null;
};

export function ProductReviewsSection({
  productId,
  productSlug,
  summary,
  reviews,
  isAuthenticated,
  existingReview,
}: ProductReviewsSectionProps) {
  return (
    <div className="mt-16 border-t border-border/50 pt-12 sm:mt-20 sm:pt-16">
      <SectionHeader
        title="Customer Reviews"
        subtitle="Honest notes from people who’ve taken Studio D pieces home."
      />

      <div className="mt-8 flex flex-col gap-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-14">
        <div className="rounded-xl bg-brand-blush/40 px-5 py-6 text-center lg:text-left">
          {summary.count > 0 ? (
            <>
              <p className="font-heading text-4xl font-semibold text-brand-brown">
                {summary.average.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center lg:justify-start">
                <StarRating
                  rating={summary.average}
                  size="lg"
                  label={`${summary.average} out of 5 stars`}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on {summary.count}{" "}
                {summary.count === 1 ? "review" : "reviews"}
              </p>
            </>
          ) : (
            <>
              <p className="font-heading text-lg font-semibold text-brand-brown">
                No reviews yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to share how this piece feels in your home.
              </p>
            </>
          )}
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="font-heading text-lg font-semibold text-brand-brown">
              Write a review
            </h3>
            <div className="mt-4">
              {!isAuthenticated ? (
                <p className="rounded-xl border border-border/60 bg-card px-4 py-5 text-sm text-muted-foreground">
                  <Link
                    href={`/login?redirectTo=/products/${productSlug}`}
                    className="font-medium text-brand-coral transition-colors hover:text-brand-brown"
                  >
                    Login to leave a review
                  </Link>
                  {" — "}
                  we moderate every note before it goes live.
                </p>
              ) : existingReview ? (
                <div className="rounded-xl border border-border/60 bg-card px-4 py-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-coral">
                    {existingReview.isApproved
                      ? "Your review"
                      : "Your review · pending moderation"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={existingReview.rating} size="sm" />
                    <span className="font-heading text-sm font-semibold text-brand-brown">
                      {existingReview.title}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {existingReview.body}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(existingReview.createdAt)}
                  </p>
                </div>
              ) : (
                <ReviewForm productId={productId} productSlug={productSlug} />
              )}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-brand-brown">
              All reviews
            </h3>
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No published reviews yet. Check back after someone shares their
                story.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border/40">
                {reviews.map((review) => (
                  <li key={review.id} className="py-5 first:pt-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="font-heading text-base font-semibold text-brand-brown">
                        {review.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {review.reviewerName} · {formatDate(review.createdAt)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {review.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
