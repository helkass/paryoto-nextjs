// types/masonry-grid.types.ts
import { ReactNode } from "react";

export interface MasonryGridProps {
  // Core
  children: ReactNode[];

  // Configuration
  columnCount?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: number;
  breakpointGap?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };

  // Behavior
  animated?: boolean;
  animationDelay?: number;
  lazyLoad?: boolean;
  lazyLoadThreshold?: number;

  // Performance
  virtualize?: boolean;
  itemHeightEstimate?: number;
  overscan?: number;

  // Loading & Empty
  loading?: boolean;
  loadingComponent?: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  emptyComponent?: ReactNode;

  // Styling
  className?: string;
  itemClassName?: string;

  // Callbacks
  onItemClick?: (index: number, item: ReactNode) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface MasonryColumnProps {
  children: ReactNode[];
  gap: number;
  className?: string;
}

export interface MasonryItemProps {
  children: ReactNode;
  index: number;
  width: number;
  onClick?: () => void;
  className?: string;
  animated?: boolean;
  delay?: number;
}
