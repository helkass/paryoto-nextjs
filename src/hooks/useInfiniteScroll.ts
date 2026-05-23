// hooks/useInfiniteScroll.ts
import { useState, useCallback, useRef, useEffect } from "react";
import {
  UseInfiniteScrollOptions,
  UseInfiniteScrollReturn,
} from "@/types/infinite-scroll.types";

export function useInfiniteScroll<TData>({
  fetchMore,
  initialData = [],
  initialPage = 1,
  enabled = true,
  onLoadMore,
  onEnd,
  onError,
}: UseInfiniteScrollOptions<TData>): UseInfiniteScrollReturn<TData> {
  const [data, setData] = useState<TData[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(initialPage);

  // Update refs
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, hasMore, page]);

  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (loadingRef.current || !hasMoreRef.current || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchMore(pageRef.current);

      setData((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setTotal(result.total || data.length + result.data.length);

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

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setTotal(0);
    loadingRef.current = false;
    hasMoreRef.current = true;
    pageRef.current = initialPage;
  }, [initialPage]);

  const refetch = useCallback(async () => {
    reset();
    await loadMore();
  }, [reset, loadMore]);

  // Auto load initial data
  useEffect(() => {
    if (enabled && initialData.length === 0) {
      loadMore();
    }
  }, [enabled, initialData.length, loadMore]);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    total,
    loadMore,
    reset,
    refetch,
  };
}
