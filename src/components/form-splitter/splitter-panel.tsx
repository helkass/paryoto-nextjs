// components/form-splitter/splitter-panel.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SplitterPanelProps } from "@/types/form-splitter.types";

export function SplitterPanel({
  children,
  width,
  minWidth = 20,
  maxWidth = 80,
  className,
  label,
  icon,
}: SplitterPanelProps) {
  return (
    <div
      className={cn("overflow-auto", className)}
      style={{
        width: `${width}%`,
        minWidth: `${minWidth}%`,
        maxWidth: `${maxWidth}%`,
      }}
    >
      {(label || icon) && (
        <div className="mb-4 flex items-center gap-2 border-b pb-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          {label && <h3 className="font-medium">{label}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}
