// components/infinite-scroll/infinite-scroll-virtual.tsx
"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfiniteScrollVirtualProps<TData> {
  data: TData[];
  renderItem: (item: TData, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  itemHeight?: number;
  overscan?: number;
  className?: string;
}

export function InfiniteScrollVirtual<TData>({
  data,
  renderItem,
  loadMore,
  hasMore,
  loading,
  itemHeight = 100,
  overscan = 5,
  className,
}: InfiniteScrollVirtualProps<TData>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 200px 0px",
  });

  const virtualizer = useVirtualizer({
    count: data.length + (hasMore ? 1 : 0),
    getScrollElement: () => scrollRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  // Trigger load more when sentinel is in view
  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-auto", className)}
      style={{ height: "600px" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > data.length - 1;
          const item = data[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow
                ? hasMore && (
                    <div
                      ref={sentinelRef}
                      className="flex items-center justify-center py-4"
                    >
                      {loading && (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  )
                : renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
