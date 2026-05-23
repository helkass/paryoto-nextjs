// components/masonry-grid/masonry-grid.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { MasonryItem } from "./masonry-item";
import { MasonryGridProps } from "@/types/masonry-grid.types";
import { Loader2, Package } from "lucide-react";

// Default column counts
const DEFAULT_COLUMNS = {
  default: 2,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  "2xl": 6,
};

// Default gaps
const DEFAULT_GAP = 16;

export function MasonryGrid({
  children,
  columnCount = DEFAULT_COLUMNS,
  gap = DEFAULT_GAP,
  breakpointGap,
  animated = true,
  animationDelay = 0.05,
  lazyLoad = true,
  lazyLoadThreshold = 200,
  virtualize = false,
  itemHeightEstimate = 300,
  overscan = 3,
  loading = false,
  loadingComponent,
  empty = false,
  emptyMessage = "No items to display",
  emptyComponent,
  className,
  itemClassName,
  onItemClick,
  onLoadMore,
  hasMore = false,
}: MasonryGridProps) {
  const [columns, setColumns] = React.useState<React.ReactNode[][]>([]);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [visibleItems, setVisibleItems] = React.useState<Set<number>>(
    new Set()
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: `${lazyLoadThreshold}px`,
  });

  // Get current column count based on screen width
  const getCurrentColumnCount = React.useCallback((): number => {
    if (typeof window === "undefined") return columnCount.default;

    const width = window.innerWidth;
    if (width >= 1536 && columnCount["2xl"]) return columnCount["2xl"];
    if (width >= 1280 && columnCount.xl) return columnCount.xl;
    if (width >= 1024 && columnCount.lg) return columnCount.lg;
    if (width >= 768 && columnCount.md) return columnCount.md;
    if (width >= 640 && columnCount.sm) return columnCount.sm;
    return columnCount.default;
  }, [columnCount]);

  // Get current gap based on screen width
  const getCurrentGap = React.useCallback((): number => {
    if (typeof window === "undefined") return gap;

    const width = window.innerWidth;
    if (width >= 1536 && breakpointGap?.["2xl"]) return breakpointGap["2xl"];
    if (width >= 1280 && breakpointGap?.xl) return breakpointGap.xl;
    if (width >= 1024 && breakpointGap?.lg) return breakpointGap.lg;
    if (width >= 768 && breakpointGap?.md) return breakpointGap.md;
    if (width >= 640 && breakpointGap?.sm) return breakpointGap.sm;
    return gap;
  }, [gap, breakpointGap]);

  // Handle load more
  React.useEffect(() => {
    if (inView && onLoadMore && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, onLoadMore, hasMore, loading]);

  // Calculate masonry layout
  React.useEffect(() => {
    const colCount = getCurrentColumnCount();
    const currentGap = getCurrentGap();
    const childrenArray = React.Children.toArray(children);

    if (childrenArray.length === 0) return;

    // Initialize columns
    const newColumns: React.ReactNode[][] = Array(colCount)
      .fill(null)
      .map(() => []);
    const columnHeights: number[] = Array(colCount).fill(0);

    // Distribute items to columns based on estimated height
    childrenArray.forEach((child, index) => {
      // Find column with smallest height
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumn].push(child);

      // Estimate item height (in production, use actual measured heights)
      // This is a simplified estimation
      const estimatedHeight = itemHeightEstimate;
      columnHeights[shortestColumn] += estimatedHeight + currentGap;
    });

    setColumns(newColumns);
  }, [children, getCurrentColumnCount, getCurrentGap, itemHeightEstimate]);

  // Update on resize
  React.useEffect(() => {
    const handleResize = () => {
      const colCount = getCurrentColumnCount();
      const currentGap = getCurrentGap();
      const childrenArray = React.Children.toArray(children);

      if (childrenArray.length === 0) return;

      const newColumns: React.ReactNode[][] = Array(colCount)
        .fill(null)
        .map(() => []);
      const columnHeights: number[] = Array(colCount).fill(0);

      childrenArray.forEach((child, index) => {
        const shortestColumn = columnHeights.indexOf(
          Math.min(...columnHeights)
        );
        newColumns[shortestColumn].push(child);
        columnHeights[shortestColumn] += itemHeightEstimate + currentGap;
      });

      setColumns(newColumns);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [children, getCurrentColumnCount, getCurrentGap, itemHeightEstimate]);

  // Lazy load visibility tracking
  React.useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0",
              10
            );
            setVisibleItems((prev) => new Set(prev).add(index));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: `${lazyLoadThreshold}px` }
    );

    const items = document.querySelectorAll(".masonry-item");
    items.forEach((item, idx) => {
      item.setAttribute("data-index", idx.toString());
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [children, lazyLoad, lazyLoadThreshold]);

  const currentGap = getCurrentGap();
  const columnWidth = 100 / columns.length;

  if (loading && !React.Children.count(children)) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className={cn("w-full", className)}>
        <div className="flex gap-4">
          {Array.from({ length: getCurrentColumnCount() }).map(
            (_, colIndex) => (
              <div key={colIndex} className="flex-1 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video rounded-lg bg-muted" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
                    <div className="mt-1 h-3 w-1/2 rounded bg-muted" />
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  if (empty || !React.Children.count(children)) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div className="flex" style={{ gap: currentGap }}>
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex-1"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: currentGap,
            }}
          >
            {column.map((item, itemIndex) => {
              const globalIndex = colIndex * column.length + itemIndex;
              const shouldRender = !lazyLoad || visibleItems.has(globalIndex);

              return (
                <MasonryItem
                  key={globalIndex}
                  index={globalIndex}
                  width={columnWidth}
                  onClick={() => onItemClick?.(globalIndex, item)}
                  className={itemClassName}
                  animated={animated}
                  delay={animationDelay}
                >
                  {shouldRender ? (
                    item
                  ) : (
                    <div className="aspect-video animate-pulse rounded-lg bg-muted" />
                  )}
                </MasonryItem>
              );
            })}
          </div>
        ))}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {loading && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
}
