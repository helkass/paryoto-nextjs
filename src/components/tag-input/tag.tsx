// components/tag-input/tag.tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagComponentProps } from "@/types/tag-input.types";

const sizeClasses = {
  sm: {
    tag: "px-2 py-0.5 text-xs gap-1",
    icon: "h-3 w-3",
  },
  md: {
    tag: "px-2.5 py-1 text-sm gap-1.5",
    icon: "h-3.5 w-3.5",
  },
  lg: {
    tag: "px-3 py-1.5 text-base gap-2",
    icon: "h-4 w-4",
  },
};

const variantClasses = {
  default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background hover:bg-muted",
  filled: "bg-primary/10 text-primary hover:bg-primary/20",
  modern:
    "bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 text-primary hover:border-primary/40",
};

export function Tag({
  tag,
  onRemove,
  disabled = false,
  size = "md",
  variant = "default",
  className,
}: TagComponentProps) {
  if (disabled) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full transition-colors",
          sizeClasses[size].tag,
          variantClasses[variant],
          "cursor-default opacity-60",
          className
        )}
      >
        {tag.icon && <span className={sizeClasses[size].icon}>{tag.icon}</span>}
        <span>{tag.label}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full transition-colors group",
        sizeClasses[size].tag,
        variantClasses[variant],
        className
      )}
    >
      {tag.icon && <span className={sizeClasses[size].icon}>{tag.icon}</span>}
      <span>{tag.label}</span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10",
          sizeClasses[size].icon
        )}
        aria-label={`Remove ${tag.label}`}
      >
        <X className={sizeClasses[size].icon} />
      </button>
    </span>
  );
}
