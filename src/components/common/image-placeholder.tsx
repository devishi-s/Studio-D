import Image from "next/image";
import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  label?: string;
  className?: string;
  /** Kept for call-site compatibility; cover image is used for all variants. */
  variant?: "cream" | "blush" | "sage" | "coral";
};

const TEMP_COVER = "/images/categories/temporary-cover.jpg";

/** Empty / missing image fallback — uses the shared temporary cover photo. */
export function ImagePlaceholder({
  label,
  className,
}: ImagePlaceholderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Image
        src={TEMP_COVER}
        alt={label ?? "Studio D handmade collection"}
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
        className="object-cover"
      />
    </div>
  );
}
