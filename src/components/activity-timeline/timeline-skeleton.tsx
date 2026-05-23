// components/activity-timeline/timeline-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TimelineSkeletonProps {
  count?: number;
  variant?: "default" | "compact" | "detailed" | "modern";
  className?: string;
}

export function TimelineSkeleton({
  count = 5,
  variant = "default",
  className,
}: TimelineSkeletonProps) {
  const renderSkeleton = () => {
    if (variant === "compact") {
      return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ));
    }

    if (variant === "detailed") {
      return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-3 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      ));
    }

    if (variant === "modern") {
      return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative pl-8 pb-6">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-2 border-background">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
          <div className="p-4 border rounded-xl">
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ));
    }

    // Default variant
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 pb-6">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-5 w-1/2 mb-1" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    ));
  };

  return <div className={cn("space-y-2", className)}>{renderSkeleton()}</div>;
}
