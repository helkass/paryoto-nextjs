// components/radio-group/radio-card.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RadioCardProps } from "@/types/radio-group.types";

const sizeClasses = {
  sm: {
    padding: "p-3",
    gap: "gap-2",
    text: "text-sm",
    description: "text-xs",
    icon: "h-4 w-4",
  },
  md: {
    padding: "p-4",
    gap: "gap-3",
    text: "text-base",
    description: "text-sm",
    icon: "h-5 w-5",
  },
  lg: {
    padding: "p-5",
    gap: "gap-4",
    text: "text-lg",
    description: "text-base",
    icon: "h-6 w-6",
  },
};

export function RadioCard({
  option,
  isSelected,
  onChange,
  disabled = false,
  name,
  variant = "card",
  size = "md",
  className,
}: RadioCardProps) {
  const id = `radio-${name}-${option.value}`;

  const handleChange = () => {
    if (!disabled && !option.disabled) {
      onChange(option.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleChange();
    }
  };

  // Card variant
  if (variant === "card") {
    return (
      <label
        htmlFor={id}
        className={cn(
          "relative flex cursor-pointer rounded-lg border-2 transition-all duration-200",
          "hover:shadow-md hover:border-primary/50",
          isSelected && "border-primary bg-primary/5 shadow-sm",
          (disabled || option.disabled) && "cursor-not-allowed opacity-50",
          sizeClasses[size].padding,
          className
        )}
      >
        <div className="flex w-full items-start gap-3">
          <input
            type="radio"
            id={id}
            name={name}
            value={option.value}
            checked={isSelected}
            onChange={handleChange}
            disabled={disabled || option.disabled}
            className="sr-only"
          />
          <div
            className={cn(
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              isSelected ? "border-primary" : "border-muted-foreground"
            )}
          >
            {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
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
      </label>
    );
  }

  // Button variant
  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleChange}
        disabled={disabled || option.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSelected
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
        {option.icon && <span className="mr-2">{option.icon}</span>}
        {option.label}
      </button>
    );
  }

  // Modern variant
  if (variant === "modern") {
    return (
      <label
        htmlFor={id}
        className={cn(
          "group relative flex cursor-pointer rounded-xl transition-all duration-300",
          "hover:scale-[1.02]",
          isSelected &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
          (disabled || option.disabled) && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div
          className={cn(
            "w-full rounded-xl border bg-gradient-to-br transition-all duration-300",
            isSelected
              ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5"
              : "border-border bg-card hover:border-primary/30",
            sizeClasses[size].padding
          )}
        >
          <input
            type="radio"
            id={id}
            name={name}
            value={option.value}
            checked={isSelected}
            onChange={handleChange}
            disabled={disabled || option.disabled}
            className="sr-only"
          />
          <div className="flex items-start gap-3">
            <div className="relative">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                  isSelected ? "border-primary" : "border-muted-foreground"
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </div>
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
      </label>
    );
  }

  // Default variant
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 transition-colors",
        (disabled || option.disabled) && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={option.value}
        checked={isSelected}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || option.disabled}
        className={cn(
          "h-4 w-4 shrink-0 cursor-pointer border border-muted-foreground text-primary",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
          disabled && "cursor-not-allowed"
        )}
      />
      <div>
        <div
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}
        >
          {option.label}
        </div>
        {option.description && (
          <div className="text-xs text-muted-foreground">
            {option.description}
          </div>
        )}
      </div>
    </label>
  );
}
