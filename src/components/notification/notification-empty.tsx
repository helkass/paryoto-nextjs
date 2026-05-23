// components/notification/notification-empty.tsx
"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BellOff } from "lucide-react";

interface NotificationEmptyProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
}

export function NotificationEmpty({
  message = "No notifications",
  icon,
  className,
}: NotificationEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {icon || <BellOff className="h-12 w-12 text-muted-foreground mb-4" />}
      <p className="text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground mt-1">
        When you receive notifications, they will appear here
      </p>
    </div>
  );
}
