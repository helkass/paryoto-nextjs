// components/toggle/toggle-switch.tsx
"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ToggleSwitchProps } from "@/types/toggle.types";

const sizeClasses = {
  sm: {
    switch: "h-4 w-7",
    thumb: "data-[state=checked]:translate-x-3",
    label: "text-sm",
  },
  md: {
    switch: "h-5 w-9",
    thumb: "data-[state=checked]:translate-x-4",
    label: "text-sm",
  },
  lg: {
    switch: "h-6 w-11",
    thumb: "data-[state=checked]:translate-x-5",
    label: "text-base",
  },
};

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  className,
}: ToggleSwitchProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          sizeClasses[size].switch,
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      {label && (
        <span className={cn("text-muted-foreground", sizeClasses[size].label)}>
          {label}
        </span>
      )}
    </div>
  );
}
