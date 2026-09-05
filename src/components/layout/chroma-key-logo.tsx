"use client";

import { ChromaKeyVideo } from "@/components/ui/chroma-key-video";
import { cn } from "@/lib/utils";

type ChromaKeyLogoProps = {
  src: string;
  className?: string;
};

/** Hero logo video with cream/white background keyed out. */
export function ChromaKeyLogo({ src, className }: ChromaKeyLogoProps) {
  return <ChromaKeyVideo src={src} className={cn(className)} />;
}
