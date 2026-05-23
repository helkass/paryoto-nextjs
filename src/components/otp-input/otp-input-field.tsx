// components/otp-input/otp-input-field.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { OtpInputFieldProps } from "@/types/otp-input.types";

export function OtpInputField({
  index,
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  inputRef,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  isInputNum = true,
  isSecure = false,
  placeholder = "●",
  maskCharacter = "●",
  className,
}: OtpInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Take only the last character if multiple characters are pasted
    if (newValue.length > 1) {
      newValue = newValue.slice(-1);
    }

    // Filter non-numeric if isInputNum is true
    if (isInputNum && newValue && !/^\d+$/.test(newValue)) {
      return;
    }

    onChange(newValue, index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown(e, index);
  };

  const displayValue = isSecure && value ? maskCharacter : value;

  return (
    <input
      ref={inputRef}
      type={isSecure ? "password" : isInputNum ? "tel" : "text"}
      inputMode={isInputNum ? "numeric" : "text"}
      maxLength={1}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus(index)}
      onBlur={onBlur}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus && index === 0}
      placeholder={placeholder}
      className={cn(
        "h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-medium",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "read-only:cursor-default",
        className
      )}
    />
  );
}
