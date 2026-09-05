"use client";

import { ChromaKeyVideo } from "@/components/ui/chroma-key-video";

/**
 * Fixed left-edge botanical vine (desktop/tablet).
 * Canvas chroma-key removes the solid white/cream background.
 * pointer-events-none so clicks pass through to page content.
 */
export function VineDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-[-80px] top-16 z-[60] hidden h-[calc(95vh-4rem)] w-[340px] origin-top-left scale-[1.21] overflow-visible lg:block xl:w-[380px] xl:scale-[1.31]"
    >
      <ChromaKeyVideo
        src="/animations/canva_vines.webm"
        className="h-full w-full"
        canvasClassName="h-full w-full object-contain object-left-top"
      />
    </div>
  );
}
