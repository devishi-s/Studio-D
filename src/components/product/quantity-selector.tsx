"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <span className="min-w-[2.5rem] text-center text-sm font-medium tabular-nums text-brand-brown">
        {value}
      </span>

      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
