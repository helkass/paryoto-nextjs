// components/page-loader/progress-bar.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProgressBarProps } from "@/types/page-loader.types";

export function ProgressBar({
  progress,
  className,
  barClassName,
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-primary transition-all duration-300 ease-out",
          barClassName
        )}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
