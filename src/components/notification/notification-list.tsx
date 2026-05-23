// components/notification/notification-list.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCheck,
  MoreVertical,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  Notification,
  NotificationListProps,
} from "@/types/notification.types";
import { NotificationItem } from "./notification-item";
import { NotificationSkeleton } from "./notification-skeleton";
import { NotificationEmpty } from "./notification-empty";

export function NotificationList({
  notifications,
  loading = false,
  error = null,
  variant = "default",
  showTimestamp = true,
  showActions = true,
  showDismiss = true,
  groupByDate = true,
  dateFormat = "dd MMM yyyy",
  autoArchive = false,
  autoArchiveDelay = 5000,
  maxItems,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onDismissAll,
  onNotificationClick,
  onActionClick,
  filter,
  pagination,
  emptyMessage = "No notifications",
  emptyIcon,
  className,
  itemClassName,
  headerClassName,
  animated = true,
}: NotificationListProps) {
  const [localNotifications, setLocalNotifications] =
    React.useState(notifications);
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(
    new Set()
  );
  const [autoArchiveTimers, setAutoArchiveTimers] = React.useState<
    Map<string | number, NodeJS.Timeout>
  >(new Map());

  // Update local notifications when prop changes
  React.useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);
  // Apply filters
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...localNotifications];

    if (filter?.types && filter.types.length > 0) {
      filtered = filtered.filter((n) => filter.types?.includes(n.type));
    }

    if (filter?.read !== undefined) {
      filtered = filtered.filter((n) => n.read === filter.read);
    }

    if (filter?.priority && filter.priority.length > 0) {
      filtered = filtered.filter((n) =>
        filter.priority?.includes(n.priority || "medium")
      );
    }

    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [localNotifications, filter, maxItems]);

  const handleMarkAsRead = React.useCallback(
    (id: string | number) => {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      onMarkAsRead?.(id);

      // Clear auto archive timer
      const timer = autoArchiveTimers.get(id);
      if (timer) {
        clearTimeout(timer);
        setAutoArchiveTimers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
      }
    },
    [onMarkAsRead, autoArchiveTimers]
  );

  // Auto archive unread notifications
  React.useEffect(() => {
    if (!autoArchive) return;

    const unreadNotifications = filteredNotifications.filter((n) => !n.read);

    unreadNotifications.forEach((notification) => {
      if (!autoArchiveTimers.has(notification.id)) {
        const timer = setTimeout(() => {
          handleMarkAsRead(notification.id);
        }, autoArchiveDelay);

        setAutoArchiveTimers((prev) =>
          new Map(prev).set(notification.id, timer)
        );
      }
    });

    return () => {
      autoArchiveTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [
    filteredNotifications,
    autoArchive,
    autoArchiveDelay,
    autoArchiveTimers,
    handleMarkAsRead,
  ]);

  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    if (!groupByDate) return null;

    const groups: Record<string, Notification[]> = {};

    filteredNotifications.forEach((notification) => {
      const date = format(new Date(notification.timestamp), dateFormat, {
        locale: id,
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return Object.entries(groups).map(([date, notifications]) => ({
      date,
      notifications,
    }));
  }, [filteredNotifications, groupByDate, dateFormat]);

  const handleMarkAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllAsRead?.();
  };

  const handleDismiss = (id: string | number) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    onDismiss?.(id);
  };

  const handleDismissAll = () => {
    setLocalNotifications([]);
    onDismissAll?.();
  };

  const handleDismissSelected = () => {
    setLocalNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const handleSelect = (id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const handleActionClick = (
    notification: Notification,
    actionLabel: string
  ) => {
    onActionClick?.(notification, actionLabel);
  };

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <NotificationSkeleton count={5} variant={variant} className={className} />
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
      >
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-destructive font-medium mb-2">
          Failed to load notifications
        </p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <NotificationEmpty
        message={emptyMessage}
        icon={emptyIcon}
        className={className}
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const NotificationWrapper = animated ? motion.div : "div";

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between mb-4",
          headerClassName
        )}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="outline" size="sm" onClick={handleDismissSelected}>
              <Trash2 className="h-4 w-4 mr-1" />
              Dismiss ({selectedIds.size})
            </Button>
          )}

          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}

          {filteredNotifications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSelectAll}>
                  <Checkbox
                    checked={selectedIds.size === filteredNotifications.length}
                    className="mr-2"
                  />
                  Select all
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDismissAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Dismiss all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <ScrollArea className="h-[500px] pr-4">
        <NotificationWrapper
          variants={containerVariants}
          initial={animated ? "hidden" : false}
          animate={animated ? "visible" : false}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {groupedNotifications
              ? groupedNotifications.map(({ date, notifications }) => (
                  <div key={date} className="space-y-2">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {date}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    </div>
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        variant={variant}
                        showTimestamp={showTimestamp}
                        showActions={showActions}
                        showDismiss={showDismiss}
                        isSelected={selectedIds.has(notification.id)}
                        onSelect={() => handleSelect(notification.id)}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        onDismiss={() => handleDismiss(notification.id)}
                        onClick={() => handleNotificationClick(notification)}
                        onActionClick={(actionLabel) =>
                          handleActionClick(notification, actionLabel)
                        }
                        className={itemClassName}
                        animated={animated}
                        variants={itemVariants}
                      />
                    ))}
                  </div>
                ))
              : filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    variant={variant}
                    showTimestamp={showTimestamp}
                    showActions={showActions}
                    showDismiss={showDismiss}
                    isSelected={selectedIds.has(notification.id)}
                    onSelect={() => handleSelect(notification.id)}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    onDismiss={() => handleDismiss(notification.id)}
                    onClick={() => handleNotificationClick(notification)}
                    onActionClick={(actionLabel) =>
                      handleActionClick(notification, actionLabel)
                    }
                    className={itemClassName}
                    animated={animated}
                    variants={itemVariants}
                  />
                ))}
          </AnimatePresence>
        </NotificationWrapper>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Export sub-components
export { NotificationItem } from "./notification-item";
export { NotificationSkeleton } from "./notification-skeleton";
export { NotificationEmpty } from "./notification-empty";
export { NotificationBadge } from "./notification-badge";
export { NotificationBell } from "./notification-bell";
