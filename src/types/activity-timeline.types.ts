// types/activity-timeline.types.ts
import { ReactNode } from "react";

export interface TimelineEvent {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string | Date;
  type?: "info" | "success" | "warning" | "error" | "primary";
  icon?: ReactNode;
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  metadata?: Record<string, any>;
  actions?: Array<{
    label: string;
    onClick: (event: TimelineEvent) => void;
    icon?: ReactNode;
  }>;
  status?: "pending" | "completed" | "failed" | "in-progress";
}

export interface ActivityTimelineProps {
  events: TimelineEvent[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  // Display options
  variant?: "default" | "compact" | "detailed" | "modern";
  layout?: "vertical" | "horizontal" | "alternating";
  showUser?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  groupByDate?: boolean;
  dateFormat?: string;

  // Filtering
  filter?: {
    types?: string[];
    dateRange?: { start: Date; end: Date };
    search?: string;
  };

  // Pagination
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };

  // Infinite scroll
  infiniteScroll?: {
    enabled: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    loadingMore: boolean;
  };

  // Callbacks
  onEventClick?: (event: TimelineEvent) => void;
  onUserClick?: (user: TimelineEvent["user"]) => void;

  // Styling
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  timeClassName?: string;

  // Animation
  animated?: boolean;
}

export interface TimelineGroupProps {
  date: string;
  events: TimelineEvent[];
  variant?: ActivityTimelineProps["variant"];
  onEventClick?: (event: TimelineEvent) => void;
  onUserClick?: (user: TimelineEvent["user"]) => void;
  itemClassName?: string;
}
