// components/notification/notification-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NotificationSkeletonProps {
  count?: number;
  variant?: "default" | "compact" | "card" | "popover";
  className?: string;
}

export function NotificationSkeleton({
  count = 5,
  variant = "default",
  className,
}: NotificationSkeletonProps) {
  const renderSkeleton = () => {
    if (variant === "compact") {
      return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ));
    }

    if (variant === "card") {
      return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border rounded-xl">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>
      ));
    }

    if (variant === "popover") {
      return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-6 w-6 rounded-full shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-full mt-1" />
          </div>
        </div>
      ));
    }

    // Default variant
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-1" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    ));
  };

  return <div className={cn("space-y-2", className)}>{renderSkeleton()}</div>;
}
