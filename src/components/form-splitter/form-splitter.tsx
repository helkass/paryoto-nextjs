// components/form-splitter/form-splitter.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SplitterGutter } from "./splitter-gutter";
import { SplitterPanel } from "./splitter-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { FormSplitterProps } from "@/types/form-splitter.types";

const STORAGE_KEY = "form-splitter-width";

export function FormSplitter({
  leftContent,
  rightContent,
  defaultLeftWidth = 50,
  leftWidth: controlledLeftWidth,
  onWidthChange,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  resizable = true,
  savePreference = false,
  preferenceKey = STORAGE_KEY,
  gutter = 8,
  showGutter = true,
  direction = "horizontal",
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  className,
  leftClassName,
  rightClassName,
  gutterClassName,
  loading = false,
  error,
  onResizeStart,
  onResizeEnd,
}: FormSplitterProps) {
  const [internalLeftWidth, setInternalLeftWidth] = React.useState(() => {
    if (savePreference) {
      const saved = localStorage.getItem(preferenceKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (
          !isNaN(parsed) &&
          parsed >= minLeftWidth &&
          parsed <= maxLeftWidth
        ) {
          return parsed;
        }
      }
    }
    return defaultLeftWidth;
  });

  const leftWidth =
    controlledLeftWidth !== undefined ? controlledLeftWidth : internalLeftWidth;
  const rightWidth = 100 - leftWidth;
  const isHorizontal = direction === "horizontal";

  const handleResize = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newLeftWidth: number;

      if (isHorizontal) {
        const newWidth = ((clientX - rect.left) / rect.width) * 100;
        newLeftWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth));
      } else {
        const newHeight = ((clientY - rect.top) / rect.height) * 100;
        newLeftWidth = Math.max(
          minLeftWidth,
          Math.min(maxLeftWidth, newHeight)
        );
      }

      if (controlledLeftWidth === undefined) {
        setInternalLeftWidth(newLeftWidth);
      }
      onWidthChange?.(newLeftWidth);

      if (savePreference) {
        localStorage.setItem(preferenceKey, newLeftWidth.toString());
      }
    },
    [
      controlledLeftWidth,
      minLeftWidth,
      maxLeftWidth,
      isHorizontal,
      onWidthChange,
      savePreference,
      preferenceKey,
    ]
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      isDragging.current = true;
      onResizeStart?.();

      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
          handleResize(e.clientX, e.clientY);
        }
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        onResizeEnd?.();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [resizable, handleResize, onResizeStart, onResizeEnd]
  );

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      if (!resizable) return;
      e.preventDefault();
      isDragging.current = true;
      onResizeStart?.();

      const handleTouchMove = (e: TouchEvent) => {
        if (isDragging.current && e.touches[0]) {
          handleResize(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const handleTouchEnd = () => {
        isDragging.current = false;
        onResizeEnd?.();
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [resizable, handleResize, onResizeStart, onResizeEnd]
  );

  if (loading) {
    return (
      <div className={cn("flex gap-4", className)}>
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <p className="mt-2 text-destructive">Error: {error}</p>
      </div>
    );
  }

  const containerClassName = cn(
    "flex",
    isHorizontal ? "flex-row" : "flex-col",
    className
  );

  const gutterSize = showGutter ? gutter : 0;

  if (!isHorizontal) {
    return (
      <div
        ref={containerRef}
        className={containerClassName}
        style={{ minHeight: 400 }}
      >
        <SplitterPanel
          width={leftWidth}
          minWidth={minLeftWidth}
          maxWidth={maxLeftWidth}
          label={leftLabel}
          icon={leftIcon}
          className={leftClassName}
        >
          {leftContent}
        </SplitterPanel>
        {showGutter && (
          <SplitterGutter
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            resizable={resizable}
            className={cn("h-2 w-full cursor-row-resize", gutterClassName)}
          />
        )}
        <SplitterPanel
          width={rightWidth}
          minWidth={100 - maxLeftWidth}
          maxWidth={100 - minLeftWidth}
          label={rightLabel}
          icon={rightIcon}
          className={rightClassName}
        >
          {rightContent}
        </SplitterPanel>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={containerClassName}>
      <SplitterPanel
        width={leftWidth}
        minWidth={minLeftWidth}
        maxWidth={maxLeftWidth}
        label={leftLabel}
        icon={leftIcon}
        className={leftClassName}
      >
        {leftContent}
      </SplitterPanel>
      {showGutter && (
        <SplitterGutter
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          resizable={resizable}
          className={gutterClassName}
        />
      )}
      <SplitterPanel
        width={rightWidth}
        minWidth={100 - maxLeftWidth}
        maxWidth={100 - minLeftWidth}
        label={rightLabel}
        icon={rightIcon}
        className={rightClassName}
      >
        {rightContent}
      </SplitterPanel>
    </div>
  );
}
