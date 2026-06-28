import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  label?: string;
  className?: string;
  variant?: "cream" | "blush" | "sage" | "coral";
};

const bgMap = {
  cream: "bg-brand-cream",
  blush: "bg-brand-blush",
  sage: "bg-brand-sage/10",
  coral: "bg-brand-coral/10",
} as const;

export function ImagePlaceholder({
  label,
  className,
  variant = "blush",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg",
        bgMap[variant],
        className
      )}
    >
      <ImageOff className="h-6 w-6 text-brand-brown-light/40" />
      {label && (
        <span className="text-xs text-brand-brown-light/50">{label}</span>
      )}
    </div>
  );
}
