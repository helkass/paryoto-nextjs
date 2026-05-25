// components/treemap/treemap-legend.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TreeMapLegendProps } from "@/types/treemap.types";

export function TreeMapLegend({
  items,
  valueFormat,
  className,
}: TreeMapLegendProps) {
  const sortedItems = [...items].sort((a, b) => b.value - a.value);

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {sortedItems.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs">
            {item.name}
            {valueFormat && ` (${valueFormat(item.value)})`}
          </span>
        </div>
      ))}
    </div>
  );
}
