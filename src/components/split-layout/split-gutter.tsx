// components/split-layout/split-gutter.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GripVertical, GripHorizontal } from "lucide-react";
import { SplitGutterProps } from "@/types/split-layout.types";

export function SplitGutter({
  onMouseDown,
  onTouchStart,
  resizable = true,
  direction = "horizontal",
  className,
}: SplitGutterProps) {
  if (!resizable) {
    return (
      <div
        className={cn(
          direction === "horizontal" ? "w-px" : "h-px",
          "bg-border",
          className
        )}
      />
    );
  }

  const isHorizontal = direction === "horizontal";
  const GripIcon = isHorizontal ? GripVertical : GripHorizontal;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-border transition-colors hover:bg-primary/50 group",
        isHorizontal ? "cursor-col-resize w-2" : "cursor-row-resize h-2",
        className
      )}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div
        className={cn(
          "absolute bg-border group-hover:bg-primary",
          isHorizontal
            ? "inset-y-0 left-1/2 w-px -translate-x-1/2"
            : "inset-x-0 top-1/2 h-px -translate-y-1/2"
        )}
      />
      <div className="rounded-md bg-background p-0.5 shadow-sm">
        <GripIcon className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
      </div>
    </div>
  );
}
