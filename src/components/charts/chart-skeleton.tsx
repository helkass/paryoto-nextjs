// components/charts/chart-skeleton.tsx
"use client";

import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

export function ChartSkeleton({ height = 400, className }: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-muted bg-muted/20",
        className
      )}
      style={{ height }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex h-full items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="h-4 w-32 animate-pulse rounded bg-muted mx-auto" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted mx-auto" />
        </div>
      </div>
    </div>
  );
}
