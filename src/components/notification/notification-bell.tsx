// components/notification/notification-bell.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NotificationBellProps } from "@/types/notification.types";
import { NotificationList } from "./notification-list";
import { NotificationBadge } from "./notification-badge";

export function NotificationBell({
  notifications,
  onOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      onOpen?.();
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      onClose?.();
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    onViewAll?.();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
        >
          <motion.div
            animate={
              isAnimating
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, -10, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            {hasUnread ? (
              <BellRing className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </motion.div>
          {unreadCount > 0 && (
            <NotificationBadge
              count={unreadCount}
              className="absolute -top-1 -right-1"
            />
          )}
        </Button>
      </PopoverTrigger>{" "}
      <PopoverContent
        className="w-[420px] max-w-[90vw] p-0"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 border-b bg-background">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold truncate">Notifications</h4>
            {unreadCount > 0 && onMarkAllAsRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs whitespace-nowrap flex-shrink-0"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] pl-2 overflow-y-auto no-scrollbar">
          <NotificationList
            notifications={notifications.slice(0, 10)}
            variant="popover"
            showTimestamp={true}
            showActions={false}
            showDismiss={false}
            onMarkAsRead={onMarkAsRead}
            emptyMessage="No notifications"
          />
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="sticky bottom-0 p-2 border-t bg-background">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={handleViewAll}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
