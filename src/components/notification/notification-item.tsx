// components/notification/notification-item.tsx
"use client";

import * as React from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  CheckCheck,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Notification } from "@/types/notification.types";

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  primary: Bell,
};

const typeColors = {
  info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  success:
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  primary: "bg-primary/10 text-primary",
};

const priorityColors = {
  low: "border-l-green-500",
  medium: "border-l-yellow-500",
  high: "border-l-red-500",
};

interface NotificationItemProps {
  notification: Notification;
  variant?: "default" | "compact" | "card" | "popover";
  showTimestamp?: boolean;
  showActions?: boolean;
  showDismiss?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onMarkAsRead?: () => void;
  onDismiss?: () => void;
  onClick?: () => void;
  onActionClick?: (actionLabel: string) => void;
  className?: string;
  animated?: boolean;
  variants?: Record<string, TargetAndTransition>;
}

export function NotificationItem({
  notification,
  variant = "default",
  showTimestamp = true,
  showActions = true,
  showDismiss = true,
  isSelected = false,
  onSelect,
  onMarkAsRead,
  onDismiss,
  onClick,
  onActionClick,
  className,
  animated = true,
  variants,
}: NotificationItemProps) {
  const Icon = notification.icon
    ? () => <>{notification.icon}</>
    : typeIcons[notification.type];
  const typeColor = typeColors[notification.type];
  const priorityColor = notification.priority
    ? priorityColors[notification.priority]
    : "";

  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), {
    addSuffix: true,
    locale: id,
  });

  const formattedTime = format(new Date(notification.timestamp), "HH:mm", {
    locale: id,
  });
  const formattedDate = format(
    new Date(notification.timestamp),
    "dd MMM yyyy",
    { locale: id }
  );

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  const handleActionClick = (actionLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onActionClick?.(actionLabel);
  };

  const ItemWrapper = animated && variants ? motion.div : "div";
  const itemProps = animated && variants ? { variants, layout: true } : {};

  // Compact variant
  if (variant === "compact") {
    return (
      <ItemWrapper
        {...itemProps}
        className={cn(
          "group relative flex items-start gap-3 p-3 rounded-lg transition-all",
          !notification.read && "bg-muted/50",
          onClick && "cursor-pointer hover:bg-muted",
          priorityColor,
          className
        )}
        onClick={onClick}
      >
        {onSelect && (
          <div className="shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          </div>
        )}

        <div className={cn("p-1.5 rounded-full shrink-0", typeColor)}>
          <Icon className="h-3 w-3" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          {notification.message && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {notification.message}
            </p>
          )}
          {showTimestamp && (
            <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
          )}
        </div>

        {!notification.read && onMarkAsRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={handleMarkAsRead}
          >
            <CheckCheck className="h-3 w-3" />
          </Button>
        )}

        {showDismiss && onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </ItemWrapper>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <ItemWrapper
        {...itemProps}
        className={cn(
          "group relative rounded-xl border overflow-hidden transition-all",
          !notification.read && "bg-muted/30 border-primary/30",
          onClick && "cursor-pointer hover:shadow-md",
          className
        )}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {onSelect && (
              <div
                className="shrink-0 pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox checked={isSelected} onCheckedChange={onSelect} />
              </div>
            )}

            <div className={cn("p-2 rounded-full shrink-0", typeColor)}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={cn(
                    "text-sm",
                    !notification.read && "font-semibold"
                  )}
                >
                  {notification.title}
                </h4>
                {showTimestamp && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {timeAgo}
                  </span>
                )}
              </div>

              {notification.message && (
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              )}

              {showActions &&
                notification.actions &&
                notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {notification.actions.map((action, idx) => (
                      <Button
                        key={idx}
                        variant={action.variant || "outline"}
                        size="sm"
                        onClick={(e) => handleActionClick(action.label, e)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!notification.read && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleMarkAsRead}
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              {showDismiss && onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </ItemWrapper>
    );
  }

  // Popover variant
  if (variant === "popover") {
    return (
      <ItemWrapper
        {...itemProps}
        className={cn(
          "group flex items-start gap-3 p-3 rounded-lg transition-all",
          !notification.read && "bg-muted/30",
          onClick && "cursor-pointer hover:bg-muted",
          className
        )}
        onClick={onClick}
      >
        <div className={cn("p-1.5 rounded-full shrink-0", typeColor)}>
          <Icon className="h-3 w-3" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("text-sm", !notification.read && "font-semibold")}>
              {notification.title}
            </p>
            {showTimestamp && (
              <span className="text-xs text-muted-foreground shrink-0">
                {formattedTime}
              </span>
            )}
          </div>
          {notification.message && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {notification.message}
            </p>
          )}
        </div>

        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
        )}
      </ItemWrapper>
    );
  }

  // Default variant
  return (
    <ItemWrapper
      {...itemProps}
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-lg border transition-all",
        !notification.read && "bg-muted/50 border-primary/20",
        onClick && "cursor-pointer hover:bg-muted",
        priorityColor,
        className
      )}
      onClick={onClick}
    >
      {onSelect && (
        <div className="shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </div>
      )}

      <div className={cn("p-2 rounded-full shrink-0", typeColor)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h4 className={cn("text-sm", !notification.read && "font-semibold")}>
            {notification.title}
          </h4>
          {showTimestamp && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
              <span title={formattedDate}>{timeAgo}</span>
            </div>
          )}
        </div>

        {notification.message && (
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
        )}

        {notification.metadata &&
          Object.keys(notification.metadata).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(notification.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="text-xs bg-muted px-2 py-0.5 rounded"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}

        {showActions &&
          notification.actions &&
          notification.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={(e) => handleActionClick(action.label, e)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!notification.read && onMarkAsRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <CheckCheck className="h-4 w-4" />
          </Button>
        )}
        {showDismiss && onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDismiss}
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </ItemWrapper>
  );
}
