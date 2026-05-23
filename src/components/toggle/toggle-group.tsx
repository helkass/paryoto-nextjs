// components/toggle/toggle-group.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToggleGroupProps, ToggleOption } from "@/types/toggle.types";

const sizeClasses = {
  sm: {
    button: "px-2 py-1 text-sm",
    gap: "gap-1",
  },
  md: {
    button: "px-3 py-1.5 text-sm",
    gap: "gap-2",
  },
  lg: {
    button: "px-4 py-2 text-base",
    gap: "gap-3",
  },
};

export function ToggleGroup({
  value,
  onChange,
  options,
  mode = "single",
  disabled = false,
  size = "md",
  className,
}: ToggleGroupProps) {
  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    if (mode === "single") {
      // Single select mode
      const newValue = value === optionValue ? "" : optionValue;
      onChange(newValue);
    } else {
      // Multiple select mode
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(optionValue)
        ? currentValue.filter((v) => v !== optionValue)
        : [...currentValue, optionValue];
      onChange(newValue);
    }
  };

  const isSelected = (optionValue: string): boolean => {
    if (mode === "single") {
      return value === optionValue;
    }
    return Array.isArray(value) && value.includes(optionValue);
  };

  return (
    <div className={cn("flex flex-wrap", sizeClasses[size].gap, className)}>
      {options.map((option) => {
        const selected = isSelected(option.value);

        return (
          <Button
            key={option.value}
            type="button"
            variant={selected ? "default" : "outline"}
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
            onClick={() => handleToggle(option.value)}
            disabled={disabled || option.disabled}
            className={cn(
              "transition-all duration-200",
              selected && "shadow-sm",
              sizeClasses[size].button,
              option.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
