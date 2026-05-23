// components/autocomplete/autocomplete-input.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AutoCompleteInputProps } from "@/types/autocomplete.types";

export function AutoCompleteInput({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = "Search...",
  disabled = false,
  readOnly = false,
  className,
}: AutoCompleteInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={cn("pl-9 pr-8", className)}
      />
      {value && !disabled && !readOnly && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
