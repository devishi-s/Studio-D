"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type ChromaKeyVideoProps = {
  src: string;
  className?: string;
  canvasClassName?: string;
};

/**
 * Plays a video and punches out near-white / cream pixels to alpha each frame.
 */
export function ChromaKeyVideo({
  src,
  className,
  canvasClassName,
}: ChromaKeyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let frameId = 0;
    let running = true;

    const draw = () => {
      if (!running) return;

      if (video.readyState >= 2 && video.videoWidth > 0) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max - min;
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;

          if (luma > 218 && sat < 42) {
            data[i + 3] = 0;
          } else if (luma > 200 && sat < 50) {
            data[i + 3] = Math.round(
              data[i + 3] * Math.min(1, (240 - luma) / 28)
            );
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      frameId = requestAnimationFrame(draw);
    };

    const start = () => {
      void video.play().catch(() => {});
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(draw);
    };

    video.addEventListener("loadeddata", start);
    video.addEventListener("play", start);

    if (video.readyState >= 2) start();

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("play", start);
    };
  }, [src]);

  return (
    <div className={cn("relative", className)}>
      <video
        ref={videoRef}
        className="pointer-events-none absolute h-px w-px opacity-0"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className={cn("block h-auto w-full", canvasClassName)}
        aria-hidden="true"
      />
    </div>
  );
}
