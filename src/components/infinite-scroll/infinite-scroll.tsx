// components/infinite-scroll/infinite-scroll.tsx
"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfiniteScrollProps } from "@/types/infinite-scroll.types";

export function InfiniteScroll<TData>({
  fetchMore,
  renderItem,
  initialData = [],
  initialPage = 1,
  loadingComponent,
  errorComponent,
  endComponent,
  emptyComponent,
  threshold = 100,
  debounceDelay = 100,
  initialDelay = 0,
  hasMore: externalHasMore,
  enabled = true,
  reverse = false,
  className,
  loaderClassName,
  onLoadMore,
  onEnd,
  onError,
}: InfiniteScrollProps<TData>) {
  const [data, setData] = React.useState<TData[]>(initialData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [hasMore, setHasMore] = React.useState(externalHasMore ?? true);
  const [page, setPage] = React.useState(initialPage);

  const loadingRef = React.useRef(false);
  const hasMoreRef = React.useRef(hasMore);
  const pageRef = React.useRef(page);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const initialLoadedRef = React.useRef(false);

  // Update refs
  React.useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, hasMore, page]);

  // Intersection Observer for infinite scroll
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: `0px 0px ${threshold}px 0px`,
    skip: !enabled || !hasMore || loading || !!error,
  });

  // Load more function
  const loadMore = React.useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchMore(pageRef.current);

      setData((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);

      if (result.hasMore) {
        setPage((prev) => prev + 1);
        onLoadMore?.(pageRef.current);
      } else {
        onEnd?.();
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load more data");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, enabled, onLoadMore, onEnd, onError]);

  // Trigger load more when sentinel is in view
  React.useEffect(() => {
    if (inView && !loading && hasMore && !error && enabled) {
      // Debounce to prevent rapid calls
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        loadMore();
      }, debounceDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inView, loading, hasMore, error, enabled, loadMore, debounceDelay]);

  // Initial load
  React.useEffect(() => {
    if (enabled && !initialLoadedRef.current && initialData.length === 0) {
      if (initialDelay > 0) {
        const timer = setTimeout(() => {
          loadMore();
          initialLoadedRef.current = true;
        }, initialDelay);
        return () => clearTimeout(timer);
      } else {
        loadMore();
        initialLoadedRef.current = true;
      }
    }
  }, [enabled, initialData.length, loadMore, initialDelay]);

  // Reset function
  // const reset = React.useCallback(() => {
  //   setData([]);
  //   setPage(initialPage);
  //   setHasMore(externalHasMore ?? true);
  //   setError(null);
  //   loadingRef.current = false;
  //   hasMoreRef.current = externalHasMore ?? true;
  //   pageRef.current = initialPage;
  //   initialLoadedRef.current = false;
  // }, [initialPage, externalHasMore]);

  // Refetch function
  // const refetch = React.useCallback(async () => {
  //   reset();
  //   await loadMore();
  // }, [reset, loadMore]);

  // Retry function
  const retry = React.useCallback(() => {
    setError(null);
    loadMore();
  }, [loadMore]);

  // Default loading component
  const DefaultLoadingComponent = () => (
    <div
      className={cn("flex items-center justify-center py-8", loaderClassName)}
    >
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">
        Loading more...
      </span>
    </div>
  );

  // Default error component
  const DefaultErrorComponent = ({
    error,
    retry,
  }: {
    error: Error;
    retry: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-sm text-destructive font-medium mb-2">
        Failed to load data
      </p>
      <p className="text-xs text-muted-foreground mb-4">{error.message}</p>
      <button onClick={retry} className="text-sm text-primary hover:underline">
        Try again
      </button>
    </div>
  );

  // Default end component
  const DefaultEndComponent = () => (
    <div className="flex items-center justify-center py-8">
      <p className="text-sm text-muted-foreground">
        You&apos;ve reached the end
      </p>
    </div>
  );

  // Default empty component
  const DefaultEmptyComponent = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground">No data available</p>
    </div>
  );

  // Empty state
  if (data.length === 0 && !loading && !error) {
    return (
      <div className={cn("w-full", className)}>
        {emptyComponent || <DefaultEmptyComponent />}
      </div>
    );
  }

  // Render items in reverse order if needed
  const itemsToRender = reverse ? [...data].reverse() : data;

  return (
    <div className={cn("w-full", className)}>
      {/* Items Container */}
      <div className="space-y-4">
        {itemsToRender.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (loadingComponent || <DefaultLoadingComponent />)}

      {/* Error State */}
      {error &&
        !loading &&
        (errorComponent ? (
          errorComponent(error, retry)
        ) : (
          <DefaultErrorComponent error={error} retry={retry} />
        ))}

      {/* End State */}
      {!hasMore &&
        data.length > 0 &&
        !error &&
        (endComponent || <DefaultEndComponent />)}

      {/* Sentinel for intersection observer */}
      {hasMore && !loading && !error && (
        <div ref={sentinelRef} className="h-1 w-full" />
      )}
    </div>
  );
}
