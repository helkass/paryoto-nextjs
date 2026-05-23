// components/checkbox-group/checkbox-card.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxCardProps } from "@/types/checkbox-group.types";

const sizeClasses = {
  sm: {
    padding: "p-3",
    gap: "gap-2",
    text: "text-sm",
    description: "text-xs",
    icon: "h-4 w-4",
    checkbox: "h-3.5 w-3.5",
  },
  md: {
    padding: "p-4",
    gap: "gap-3",
    text: "text-base",
    description: "text-sm",
    icon: "h-5 w-5",
    checkbox: "h-4 w-4",
  },
  lg: {
    padding: "p-5",
    gap: "gap-4",
    text: "text-lg",
    description: "text-base",
    icon: "h-6 w-6",
    checkbox: "h-5 w-5",
  },
};

export function CheckboxCard({
  option,
  isChecked,
  onChange,
  disabled = false,
  name,
  variant = "default",
  size = "md",
  className,
}: CheckboxCardProps) {
  const id = `checkbox-${name}-${option.value}`;

  const handleClick = () => {
    if (!disabled && !option.disabled) {
      onChange(!isChecked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Button variant
  if (variant === "button") {
    return (
      <div
        role="button"
        tabIndex={disabled || option.disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-pressed={isChecked}
        aria-disabled={disabled || option.disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isChecked
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
          (disabled || option.disabled) && "cursor-not-allowed opacity-50",
          size === "sm"
            ? "px-3 py-1.5 text-sm"
            : size === "lg"
            ? "px-6 py-3 text-base"
            : "px-4 py-2 text-sm",
          className
        )}
      >
        {option.icon && (
          <span className={sizeClasses[size].icon}>{option.icon}</span>
        )}
        {option.label}
        {isChecked && <span className="ml-1">✓</span>}
      </div>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <div
        className={cn(
          "relative flex cursor-pointer rounded-lg border-2 transition-all duration-200",
          "hover:shadow-md hover:border-primary/50",
          isChecked && "border-primary bg-primary/5 shadow-sm",
          (disabled || option.disabled) && "cursor-not-allowed opacity-50",
          sizeClasses[size].padding,
          className
        )}
        onClick={handleClick}
        role="checkbox"
        aria-checked={isChecked}
        aria-disabled={disabled || option.disabled}
        tabIndex={disabled || option.disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div className="flex w-full items-start gap-3">
          <Checkbox
            id={id}
            checked={isChecked}
            disabled={disabled || option.disabled}
            className={cn(
              "mt-0.5 pointer-events-none",
              sizeClasses[size].checkbox
            )}
          />
          <div className="flex-1">
            <div className={cn("font-medium", sizeClasses[size].text)}>
              {option.label}
            </div>
            {option.description && (
              <div
                className={cn(
                  "text-muted-foreground",
                  sizeClasses[size].description
                )}
              >
                {option.description}
              </div>
            )}
          </div>
          {option.icon && (
            <div
              className={cn("text-muted-foreground", sizeClasses[size].icon)}
            >
              {option.icon}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modern variant
  if (variant === "modern") {
    return (
      <div
        className={cn(
          "group relative flex cursor-pointer rounded-xl transition-all duration-300",
          "hover:scale-[1.02]",
          isChecked &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
          (disabled || option.disabled) && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleClick}
        role="checkbox"
        aria-checked={isChecked}
        aria-disabled={disabled || option.disabled}
        tabIndex={disabled || option.disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cn(
            "w-full rounded-xl border bg-gradient-to-br transition-all duration-300",
            isChecked
              ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5"
              : "border-border bg-card hover:border-primary/30",
            sizeClasses[size].padding
          )}
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <Checkbox
                id={id}
                checked={isChecked}
                disabled={disabled || option.disabled}
                className={cn(
                  "pointer-events-none",
                  sizeClasses[size].checkbox
                )}
              />
            </div>
            <div className="flex-1">
              <div className={cn("font-semibold", sizeClasses[size].text)}>
                {option.label}
              </div>
              {option.description && (
                <div
                  className={cn(
                    "text-muted-foreground",
                    sizeClasses[size].description
                  )}
                >
                  {option.description}
                </div>
              )}
            </div>
            {option.icon && (
              <div
                className={cn(
                  "text-muted-foreground transition-colors group-hover:text-primary",
                  sizeClasses[size].icon
                )}
              >
                {option.icon}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 transition-colors",
        (disabled || option.disabled) && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={handleClick}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled || option.disabled}
      tabIndex={disabled || option.disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <Checkbox
        id={id}
        checked={isChecked}
        disabled={disabled || option.disabled}
        className={cn("pointer-events-none", sizeClasses[size].checkbox)}
      />
      <div>
        <div
          className={cn(
            "text-sm font-medium leading-none",
            sizeClasses[size].text
          )}
        >
          {option.label}
        </div>
        {option.description && (
          <div
            className={cn(
              "text-xs text-muted-foreground",
              sizeClasses[size].description
            )}
          >
            {option.description}
          </div>
        )}
      </div>
    </div>
  );
}
