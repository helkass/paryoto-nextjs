// components/page-loader/spinner.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SpinnerProps } from "@/types/page-loader.types";

const sizeClasses = {
  sm: "h-8 w-8 border-2",
  md: "h-12 w-12 border-3",
  lg: "h-16 w-16 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-primary border-r-transparent border-b-primary border-l-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}
