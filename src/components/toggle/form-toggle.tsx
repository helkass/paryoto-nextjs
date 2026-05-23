// components/toggle/form-toggle.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ToggleSwitch } from "./toggle-switch";
import { ToggleGroup } from "./toggle-group";
import { ToggleProps } from "@/types/toggle.types";

export function FormToggle({
  value,
  onChange,
  mode = "single",
  options,
  label,
  description,
  leftLabel,
  rightLabel,
  required = false,
  disabled = false,
  readOnly = false,
  size = "md",
  className,
  switchClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
  onToggle,
}: ToggleProps) {
  const handleSingleToggle = (checked: boolean) => {
    if (readOnly) return;
    onChange?.(checked);
    onToggle?.(checked);
  };

  const handleMultipleToggle = (newValue: string | string[]) => {
    if (readOnly) return;
    onChange?.(newValue);
  };

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}
        <div className="space-y-2">
          <div className="h-5 w-9 animate-pulse bg-muted rounded-full" />
          {description && (
            <div className="h-3 w-48 animate-pulse bg-muted rounded" />
          )}
        </div>
      </div>
    );
  }

  // Single toggle mode (boolean)
  if (mode === "single") {
    const checked = typeof value === "boolean" ? value : false;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}

        <div className="flex items-center gap-4">
          {leftLabel && (
            <span
              className={cn(
                "text-muted-foreground transition-colors",
                !checked && "text-foreground font-medium",
                size === "sm"
                  ? "text-sm"
                  : size === "lg"
                  ? "text-base"
                  : "text-sm"
              )}
            >
              {leftLabel}
            </span>
          )}

          <ToggleSwitch
            checked={checked}
            onChange={handleSingleToggle}
            disabled={disabled || readOnly}
            size={size}
            className={switchClassName}
          />

          {rightLabel && (
            <span
              className={cn(
                "text-muted-foreground transition-colors",
                checked && "text-foreground font-medium",
                size === "sm"
                  ? "text-sm"
                  : size === "lg"
                  ? "text-base"
                  : "text-sm"
              )}
            >
              {rightLabel}
            </span>
          )}
        </div>

        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // Multiple toggle mode (string array)
  if (mode === "multiple" && options) {
    const currentValue =
      typeof value === "string" || Array.isArray(value) ? value : [];

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}

        <ToggleGroup
          value={currentValue}
          onChange={handleMultipleToggle}
          options={options}
          mode={mode}
          disabled={disabled || readOnly}
          size={size}
        />

        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return null;
}
