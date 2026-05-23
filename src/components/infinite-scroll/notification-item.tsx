// components/infinite-scroll/notification-item.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Bell, MessageSquare, ShoppingBag, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: number) => void;
}

const iconMap = {
  info: Bell,
  success: MessageSquare,
  warning: AlertCircle,
  error: ShoppingBag,
};

const colorMap = {
  info: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
  success: "text-green-500 bg-green-50 dark:bg-green-950/20",
  warning: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
  error: "text-red-500 bg-red-50 dark:bg-red-950/20",
};

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type];
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: id,
  });

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md",
        notification.read ? "bg-background" : "bg-primary/5 border-primary/20"
      )}
      onClick={() => onRead?.(notification.id)}
    >
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-lg", colorMap[notification.type])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm truncate">
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
