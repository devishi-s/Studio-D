"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
};

/** Clickable 1–5 star selector for the review form. */
export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  className,
}: StarRatingInputProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Rating"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={disabled}
            onClick={() => onChange(star)}
            className={cn(
              "rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <Star
              className={cn(
                "h-7 w-7",
                filled ? "text-brand-gold" : "text-brand-blush"
              )}
              fill="currentColor"
              strokeWidth={1.25}
            />
          </button>
        );
      })}
    </div>
  );
}
