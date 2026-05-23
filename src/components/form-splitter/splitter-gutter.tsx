// components/form-splitter/splitter-gutter.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GripVertical, GripHorizontal } from "lucide-react";
import { SplitterGutterProps } from "@/types/form-splitter.types";

export function SplitterGutter({
  onMouseDown,
  onTouchStart,
  className,
  resizable = true,
}: SplitterGutterProps) {
  if (!resizable) {
    return <div className={cn("w-px bg-border", className)} />;
  }

  return (
    <div
      className={cn(
        "relative flex cursor-col-resize items-center justify-center bg-border transition-colors hover:bg-primary/50",
        "group",
        className
      )}
      style={{ width: 8 }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-border group-hover:bg-primary" />
      <div className="rounded-md bg-background p-0.5 shadow-sm">
        <GripVertical className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
      </div>
    </div>
  );
}
