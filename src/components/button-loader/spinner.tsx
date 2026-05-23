// components/button-loader/spinner.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SpinnerProps } from "@/types/button-loader.types";

const sizeClasses = {
  sm: {
    border: "h-3 w-3 border-2",
    grow: "h-3 w-3",
    dots: "h-1 w-1",
  },
  md: {
    border: "h-4 w-4 border-2",
    grow: "h-4 w-4",
    dots: "h-1.5 w-1.5",
  },
  lg: {
    border: "h-5 w-5 border-2",
    grow: "h-5 w-5",
    dots: "h-2 w-2",
  },
};

export function Spinner({
  size = "md",
  type = "border",
  className,
}: SpinnerProps) {
  if (type === "grow") {
    return (
      <div
        className={cn(
          "animate-ping rounded-full bg-current opacity-75",
          sizeClasses[size].grow,
          className
        )}
      />
    );
  }

  if (type === "dots") {
    return (
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "animate-bounce rounded-full bg-current",
              sizeClasses[size].dots,
              className
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-current border-t-transparent",
        sizeClasses[size].border,
        className
      )}
    />
  );
}
