// components/form-section/form-section.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSectionProps } from "@/types/form-section.types";

const sizeClasses = {
  sm: {
    header: "py-2 px-3",
    title: "text-sm",
    description: "text-xs",
    icon: "h-4 w-4",
    badge: "text-xs px-1.5 py-0.5",
  },
  md: {
    header: "py-3 px-4",
    title: "text-base",
    description: "text-sm",
    icon: "h-5 w-5",
    badge: "text-xs px-2 py-0.5",
  },
  lg: {
    header: "py-4 px-5",
    title: "text-lg",
    description: "text-base",
    icon: "h-6 w-6",
    badge: "text-sm px-2.5 py-1",
  },
};

const variantClasses = {
  default: "rounded-lg border bg-card",
  card: "rounded-xl border bg-card shadow-sm",
  borderless: "border-0 bg-transparent",
};

const badgeVariants = {
  default: "bg-muted text-muted-foreground",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function FormSection({
  title,
  description,
  icon,
  children,
  defaultOpen = true,
  isOpen: controlledOpen,
  onOpenChange,
  collapsible = true,
  required = false,
  disabled = false,
  variant = "default",
  size = "md",
  actions,
  showDivider = true,
  className,
  headerClassName,
  contentClassName,
  loading = false,
  error,
  badge,
  onToggle,
}: FormSectionProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (!collapsible || disabled) return;

    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    onToggle?.(newOpen);
  };

  if (loading) {
    return (
      <div className={cn(variantClasses[variant], className)}>
        <div
          className={cn(
            "flex items-center justify-between",
            sizeClasses[size].header
          )}
        >
          <div className="flex items-center gap-2">
            {icon && (
              <Skeleton className={cn("rounded", sizeClasses[size].icon)} />
            )}
            <div>
              <Skeleton
                className={cn("h-4 w-32", size === "sm" ? "h-3" : "h-5")}
              />
              {description && <Skeleton className="mt-1 h-3 w-48" />}
            </div>
          </div>
        </div>
        <div className={cn("space-y-3 p-4", contentClassName)}>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          variantClasses[variant],
          "border-destructive/50",
          className
        )}
      >
        <div
          className={cn("flex items-center gap-2", sizeClasses[size].header)}
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <div className="font-medium text-destructive">Error</div>
            <div className="text-sm text-destructive/70">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        disabled && "opacity-60",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-start justify-between gap-3",
          collapsible &&
            "cursor-pointer select-none hover:bg-muted/30 transition-colors",
          sizeClasses[size].header,
          headerClassName
        )}
        onClick={handleToggle}
      >
        <div className="flex flex-1 items-start gap-3">
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                "shrink-0 text-muted-foreground",
                sizeClasses[size].icon
              )}
            >
              {icon}
            </div>
          )}

          {/* Title and description */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn("font-semibold", sizeClasses[size].title)}>
                {title}
                {required && <span className="ml-1 text-destructive">*</span>}
              </h3>
              {badge && (
                <span
                  className={cn(
                    "rounded-full font-medium",
                    badgeVariants[badge.variant || "default"],
                    sizeClasses[size].badge
                  )}
                >
                  {badge.text}
                </span>
              )}
            </div>
            {description && (
              <p
                className={cn(
                  "text-muted-foreground",
                  sizeClasses[size].description
                )}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions and toggle button */}
        <div className="flex items-center gap-2 shrink-0">
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          {collapsible && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              disabled={disabled}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Divider */}
      {showDivider && isOpen && <div className="border-t" />}

      {/* Content */}
      {isOpen && (
        <div className={cn("p-4 pt-3", contentClassName)}>{children}</div>
      )}
    </div>
  );
}
