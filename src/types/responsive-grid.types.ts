// types/responsive-grid.types.ts
import { ReactNode } from "react";

export interface ResponsiveGridProps {
  // Core
  children: ReactNode;

  // Grid configuration
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: number | string;

  // Item configuration
  minItemWidth?: number;
  maxItemWidth?: number;
  autoFit?: boolean;

  // Masonry layout
  masonry?: boolean;
  masonryColumnCount?: number;

  // Animation
  animated?: boolean;
  animationDelay?: number;

  // Loading & Empty
  loading?: boolean;
  loadingComponent?: ReactNode;
  empty?: boolean;
  emptyComponent?: ReactNode;
  emptyMessage?: string;

  // Styling
  className?: string;
  itemClassName?: string;

  // Virtual scroll
  virtualScroll?: boolean;
  itemHeight?: number;
  overscan?: number;

  // Callbacks
  onItemClick?: (index: number, item: ReactNode) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface ResponsiveGridItemProps {
  children: ReactNode;
  index: number;
  onClick?: () => void;
  className?: string;
  animated?: boolean;
  delay?: number;
}

export interface GridBreakpoint {
  minWidth: number;
  columns: number;
}
