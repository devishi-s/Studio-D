"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { ScrollExpand } from "@/components/ui/scroll-expand";

type FeaturedSpillProps = {
  products: Product[];
};

type SpillSpot = {
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
};

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function columnsFor(count: number, areaWidth: number) {
  if (count <= 2) return Math.max(count, 1);
  if (count <= 4) return 2;
  if (count >= 7 && areaWidth >= 1100) return 4;
  return 3;
}

function layoutGrid(
  products: Product[],
  areaWidth: number,
  areaHeight: number
): SpillSpot[] {
  if (areaWidth < 80 || areaHeight < 80) return [];

  const padTop = 104;
  const padBottom = 100;
  const padLeft = areaWidth >= 1024 ? 120 : 40;
  const padRight = 48;
  const caption = 58;
  const count = products.length;
  const cols = columnsFor(count, areaWidth);
  const rows = Math.max(1, Math.ceil(count / cols));

  const availW = Math.max(120, areaWidth - padLeft - padRight);
  const availH = Math.max(120, areaHeight - padTop - padBottom);
  const cellW = availW / cols;
  const cellH = availH / rows;
  const cardW = Math.max(
    140,
    Math.min(cellW * 0.78, cellH * 0.62, 236)
  );
  const cardH = cardW + caption;
  const freeX = Math.max(0, cellW - cardW);
  const freeY = Math.max(0, cellH - cardH);

  const rng = mulberry32(hashString(products.map((product) => product.id).join("|")));
  const cells = products.map((_, index) => index);
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return products.map((product, productIndex) => {
    const index = cells[productIndex];
    const row = Math.floor(index / cols);
    const col = index % cols;
    const colsInRow = row === rows - 1 ? count - row * cols : cols;
    const rowShift = ((cols - colsInRow) * cellW) / 2;
    const itemRng = mulberry32(hashString(product.id) ^ (index * 131));
    const jitterX = freeX * 0.72 * itemRng();
    const jitterY = freeY * 0.72 * itemRng();

    return {
      x: padLeft + rowShift + col * cellW + (freeX - freeX * 0.72) / 2 + jitterX,
      y: padTop + row * cellH + (freeY - freeY * 0.72) / 2 + jitterY,
      rotate: (itemRng() - 0.5) * 14,
      width: cardW,
      height: cardH,
    };
  });
}

export function FeaturedSpill({ products }: FeaturedSpillProps) {
  const [progress, setProgress] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = areaRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      setArea({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const spots = useMemo(
    () => layoutGrid(products, area.width, area.height),
    [products, area.height, area.width]
  );

  return (
    <ScrollExpand
      src="/images/home-hero.jpg"
      alt=""
      title="Handpicked for You"
      scrollHint="Scroll"
      useWindowScroll
      startWidth={40}
      startHeight={54}
      startRadius={22}
      overlayScrim={0.16}
      scrollDistance={1.45}
      holdDistance={0.45}
      className="h-auto"
      onProgress={setProgress}
    >
      <div ref={areaRef} className="relative h-full w-full overflow-hidden">
        {products.map((product, index) => {
          const spot = spots[index];
          if (!spot) return null;

          const start = 0.14 + (index / Math.max(products.length, 1)) * 0.32;
          const amount = smoothstep(start, start + 0.38, progress);
          const originX = area.width / 2 - spot.width / 2;
          const originY = area.height / 2 - spot.height / 2;
          const x = originX + (spot.x - originX) * amount;
          const y = originY + (spot.y - originY) * amount;
          const rotate = spot.rotate * amount;
          const scale = 0.28 + 0.72 * amount;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="absolute block rounded-xl border border-brand-blush/80 bg-brand-cream p-2 shadow-[0_10px_28px_rgba(107,58,42,0.16)] transition-shadow hover:shadow-[0_14px_32px_rgba(107,58,42,0.22)]"
              style={{
                left: x,
                top: y,
                width: spot.width,
                opacity: amount,
                transform: `rotate(${rotate}deg) scale(${scale})`,
                transformOrigin: "center center",
                zIndex: 10 + index,
              }}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="280px"
                />
              </div>
              <p className="mt-2 line-clamp-1 px-1 font-heading text-xs font-semibold text-brand-brown sm:text-sm">
                {product.name}
              </p>
              <p className="px-1 pb-1 text-[11px] text-brand-coral sm:text-xs">
                {formatPrice(product.price)}
              </p>
            </Link>
          );
        })}

        <Link
          href="/products"
          className="absolute bottom-8 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-cream/90 px-5 py-2 font-ui text-sm font-medium text-brand-coral shadow-sm backdrop-blur-sm transition-colors hover:bg-brand-cream hover:text-brand-brown"
          style={{ opacity: smoothstep(0.7, 0.92, progress) }}
        >
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </ScrollExpand>
  );
}
