// components/page-loader/page-loader.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { ProgressBar } from "./progress-bar";
import { SkeletonLoader } from "./skeleton-loader";
import { PageLoaderProps } from "@/types/page-loader.types";

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function PageLoader({
  loading = true,
  children,
  variant = "spinner",
  size = "md",
  text,
  subtext,
  progress = 0,
  showProgress = false,
  fullScreen = true,
  overlay = true,
  blur = false,
  delay = 0,
  minimumDuration = 0,
  className,
  spinnerClassName,
  textClassName,
  customLoader,
  onLoad,
  onComplete,
}: PageLoaderProps) {
  const [showLoader, setShowLoader] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  // Handle delay and minimum duration

  React.useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();

      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setShowLoader(true);
        }, delay);
      } else {
        setShowLoader(true);
      }

      return;
    }

    const completeLoading = () => {
      setShowLoader(false);
      startTimeRef.current = null;
      onComplete?.();
    };

    if (startTimeRef.current && minimumDuration > 0) {
      const elapsed = Date.now() - startTimeRef.current;

      timeoutRef.current = setTimeout(
        completeLoading,
        Math.max(0, minimumDuration - elapsed)
      );
    } else {
      completeLoading();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, delay, minimumDuration, onComplete]);

  // Call onLoad when loader appears
  React.useEffect(() => {
    if (showLoader) {
      onLoad?.();
    }
  }, [showLoader, onLoad]);

  const loaderContent = React.useMemo(() => {
    if (customLoader) {
      return customLoader;
    }

    switch (variant) {
      case "progress":
        return (
          <div className="w-80 max-w-full">
            <ProgressBar progress={progress} className="mb-4" />
            {showProgress && (
              <p className="text-center text-sm text-muted-foreground">
                {Math.round(progress)}%
              </p>
            )}
          </div>
        );

      case "skeleton":
        return <SkeletonLoader type="dashboard" count={1} />;

      case "spinner":
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <Spinner size={size} className={spinnerClassName} />

            {text && (
              <p
                className={cn(
                  "text-muted-foreground",
                  sizeClasses[size],
                  textClassName
                )}
              >
                {text}
              </p>
            )}

            {subtext && (
              <p className="text-sm text-muted-foreground/70">{subtext}</p>
            )}
          </div>
        );
    }
  }, [
    customLoader,
    variant,
    progress,
    showProgress,
    size,
    spinnerClassName,
    text,
    subtext,
    textClassName,
  ]);

  // Skeleton variant tidak menggunakan overlay
  if (variant === "skeleton") {
    if (!showLoader) {
      return <>{children}</>;
    }

    return (
      <div className={cn("w-full", className)}>
        <SkeletonLoader type="dashboard" count={1} />
      </div>
    );
  }

  // Full screen loader
  if (fullScreen) {
    return (
      <>
        {children}
        <AnimatePresence>
          {showLoader && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed inset-0 z-50 flex items-center justify-center",
                overlay && "bg-background/80",
                blur && "backdrop-blur-sm",
                className
              )}
            >
              {loaderContent}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline loader
  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              overlay && "bg-background/60",
              blur && "backdrop-blur-sm",
              className
            )}
          >
            {loaderContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
