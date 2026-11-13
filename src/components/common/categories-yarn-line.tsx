"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/product/product-image";

export type YarnCategoryItem = {
  id: string;
  name: string;
  href: string;
  coverSrc: string;
  coverAlt: string;
  productCount: number;
  childNames: string;
  displayOrder: number;
};

type CategoriesYarnLineProps = {
  items: YarnCategoryItem[];
};

const variantByIndex = ["cream", "sage", "coral", "blush"] as const;

/** Desktop hang points (viewBox 1000×420). */
const HANG = [
  { x: 290, y: 86, cord: 30, seed: -1.0 },
  { x: 480, y: 104, cord: 38, seed: 0.9 },
  { x: 680, y: 58, cord: 32, seed: -0.65 },
  { x: 880, y: 92, cord: 36, seed: 1.15 },
] as const;

/**
 * Desktop yarn: starts at ball right edge (translate(-52,18), local exit
 * ~158,96 → abs 106,114).
 */
const YARN_PATH =
  "M 106 114 C 155 100, 220 88, 290 86 C 360 78, 410 122, 480 104 C 560 82, 610 36, 680 58 C 760 82, 820 112, 880 92 C 925 78, 955 72, 990 82";

/** Centered vertical wavy yarn for mobile (viewBox 120×100). */
const MOBILE_YARN_PATH =
  "M 60 0 C 48 12, 72 24, 60 36 C 46 52, 74 68, 60 84 C 50 94, 66 100, 60 100";

function CategoryCard({
  item,
  sizes,
}: {
  item: YarnCategoryItem;
  sizes: string;
}) {
  const variant = variantByIndex[item.displayOrder - 1] ?? "blush";

  return (
    <Link
      href={item.href}
      className="group block overflow-hidden rounded-2xl border border-dashed border-[#E5D8CC] bg-white shadow-[0_12px_28px_-16px_rgba(107,58,42,0.5)] transition-shadow hover:shadow-[0_16px_34px_-14px_rgba(107,58,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-blush/30">
        <ProductImage
          src={item.coverSrc}
          alt={item.coverAlt}
          fill
          sizes={sizes}
          placeholderVariant={variant}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute right-1.5 top-1.5 rounded-full bg-brand-brown/85 px-1.5 py-0.5 text-[9px] font-medium text-brand-cream">
          {item.productCount}{" "}
          {item.productCount === 1 ? "product" : "products"}
        </span>
      </div>
      <div className="px-2.5 py-2">
        <h3 className="font-heading text-sm font-semibold leading-snug text-brand-brown">
          {item.name}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-brand-coral group-hover:text-brand-brown">
          Browse collection
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function YarnBallDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-yarn`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E08A9A" />
        <stop offset="40%" stopColor="#D4857A" />
        <stop offset="100%" stopColor="#C47868" />
      </linearGradient>
      <radialGradient id={`${prefix}-ball`} cx="34%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#FADCE6" />
        <stop offset="30%" stopColor="#F0B0C0" />
        <stop offset="62%" stopColor="#E08A9A" />
        <stop offset="100%" stopColor="#B85A6A" />
      </radialGradient>
      <radialGradient id={`${prefix}-glow`} cx="30%" cy="26%" r="42%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <filter id={`${prefix}-fiber`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.95"
          numOctaves="3"
          seed="4"
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale="3.8"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id={`${prefix}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow
          dx="2"
          dy="5"
          stdDeviation="4"
          floodColor="#6B3A2A"
          floodOpacity="0.25"
        />
      </filter>
    </defs>
  );
}

function SoftWoolBall({
  prefix,
  transform,
}: {
  prefix: string;
  transform: string;
}) {
  return (
    <g filter={`url(#${prefix}-shadow)`} transform={transform}>
      <g filter={`url(#${prefix}-fiber)`}>
        <circle cx="95" cy="95" r="78" fill={`url(#${prefix}-ball)`} />
        <ellipse cx="72" cy="82" rx="46" ry="40" fill="#E8A0B0" opacity="0.32" />
        <ellipse cx="112" cy="112" rx="42" ry="38" fill="#C46878" opacity="0.22" />
      </g>

      <path d="M 40 78 C 78 48, 128 46, 156 80" fill="none" stroke="#FCE8F0" strokeWidth="4.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 34 96 C 80 66, 134 64, 162 98" fill="none" stroke="#FCE8F0" strokeWidth="3.8" strokeLinecap="round" opacity="0.42" />
      <path d="M 36 114 C 82 86, 132 88, 160 118" fill="none" stroke="#FCE8F0" strokeWidth="3.6" strokeLinecap="round" opacity="0.36" />
      <path d="M 42 132 C 86 106, 128 110, 154 138" fill="none" stroke="#FCE8F0" strokeWidth="3.2" strokeLinecap="round" opacity="0.28" />
      <path d="M 52 148 C 90 126, 124 128, 146 152" fill="none" stroke="#FCE8F0" strokeWidth="2.8" strokeLinecap="round" opacity="0.22" />

      <path d="M 58 40 C 88 72, 92 128, 64 160" fill="none" stroke="#8F3A52" strokeWidth="2.4" opacity="0.18" />
      <path d="M 88 32 C 112 70, 116 132, 90 168" fill="none" stroke="#8F3A52" strokeWidth="2.2" opacity="0.16" />
      <path d="M 118 38 C 138 74, 140 130, 116 162" fill="none" stroke="#8F3A52" strokeWidth="2" opacity="0.14" />
      <path d="M 142 52 C 156 86, 154 124, 136 150" fill="none" stroke="#8F3A52" strokeWidth="1.8" opacity="0.12" />

      <path d="M 48 58 C 100 78, 120 118, 78 156" fill="none" stroke="#E8A8B8" strokeWidth="2.6" opacity="0.35" />
      <path d="M 140 56 C 108 90, 90 124, 118 154" fill="none" stroke="#E8A8B8" strokeWidth="2.4" opacity="0.28" />
      <path d="M 44 100 C 90 118, 130 100, 150 78" fill="none" stroke="#F6D0DC" strokeWidth="2.2" opacity="0.3" />

      <ellipse cx="78" cy="78" rx="32" ry="24" fill={`url(#${prefix}-glow)`} />

      <g transform="translate(48 22) rotate(-30)">
        <path
          d="M 10 10 C 4 0, 22 -2, 24 12 L 26 78"
          fill="none"
          stroke="#6B3A2A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 24 12 C 34 4, 36 16, 26 18"
          fill="none"
          stroke="#6B3A2A"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="26" cy="82" r="4" fill="#4A2818" />
        <path d="M 24 12 L 26 78" stroke="#C4A484" strokeWidth="1.2" opacity="0.4" />
      </g>
    </g>
  );
}

function DotGridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-cream/80"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(107,58,42,0.05) 1px, transparent 1.1px)",
        backgroundSize: "14px 14px",
      }}
    />
  );
}

function MobileYarnStrand({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={MOBILE_YARN_PATH}
        fill="none"
        stroke="rgba(107,58,42,0.14)"
        strokeWidth="14"
        strokeLinecap="round"
        transform="translate(2 0)"
      />
      <path
        d={MOBILE_YARN_PATH}
        fill="none"
        stroke="url(#m-yarn)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={MOBILE_YARN_PATH}
        fill="none"
        stroke="#FDF5F0"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.4"
        transform="translate(-1 0)"
      />
    </svg>
  );
}

function MobileVerticalYarn({ items }: { items: YarnCategoryItem[] }) {
  return (
    <div
      className="relative mx-auto mt-4 w-full max-w-sm px-4 select-none md:hidden"
      aria-label="Studio collections on a yarn line"
    >
      <DotGridBackdrop />

      {/* Flow stack: ball → yarn → card → yarn → card… (no absolute overlap) */}
      <div className="relative z-10 flex flex-col items-center pb-8 pt-3">
        {/* Shared gradient defs for mobile strands */}
        <svg className="absolute h-0 w-0" aria-hidden>
          <YarnBallDefs prefix="m" />
        </svg>

        {/* Ball on top, centered */}
        <svg
          className="relative z-10 h-28 w-28 overflow-visible sm:h-32 sm:w-32"
          viewBox="0 0 190 190"
          aria-hidden
        >
          <SoftWoolBall prefix="m" transform="translate(0 0)" />
        </svg>

        {/* Short strand from ball into first knot */}
        <MobileYarnStrand className="h-10 w-8 shrink-0" />

        {items.map((item, i) => (
          <div key={item.id} className="flex w-full flex-col items-center">
            <div className="relative z-20 w-[85%] max-w-[17rem]">
              <CategoryCard item={item} sizes="85vw" />
            </div>

            {i < items.length - 1 ? (
              <MobileYarnStrand className="h-12 w-8 shrink-0" />
            ) : (
              <MobileYarnStrand className="h-8 w-8 shrink-0 opacity-70" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopHorizontalYarn({ items }: { items: YarnCategoryItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hangRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cordRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || items.length === 0) return;

    const desktopMq = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !desktopMq.matches) return;

    const n = items.length;
    const angles = new Float64Array(n);
    const velocities = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
      angles[i] = HANG[i]!.seed * (Math.PI / 180);
    }

    let raf = 0;
    let last = performance.now();
    let lastScrollY = window.scrollY;
    let pointerX = 0.5;
    let awake = true;

    const stiffness = 24;
    const damping = 5.8;
    const maxAngle = (12 * Math.PI) / 180;

    const apply = () => {
      for (let i = 0; i < n; i += 1) {
        const deg = (angles[i]! * 180) / Math.PI;
        const len = HANG[i]!.cord;
        const node = hangRefs.current[i];
        if (node) node.style.transform = `rotate(${deg.toFixed(3)}deg)`;
        const cord = cordRefs.current[i];
        if (cord) {
          cord.setAttribute("x2", (Math.sin(angles[i]!) * len).toFixed(2));
          cord.setAttribute("y2", (Math.cos(angles[i]!) * len).toFixed(2));
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!desktopMq.matches) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      let moving = false;

      for (let i = 0; i < n; i += 1) {
        const pull = (pointerX - HANG[i]!.x / 1000) * 0.012;
        const acc =
          -stiffness * (angles[i]! - pull * 0.25) - damping * velocities[i]!;
        velocities[i]! += acc * dt;
        angles[i]! += velocities[i]! * dt;
        if (angles[i]! > maxAngle) {
          angles[i] = maxAngle;
          velocities[i]! *= -0.35;
        } else if (angles[i]! < -maxAngle) {
          angles[i] = -maxAngle;
          velocities[i]! *= -0.35;
        }
        if (Math.abs(angles[i]!) > 0.0004 || Math.abs(velocities[i]!) > 0.0008) {
          moving = true;
        }
      }

      apply();
      if (moving || awake) {
        awake = moving;
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (!desktopMq.matches) return;
      awake = true;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onScroll = () => {
      if (!desktopMq.matches) return;
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      const impulse = Math.max(-2.4, Math.min(2.4, delta * 0.0032));
      for (let i = 0; i < n; i += 1) {
        velocities[i]! +=
          impulse * (1 + i * 0.18) * (i % 2 === 0 ? 1 : -0.85);
      }
      wake();
    };

    const onPointer = (event: PointerEvent) => {
      if (!desktopMq.matches) return;
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0) return;
      pointerX = (event.clientX - rect.left) / rect.width;
      wake();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    stage.addEventListener("pointermove", onPointer, { passive: true });
    apply();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointermove", onPointer);
    };
  }, [items.length]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto mt-6 hidden w-full max-w-7xl select-none px-2 sm:px-4 md:block lg:px-6"
      aria-label="Studio collections on a yarn line"
    >
      <DotGridBackdrop />

      <div className="relative h-[24rem] w-full sm:h-[26rem] lg:h-[27.5rem]">
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          viewBox="0 0 1000 420"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <YarnBallDefs prefix="d" />

          <SoftWoolBall prefix="d" transform="translate(-52 18)" />

          {/* Exit strand into horizontal yarn */}
          <g transform="translate(-52 18)">
            <path
              d="M 112 102 C 132 96, 148 94, 158 96"
              fill="none"
              stroke="#E08A9A"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M 112 102 C 132 96, 148 94, 158 96"
              fill="none"
              stroke="#FDF5F8"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.4"
              transform="translate(0 -1)"
            />
          </g>

          <path
            d={YARN_PATH}
            fill="none"
            stroke="rgba(107,58,42,0.14)"
            strokeWidth="13"
            strokeLinecap="round"
            transform="translate(0 3)"
          />
          <path
            d={YARN_PATH}
            fill="none"
            stroke="url(#d-yarn)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={YARN_PATH}
            fill="none"
            stroke="#FDF5F0"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.4"
            transform="translate(0 -1.2)"
          />

          {items.map((_, i) => {
            const hang = HANG[i]!;
            return (
              <g key={`cord-${i}`} transform={`translate(${hang.x} ${hang.y})`}>
                <circle r="3.2" fill="#B85A40" />
                <line
                  ref={(el) => {
                    cordRefs.current[i] = el;
                  }}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={hang.cord}
                  stroke="#D4856A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {items.map((item, i) => {
          const hang = HANG[i]!;
          const leftPct = (hang.x / 1000) * 100;
          const topPct = (hang.y / 420) * 100;

          return (
            <div
              key={item.id}
              className="absolute z-20 w-[10.25rem] -translate-x-1/2 sm:w-[12rem] lg:w-[13.25rem]"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <div
                ref={(el) => {
                  hangRefs.current[i] = el;
                }}
                className="origin-top will-change-transform"
                style={{ paddingTop: hang.cord }}
              >
                <div className="relative mx-auto mb-[-6px] h-3 w-3 rounded-full border-2 border-[#D5C4B6] bg-white shadow-sm" />
                <CategoryCard item={item} sizes="220px" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CategoriesYarnLine({ items }: CategoriesYarnLineProps) {
  const shown = items.slice(0, 4);

  return (
    <>
      <MobileVerticalYarn items={shown} />
      <DesktopHorizontalYarn items={shown} />
    </>
  );
}
