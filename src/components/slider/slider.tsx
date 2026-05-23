// components/slider/slider.tsx
"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { SliderInput } from "./slider-input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SliderProps } from "@/types/slider.types";

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  mode = "single",
  label,
  description,
  unit,
  formatValue,
  required = false,
  disabled = false,
  readOnly = false,
  showInput = true,
  showMarks = false,
  showTooltip = true,
  showMinMax = true,
  marks,
  className,
  sliderClassName,
  inputClassName,
  loading = false,
  error,
  onValueChangeEnd,
}: SliderProps) {
  const [localValue, setLocalValue] = React.useState<number | [number, number]>(
    value !== undefined ? value : mode === "single" ? min : [min, max]
  );
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    if (readOnly || disabled) return;

    const updatedValue =
      mode === "single"
        ? newValue[0]
        : ([newValue[0], newValue[1]] as [number, number]);
    setLocalValue(updatedValue);
    onChange?.(updatedValue);
  };

  const handleValueCommit = (newValue: number[]) => {
    const committedValue =
      mode === "single"
        ? newValue[0]
        : ([newValue[0], newValue[1]] as [number, number]);
    onValueChangeEnd?.(committedValue);
  };

  const handleInputChange = (inputValue: number) => {
    if (mode === "single") {
      const newValue = Math.max(min, Math.min(max, inputValue));
      const steppedValue = Math.round(newValue / step) * step;
      setLocalValue(steppedValue);
      onChange?.(steppedValue);
      onValueChangeEnd?.(steppedValue);
    }
  };
  const handleRangeInputChange = (index: 0 | 1, inputValue: number) => {
    if (mode === "range" && Array.isArray(localValue)) {
      const newValue: [number, number] = [...localValue];
      newValue[index] = Math.max(min, Math.min(max, inputValue));
      newValue[index] = Math.round(newValue[index] / step) * step;

      // Ensure min <= max
      if (index === 0 && newValue[0] > newValue[1]) {
        newValue[0] = newValue[1];
      }
      if (index === 1 && newValue[1] < newValue[0]) {
        newValue[1] = newValue[0];
      }

      setLocalValue(newValue);
      onChange?.(newValue);
      onValueChangeEnd?.(newValue);
    }
  };

  const getDisplayValue = (val: number): string => {
    if (formatValue) return formatValue(val);
    if (unit) return `${val}${unit}`;
    return val.toString();
  };

  const sliderValue =
    mode === "single"
      ? [localValue as number]
      : Array.isArray(localValue)
      ? [localValue[0], localValue[1]]
      : [min, max];

  if (loading) {
    return (
      <div className="space-y-2">
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
        <div className="space-y-3">
          <div className="h-5 w-full animate-pulse bg-muted rounded" />
          {showInput && (
            <div className="h-9 w-24 animate-pulse bg-muted rounded" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
          {showMinMax && mode === "single" && (
            <span className="text-xs text-muted-foreground">
              Range: {getDisplayValue(min)} - {getDisplayValue(max)}
            </span>
          )}
        </div>
      )}{" "}
      {/* Slider */}
      <div className={cn("relative pt-6", sliderClassName)}>
        <TooltipProvider>
          <SliderPrimitive.Root
            value={sliderValue}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            min={min}
            max={max}
            step={step}
            disabled={disabled || readOnly}
            className={cn(
              "relative flex w-full touch-none select-none items-center",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
          >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className={cn(
                "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                !disabled && "cursor-grab active:cursor-grabbing"
              )}
            />
            {mode === "range" && (
              <SliderPrimitive.Thumb
                className={cn(
                  "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  !disabled && "cursor-grab active:cursor-grabbing"
                )}
              />
            )}
          </SliderPrimitive.Root>{" "}
          {/* Tooltip */}
          {showTooltip && mode === "single" && isDragging && (
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-lg whitespace-nowrap pointer-events-none z-50 transition-opacity"
              style={{
                transform: `translateX(-50%) translateY(-100%)`,
                left: `calc(${
                  (((localValue as number) - min) / (max - min)) * 100
                }%)`,
              }}
            >
              {getDisplayValue(localValue as number)}
              {/* Arrow */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary"
                style={{
                  width: 0,
                  height: 0,
                }}
              />
            </div>
          )}
        </TooltipProvider>

        {/* Marks */}
        {showMarks && marks && marks.length > 0 && (
          <div className="relative mt-2">
            <div className="absolute left-0 right-0 flex justify-between">
              {marks.map((mark) => {
                const position = ((mark.value - min) / (max - min)) * 100;
                return (
                  <div
                    key={mark.value}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <div className="h-1.5 w-px bg-border" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {mark.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>{" "}
      {/* Input fields */}
      {showInput && (
        <div className="flex items-center gap-4 pt-2 mt-10">
          {mode === "single" ? (
            <div className="w-32">
              <SliderInput
                value={localValue as number}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={step}
                disabled={disabled || readOnly}
                unit={unit}
                formatValue={formatValue}
                className={inputClassName}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-32">
                <SliderInput
                  value={(localValue as [number, number])[0]}
                  onChange={(val) => handleRangeInputChange(0, val)}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled || readOnly}
                  unit={unit}
                  formatValue={formatValue}
                  className={inputClassName}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                to
              </span>
              <div className="w-32">
                <SliderInput
                  value={(localValue as [number, number])[1]}
                  onChange={(val) => handleRangeInputChange(1, val)}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled || readOnly}
                  unit={unit}
                  formatValue={formatValue}
                  className={inputClassName}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Description */}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
