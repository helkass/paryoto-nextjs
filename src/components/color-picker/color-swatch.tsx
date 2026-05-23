// components/color-picker/color-swatch.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ColorSwatchProps } from "@/types/color-picker.types";

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function ColorSwatch({
  color,
  isSelected,
  onClick,
  size = "md",
  className,
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
      aria-label={`Select color ${color}`}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}
