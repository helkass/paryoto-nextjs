// components/datagrid/data-grid-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataGridSkeletonProps {
  itemCount?: number;
  gridColumns: {
    default: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
  };
  className?: string;
}

export function DataGridSkeleton({
  itemCount = 12,
  gridColumns,
  className,
}: DataGridSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Grid Skeleton */}
      <div
        className={cn(
          "grid",
          `grid-cols-${gridColumns.default}`,
          `sm:grid-cols-${gridColumns.sm}`,
          `md:grid-cols-${gridColumns.md}`,
          `lg:grid-cols-${gridColumns.lg}`,
          `xl:grid-cols-${gridColumns.xl}`,
          `2xl:grid-cols-${gridColumns["2xl"]}`
        )}
        style={{ gap: "16px" }}
      >
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
