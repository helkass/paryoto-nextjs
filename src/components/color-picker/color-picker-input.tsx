// components/color-picker/color-picker-input.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ColorFormat } from "@/types/color-picker.types";

interface ColorPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  format: ColorFormat;
  disabled?: boolean;
  className?: string;
}

export function ColorPickerInput({
  value,
  onChange,
  format,
  disabled,
  className,
}: ColorPickerInputProps) {
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBlur = () => {
    onChange(inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange(inputValue);
    }
  };

  let placeholder = "";
  switch (format) {
    case "hex":
      placeholder = "#000000";
      break;
    case "hex8":
      placeholder = "#00000000";
      break;
    case "rgb":
      placeholder = "rgb(0, 0, 0)";
      break;
    case "rgba":
      placeholder = "rgba(0, 0, 0, 1)";
      break;
    case "hsl":
      placeholder = "hsl(0, 0%, 0%)";
      break;
    case "hsla":
      placeholder = "hsla(0, 0%, 0%, 1)";
      break;
  }

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={cn("font-mono text-sm", className)}
    />
  );
}
