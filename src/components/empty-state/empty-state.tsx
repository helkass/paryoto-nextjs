// components/empty-state/empty-state.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmptyStateIllustration } from "./empty-state-illustration";
import { EmptyStateProps } from "@/types/empty-state.types";

const sizeClasses = {
  sm: {
    container: "py-8 px-4",
    icon: "h-10 w-10",
    title: "text-base",
    description: "text-sm",
    button: "default",
  },
  md: {
    container: "py-12 px-6",
    icon: "h-14 w-14",
    title: "text-lg",
    description: "text-sm",
    button: "default",
  },
  lg: {
    container: "py-16 px-8",
    icon: "h-20 w-20",
    title: "text-2xl",
    description: "text-base",
    button: "lg",
  },
};

const variantClasses = {
  default: "bg-transparent",
  card: "rounded-lg border bg-card shadow-sm",
  minimal: "bg-transparent border-0 shadow-none",
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  size = "md",
  variant = "default",
  showIllustration = false,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  children,
}: EmptyStateProps) {
  const IconComponent = icon as unknown as React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center text-center",
        sizeClasses[size].container,
        variantClasses[variant],
        className
      )}
    >
      {/* Icon / Illustration */}
      <div className="mb-4">
        {showIllustration ? (
          <EmptyStateIllustration
            type="data"
            className={cn(sizeClasses[size].icon, iconClassName)}
          />
        ) : IconComponent ? (
          <div
            className={cn(
              "text-muted-foreground",
              sizeClasses[size].icon,
              iconClassName
            )}
          >
            <IconComponent className="h-full w-full" strokeWidth={1.5} />
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h3
        className={cn("font-semibold", sizeClasses[size].title, titleClassName)}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "mt-1 text-muted-foreground",
            sizeClasses[size].description,
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction || children) && (
        <div
          className={cn(
            "mt-4 flex flex-wrap items-center justify-center gap-3",
            actionsClassName
          )}
        >
          {secondaryAction && (
            <Button
              variant="outline"
              size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.icon && (
                <span className="mr-2">{secondaryAction.icon}</span>
              )}
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant={action.variant || "default"}
              size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
          {children}
        </div>
      )}
    </motion.div>
  );
}
