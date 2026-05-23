// components/split-layout/split-panel.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SplitPanelProps } from "@/types/split-layout.types";

export function SplitPanel({
  children,
  size,
  minSize = 20,
  maxSize = 80,
  className,
  direction = "horizontal",
}: SplitPanelProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={cn("overflow-auto", className)}
      style={{
        [isHorizontal ? "width" : "height"]: `${size}%`,
        minWidth: isHorizontal ? `${minSize}%` : undefined,
        maxWidth: isHorizontal ? `${maxSize}%` : undefined,
        minHeight: !isHorizontal ? `${minSize}%` : undefined,
        maxHeight: !isHorizontal ? `${maxSize}%` : undefined,
      }}
    >
      {children}
    </div>
  );
}
