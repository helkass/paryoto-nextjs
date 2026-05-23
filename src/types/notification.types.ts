import { ReactNode } from "react";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "primary";
export type NotificationVariant = "default" | "compact" | "card" | "popover";
export type NotificationPriority = "low" | "medium" | "high";
export type ActionVariant = "default" | "destructive" | "outline";
export type BadgeVariant = "default" | "destructive" | "primary";
export type Placement = "top" | "bottom" | "left" | "right";

/**
 * Notification metadata object
 * Use specific keys for better type safety
 */
export interface NotificationMetadata {
  [key: string]: string | number | boolean | Date | null | undefined;
}

export interface NotificationAction {
  label: string;
  onClick: (notification: Notification) => void;
  variant?: ActionVariant;
  icon?: ReactNode;
}

export interface Notification {
  id: string | number;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: string | Date;
  read: boolean;
  icon?: ReactNode;
  action?: Omit<NotificationAction, "variant">;
  actions?: NotificationAction[];
  metadata?: NotificationMetadata;
  link?: string;
  priority?: NotificationPriority;
}

export interface FilterConfig {
  types?: NotificationType[];
  read?: boolean;
  priority?: NotificationPriority[];
}

export interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  error?: string | null;

  // Display options
  variant?: NotificationVariant;
  showTimestamp?: boolean;
  showActions?: boolean;
  showDismiss?: boolean;
  groupByDate?: boolean;
  dateFormat?: string;

  // Behavior
  autoArchive?: boolean;
  autoArchiveDelay?: number;
  maxItems?: number;
  onMarkAsRead?: (id: string | number) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string | number) => void;
  onDismissAll?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onActionClick?: (notification: Notification, actionLabel: string) => void;

  // Filtering
  filter?: FilterConfig;

  // Pagination
  pagination?: PaginationConfig;

  // Empty state
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  // Styling
  className?: string;
  itemClassName?: string;
  headerClassName?: string;

  // Animation
  animated?: boolean;
  autoHide?: boolean;
  autoHideDuration?: number;
}

export interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  variant?: BadgeVariant;
  showZero?: boolean;
}

export interface NotificationBellProps {
  notifications: Notification[];
  onOpen?: () => void;
  onClose?: () => void;
  onMarkAsRead?: (id: string | number) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  placement?: Placement;
  className?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  variant?: NotificationVariant;
  showTimestamp?: boolean;
  showActions?: boolean;
  showDismiss?: boolean;
  onMarkAsRead?: (id: string | number) => void;
  onDismiss?: (id: string | number) => void;
  onActionClick?: (notification: Notification, actionLabel: string) => void;
  className?: string;
}
