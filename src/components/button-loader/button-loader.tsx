// components/button-loader/button-loader.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { ButtonLoaderProps } from "@/types/button-loader.types";

const loaderSizeMap = {
  sm: "sm",
  default: "md",
  lg: "lg",
  icon: "md",
};

export function ButtonLoader({
  loading = false,
  children,
  variant = "default",
  size = "default",
  loaderPosition = "left",
  loaderText,
  loaderSize = "md",
  spinnerType = "border",
  icon,
  iconPosition = "left",
  disabled = false,
  fullWidth = false,
  preventMultipleClicks = true,
  className,
  loaderClassName,
  onClick,
  ...props
}: ButtonLoaderProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isDisabled = disabled || loading || internalLoading;

  const actualLoaderSize = loaderSize || loaderSizeMap[size];

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    if (preventMultipleClicks && loading) return;

    try {
      if (onClick) {
        const result = onClick(e);
        if (result instanceof Promise) {
          setInternalLoading(true);
          await result;
          setInternalLoading(false);
        }
      }
    } catch (error) {
      console.error("Button action failed:", error);
      setInternalLoading(false);
    }
  };

  const isLoading = loading || internalLoading;

  // Render content based on loader position
  const renderContent = () => {
    if (isLoading && loaderPosition === "replace") {
      return (
        <span className="flex items-center gap-2">
          <Spinner
            size={actualLoaderSize}
            type={spinnerType}
            className={loaderClassName}
          />
          {loaderText && <span>{loaderText}</span>}
        </span>
      );
    }

    if (isLoading && loaderPosition === "left") {
      return (
        <span className="flex items-center gap-2">
          <Spinner
            size={actualLoaderSize}
            type={spinnerType}
            className={loaderClassName}
          />
          <span>{children}</span>
        </span>
      );
    }

    if (isLoading && loaderPosition === "right") {
      return (
        <span className="flex items-center gap-2">
          <span>{children}</span>
          <Spinner
            size={actualLoaderSize}
            type={spinnerType}
            className={loaderClassName}
          />
        </span>
      );
    }

    // Not loading
    if (icon) {
      if (iconPosition === "left") {
        return (
          <span className="flex items-center gap-2">
            {icon}
            {children}
          </span>
        );
      }
      return (
        <span className="flex items-center gap-2">
          {children}
          {icon}
        </span>
      );
    }

    return children;
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn(fullWidth && "w-full", className)}
      onClick={handleClick}
      {...props}
    >
      {renderContent()}
    </Button>
  );
}
