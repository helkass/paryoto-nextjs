// components/slider/slider-input.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SliderInputProps } from "@/types/slider.types";

export function SliderInput({
  value,
  onChange,
  min,
  max,
  step,
  disabled = false,
  unit,
  className,
}: SliderInputProps) {
  const [inputValue, setInputValue] = React.useState(value.toString());

  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    let numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      numValue = min;
    }
    numValue = Math.max(min, Math.min(max, numValue));

    // Round to nearest step
    const steppedValue = Math.round(numValue / step) * step;
    onChange(steppedValue);
    setInputValue(steppedValue.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative flex-1 min-w-0">
        <Input
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            "w-full text-center pr-10",
            "focus:ring-1 focus:ring-primary",
            "placeholder:text-muted-foreground",
            disabled && "bg-muted/50 cursor-not-allowed",
            className
          )}
          placeholder="0"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none select-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
