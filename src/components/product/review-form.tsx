"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { submitReviewAction } from "@/lib/actions/reviews";
import { AUTH_FIELD_CLASS } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "@/components/product/star-rating-input";

type ReviewFormProps = {
  productId: string;
  productSlug: string;
};

export function ReviewForm({ productId, productSlug }: ReviewFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitReviewAction({
        productId,
        productSlug,
        rating,
        title,
        body,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Review submitted! It will appear after moderation.");
      setTitle("");
      setBody("");
      setRating(5);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-brand-brown">
          Your rating
        </p>
        <StarRatingInput
          value={rating}
          onChange={setRating}
          disabled={pending}
        />
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-brown"
        >
          Title
        </label>
        <input
          id="review-title"
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={pending}
          placeholder="Sum up your experience"
          className={AUTH_FIELD_CLASS}
        />
      </div>

      <div>
        <label
          htmlFor="review-body"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-brown"
        >
          Review
        </label>
        <textarea
          id="review-body"
          required
          minLength={20}
          maxLength={2000}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={pending}
          placeholder="Tell others what you loved (at least 20 characters)"
          className={`${AUTH_FIELD_CLASS} min-h-[6rem] resize-y py-2.5`}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {body.trim().length}/20 characters minimum
        </p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="rounded-full"
      >
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
