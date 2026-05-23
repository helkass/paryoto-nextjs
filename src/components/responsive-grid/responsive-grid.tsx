// components/responsive-grid/responsive-grid.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { ResponsiveGridItem } from "./responsive-grid-item";
import { ResponsiveGridProps } from "@/types/responsive-grid.types";
import { Loader2, Package } from "lucide-react";

// Default breakpoints
const DEFAULT_COLUMNS = {
  default: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  "2xl": 6,
};

// Helper function to generate grid columns class
const getGridColumnsClass = (
  columns: ResponsiveGridProps["columns"]
): string => {
  const colConfig = { ...DEFAULT_COLUMNS, ...columns };
  const classes: string[] = ["grid"];

  // Add default columns
  if (colConfig.default) {
    classes.push(`grid-cols-${colConfig.default}`);
  }

  // Add responsive breakpoints
  if (colConfig.sm) {
    classes.push(`sm:grid-cols-${colConfig.sm}`);
  }
  if (colConfig.md) {
    classes.push(`md:grid-cols-${colConfig.md}`);
  }
  if (colConfig.lg) {
    classes.push(`lg:grid-cols-${colConfig.lg}`);
  }
  if (colConfig.xl) {
    classes.push(`xl:grid-cols-${colConfig.xl}`);
  }
  if (colConfig["2xl"]) {
    classes.push(`2xl:grid-cols-${colConfig["2xl"]}`);
  }

  return cn(classes);
};

// Helper function for gap class
const getGapClass = (gap: number | string): string => {
  if (typeof gap === "number") {
    // Map numeric gap to Tailwind spacing scale (1 = 0.25rem = 4px)
    // gap-1 = 4px, gap-2 = 8px, gap-3 = 12px, gap-4 = 16px, etc.
    return `gap-${gap}`;
  }
  return gap;
};

export function ResponsiveGrid({
  children,
  columns = DEFAULT_COLUMNS,
  gap = 4,
  minItemWidth,
  maxItemWidth,
  autoFit = false,
  masonry = false,
  masonryColumnCount = 3,
  animated = true,
  animationDelay = 0.05,
  loading = false,
  loadingComponent,
  empty = false,
  emptyComponent,
  emptyMessage = "No items to display",
  className,
  itemClassName,
  virtualScroll = false,
  itemHeight = 300,
  overscan = 5,
  onItemClick,
  onLoadMore,
  hasMore = false,
}: ResponsiveGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [masonryColumns, setMasonryColumns] = React.useState<
    React.ReactNode[][]
  >([]);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  // Handle load more on scroll
  React.useEffect(() => {
    if (inView && onLoadMore && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, onLoadMore, hasMore, loading]);

  // Track container width for auto-fit
  React.useEffect(() => {
    if (!autoFit || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [autoFit]);

  // Get column count for masonry
  const getMasonryColumnCount = React.useCallback((): number => {
    if (masonryColumnCount) return masonryColumnCount;

    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1536 && columns["2xl"]) return columns["2xl"];
      if (width >= 1280 && columns.xl) return columns.xl;
      if (width >= 1024 && columns.lg) return columns.lg;
      if (width >= 768 && columns.md) return columns.md;
      if (width >= 640 && columns.sm) return columns.sm;
    }
    return columns.default || DEFAULT_COLUMNS.default;
  }, [masonryColumnCount, columns]);

  // Masonry layout calculation
  React.useEffect(() => {
    if (!masonry) return;

    const childrenArray = React.Children.toArray(children);
    const colCount = getMasonryColumnCount();
    const columnsArray: React.ReactNode[][] = Array(colCount)
      .fill(null)
      .map(() => []);
    const columnHeights: number[] = Array(colCount).fill(0);

    childrenArray.forEach((child, index) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      columnsArray[shortestColumn].push(child);
      columnHeights[shortestColumn] += itemHeight;
    });

    setMasonryColumns(columnsArray);
  }, [children, masonry, getMasonryColumnCount, itemHeight]);

  // Auto-fit grid style
  const autoFitStyle = React.useMemo(() => {
    if (!autoFit) return {};

    let gridTemplateColumns = "";
    if (minItemWidth && maxItemWidth) {
      gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}px, ${maxItemWidth}px))`;
    } else if (minItemWidth) {
      gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`;
    } else if (maxItemWidth) {
      gridTemplateColumns = `repeat(auto-fit, minmax(200px, ${maxItemWidth}px))`;
    } else {
      gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
    }

    return {
      display: "grid",
      gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
      gridTemplateColumns,
    };
  }, [autoFit, minItemWidth, maxItemWidth, gap]);

  // Loading state
  if (loading && !React.Children.count(children)) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div
        className={cn("grid", getGapClass(gap), getGridColumnsClass(columns))}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-1 h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
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

  // Masonry layout
  if (masonry) {
    const colCount = getMasonryColumnCount();

    return (
      <div ref={containerRef} className="w-full">
        <div className="flex gap-4">
          {Array.from({ length: colCount }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 space-y-4">
              {masonryColumns[colIndex]?.map((item, itemIndex) => (
                <ResponsiveGridItem
                  key={itemIndex}
                  index={itemIndex}
                  onClick={() => onItemClick?.(itemIndex, item)}
                  className={itemClassName}
                  animated={animated}
                  delay={animationDelay}
                >
                  {item}
                </ResponsiveGridItem>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Virtual scroll placeholder
  if (virtualScroll && React.Children.count(children) > 50) {
    // For production, implement with react-window or react-virtuoso
    console.warn(
      "Virtual scroll requires additional setup. Falling back to regular grid."
    );
  }

  // Regular grid layout
  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        className={cn(getGridColumnsClass(columns), getGapClass(gap))}
        style={autoFitStyle}
      >
        {React.Children.map(children, (child, index) => (
          <ResponsiveGridItem
            key={index}
            index={index}
            onClick={() => onItemClick?.(index, child)}
            className={itemClassName}
            animated={animated}
            delay={animationDelay}
          >
            {child}
          </ResponsiveGridItem>
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
