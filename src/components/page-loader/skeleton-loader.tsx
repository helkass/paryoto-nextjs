// components/page-loader/skeleton-loader.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SkeletonLoaderProps } from "@/types/page-loader.types";

export function SkeletonLoader({
  type = "text",
  count = 3,
  className,
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        );

      case "card":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="mb-3 h-32 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-8 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-24 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            </div>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="border-b p-4">
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-4 w-24 animate-pulse rounded bg-muted"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "form":
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
            <div className="h-10 w-32 animate-pulse rounded bg-muted" />
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-8 w-32 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
            {/* Chart */}
            <div className="rounded-lg border p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-64 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={cn("w-full", className)}>{renderSkeleton()}</div>;
}
