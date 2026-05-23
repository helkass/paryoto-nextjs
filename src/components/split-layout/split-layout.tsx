// components/split-layout/split-layout.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SplitPanel } from "./split-panel";
import { SplitGutter } from "./split-gutter";
import { SplitLayoutProps, SplitLayoutRef } from "@/types/split-layout.types";
import { AlertCircle, Loader2 } from "lucide-react";

const STORAGE_KEY = "split-layout-size";

export const SplitLayout = React.forwardRef<SplitLayoutRef, SplitLayoutProps>(
  (
    {
      left,
      right,
      defaultSize = 50,
      size: controlledSize,
      onSizeChange,
      minSize = 20,
      maxSize = 80,
      resizable = true,
      savePreference = false,
      preferenceKey = STORAGE_KEY,
      direction = "horizontal",
      gutterSize = 8,
      showGutter = true,
      gutterClassName,
      className,
      leftClassName,
      rightClassName,
      loading = false,
      loadingComponent,
      error,
      onResizeStart,
      onResizeEnd,
    },
    ref
  ) => {
    const [internalSize, setInternalSize] = React.useState(() => {
      if (savePreference) {
        const saved = localStorage.getItem(preferenceKey);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= minSize && parsed <= maxSize) {
            return parsed;
          }
        }
      }
      return defaultSize;
    });

    const size = controlledSize !== undefined ? controlledSize : internalSize;
    const isHorizontal = direction === "horizontal";
    const isVertical = direction === "vertical";
    const containerRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);

    const handleResize = React.useCallback(
      (clientX: number, clientY: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        let newSize: number;

        if (isHorizontal) {
          const newWidth = ((clientX - rect.left) / rect.width) * 100;
          newSize = Math.max(minSize, Math.min(maxSize, newWidth));
        } else {
          const newHeight = ((clientY - rect.top) / rect.height) * 100;
          newSize = Math.max(minSize, Math.min(maxSize, newHeight));
        }

        if (controlledSize === undefined) {
          setInternalSize(newSize);
        }
        onSizeChange?.(newSize);

        if (savePreference) {
          localStorage.setItem(preferenceKey, newSize.toString());
        }
      },
      [
        controlledSize,
        minSize,
        maxSize,
        isHorizontal,
        onSizeChange,
        savePreference,
        preferenceKey,
      ]
    );

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

    const resetLayout = React.useCallback(() => {
      const newSize = defaultSize;
      if (controlledSize === undefined) {
        setInternalSize(newSize);
      }
      onSizeChange?.(newSize);
      if (savePreference) {
        localStorage.setItem(preferenceKey, newSize.toString());
      }
    }, [
      controlledSize,
      defaultSize,
      onSizeChange,
      savePreference,
      preferenceKey,
    ]);

    const setSize = React.useCallback(
      (newSize: number) => {
        const clampedSize = Math.max(minSize, Math.min(maxSize, newSize));
        if (controlledSize === undefined) {
          setInternalSize(clampedSize);
        }
        onSizeChange?.(clampedSize);
        if (savePreference) {
          localStorage.setItem(preferenceKey, clampedSize.toString());
        }
      },
      [
        controlledSize,
        minSize,
        maxSize,
        onSizeChange,
        savePreference,
        preferenceKey,
      ]
    );

    const getSize = React.useCallback(() => size, [size]);

    React.useImperativeHandle(ref, () => ({
      resetLayout,
      setSize,
      getSize,
    }));

    if (loading) {
      if (loadingComponent) {
        return <>{loadingComponent}</>;
      }

      return (
        <div
          className={cn(
            "flex items-center justify-center rounded-lg border bg-muted/20 p-8",
            isHorizontal ? "min-h-[200px]" : "min-h-[400px]",
            className
          )}
        >
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error) {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8",
            className
          )}
        >
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex",
          isHorizontal ? "flex-row" : "flex-col",
          className
        )}
        style={{
          minHeight: isVertical ? 400 : undefined,
          minWidth: isHorizontal ? 400 : undefined,
        }}
      >
        <SplitPanel
          size={size}
          minSize={minSize}
          maxSize={maxSize}
          className={leftClassName}
          direction={direction}
        >
          {left}
        </SplitPanel>

        {showGutter && (
          <SplitGutter
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            resizable={resizable}
            direction={direction}
            className={gutterClassName}
          />
        )}

        <SplitPanel
          size={100 - size}
          minSize={100 - maxSize}
          maxSize={100 - minSize}
          className={rightClassName}
          direction={direction}
        >
          {right}
        </SplitPanel>
      </div>
    );
  }
);

SplitLayout.displayName = "SplitLayout";
