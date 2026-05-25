// components/heatmap/heatmap-legend.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HeatmapLegendProps } from "@/types/heatmap.types";

export function HeatmapLegend({
  minValue,
  maxValue,
  colors,
  valueFormat,
  className,
}: HeatmapLegendProps) {
  const steps = colors.map((_, index) => {
    const percentage = index / (colors.length - 1);
    const value = minValue + (maxValue - minValue) * percentage;
    return { color: colors[index], value: Math.round(value) };
  });

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      <span className="text-muted-foreground">Less</span>
      <div className="flex gap-0.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: step.color }}
            title={
              valueFormat ? valueFormat(step.value) : step.value.toString()
            }
          />
        ))}
      </div>
      <span className="text-muted-foreground">More</span>
    </div>
  );
}
