import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Accessible label, e.g. "4.5 out of 5 stars" */
  label?: string;
};

const sizeClass = {
  sm: "h-3.5 w-3.5",
  md: "h-4.5 w-4.5",
  lg: "h-5 w-5",
} as const;

function starState(index: number, rating: number): "full" | "half" | "empty" {
  if (rating >= index) return "full";
  if (rating >= index - 0.5) return "half";
  return "empty";
}

/** Display-only stars with optional half-star support. */
export function StarRating({
  rating,
  max = 5,
  size = "md",
  className,
  label,
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(max, rating));
  const iconSize = sizeClass[size];

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `${clamped} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1;
        const state = starState(value, clamped);

        return (
          <span key={value} className="relative inline-flex">
            <Star
              className={cn(iconSize, "text-brand-blush")}
              fill="currentColor"
              strokeWidth={1.25}
              aria-hidden
            />
            {state !== "empty" ? (
              <span
                className={cn(
                  "absolute inset-0 overflow-hidden",
                  state === "half" && "w-1/2"
                )}
              >
                <Star
                  className={cn(iconSize, "text-brand-gold")}
                  fill="currentColor"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
