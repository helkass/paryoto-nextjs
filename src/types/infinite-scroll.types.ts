// types/infinite-scroll.types.ts
import { ReactNode } from "react";

export interface InfiniteScrollProps<TData> {
  // Core
  fetchMore: (page: number) => Promise<{
    data: TData[];
    hasMore: boolean;
    total?: number;
  }>;
  renderItem: (item: TData, index: number) => ReactNode;

  // Initial state
  initialData?: TData[];
  initialPage?: number;
  pageSize?: number;

  // Loading & Error
  loadingComponent?: ReactNode;
  errorComponent?: (error: Error, retry: () => void) => ReactNode;
  endComponent?: ReactNode;
  emptyComponent?: ReactNode;

  // Threshold & Delay
  threshold?: number; // pixels before bottom to trigger load
  debounceDelay?: number; // debounce delay in ms
  initialDelay?: number; // initial delay before first load

  // Behavior
  hasMore?: boolean;
  enabled?: boolean;
  reverse?: boolean; // scroll to top instead of bottom

  // Styling
  className?: string;
  loaderClassName?: string;

  // Callbacks
  onLoadMore?: (page: number) => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface UseInfiniteScrollOptions<TData> {
  fetchMore: (page: number) => Promise<{
    data: TData[];
    hasMore: boolean;
    total?: number;
  }>;
  initialData?: TData[];
  initialPage?: number;
  pageSize?: number;
  enabled?: boolean;
  onLoadMore?: (page: number) => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface UseInfiniteScrollReturn<TData> {
  data: TData[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  page: number;
  total: number;
  loadMore: () => Promise<void>;
  reset: () => void;
  refetch: () => Promise<void>;
}
