// components/notification/notification-badge.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NotificationBadgeProps } from "@/types/notification.types";

const variantClasses = {
  default: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  primary: "bg-primary text-primary-foreground",
};

export function NotificationBadge({
  count,
  max = 99,
  className,
  variant = "default",
  showZero = false,
}: NotificationBadgeProps) {
  if (!showZero && count === 0) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <AnimatePresence>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={cn(
          "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium",
          variantClasses[variant],
          className
        )}
      >
        {displayCount}
      </motion.span>
    </AnimatePresence>
  );
}
