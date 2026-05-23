// components/radio-group/form-radio-group.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioCard } from "./radio-card";
import { RadioGroupProps } from "@/types/radio-group.types";

const layoutClasses = {
  horizontal: "flex flex-row flex-wrap gap-4",
  vertical: "flex flex-col gap-3",
  grid: "grid",
};

const gridColumns = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function FormRadioGroup({
  value,
  onChange,
  options,
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  layout = "vertical",
  columns = 2,
  variant = "default",
  size = "md",
  className,
  radioClassName,
  labelClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    if (readOnly) return;
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const generateName = React.useId();

  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
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
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getLayoutClass = () => {
    if (layout === "grid") {
      return cn(layoutClasses.grid, gridColumns[columns]);
    }
    return layoutClasses[layout];
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label
          className={cn(
            required
              ? "after:content-['*'] after:ml-0.5 after:text-red-500"
              : "",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      <div
        className={cn(
          getLayoutClass(),
          variant === "button" && "inline-flex flex-wrap gap-2"
        )}
        role="radiogroup"
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {options.map((option) => (
          <RadioCard
            key={option.value}
            option={option}
            isSelected={selectedValue === option.value}
            onChange={handleChange}
            disabled={disabled}
            name={generateName}
            variant={
              variant === "card" || variant === "button" || variant === "modern"
                ? variant
                : undefined
            }
            size={size}
            className={radioClassName}
          />
        ))}
      </div>

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
