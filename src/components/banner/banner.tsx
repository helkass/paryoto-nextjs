// components/banner/banner.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BannerPosition,
  BannerProps,
  BannerVariant,
} from "@/types/banner.types";

const variantStyles: Record<BannerVariant, string> = {
  default: "bg-background border-border",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300",
  success:
    "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300",
  warning:
    "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-300",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300",
};

const variantIcons: Record<BannerVariant, React.ReactNode> = {
  default: <Info className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
};

const positionStyles: Record<BannerPosition, string> = {
  top: "relative top-0",
  bottom: "relative bottom-0",
  "fixed-top": "fixed top-0 left-0 right-0 z-50",
  "fixed-bottom": "fixed bottom-0 left-0 right-0 z-50",
};

const bannerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fixedBannerVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
};

export function Banner({
  message,
  variant = "default",
  position = "top",
  title,
  icon,
  action,
  dismissible = true,
  autoClose = false,
  autoCloseDelay = 5000,
  persistent = false,
  onDismiss,
  onAction,
  className,
  contentClassName,
  actionClassName,
  animated = true,
  animationDuration = 300,
}: BannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const autoCloseTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (autoClose && !persistent) {
      autoCloseTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, autoCloseDelay);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [autoClose, autoCloseDelay, persistent]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleAction = async () => {
    if (action?.onClick) {
      await action.onClick();
    }
    onAction?.();
  };

  const isFixed = position === "fixed-top" || position === "fixed-bottom";
  const variants = isFixed ? fixedBannerVariants : bannerVariants;
  const isTop = position === "top" || position === "fixed-top";

  if (!isVisible) return null;

  const content = (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        variantStyles[variant],
        className
      )}
    >
      <div className={cn("flex items-center gap-3", contentClassName)}>
        {icon || variantIcons[variant]}
        <div>
          {title && <p className="font-medium">{title}</p>}
          <p className={cn("text-sm", title && "text-muted-foreground")}>
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAction}
            className={cn(
              "h-8 border-current bg-transparent hover:bg-black/5",
              variant !== "default" && "border-current/30",
              actionClassName
            )}
          >
            {action.label}
          </Button>
        )}
        {dismissible && !persistent && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  if (!animated) {
    return (
      <div
        className={cn(
          "border",
          positionStyles[position],
          isTop ? "border-b" : "border-t"
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: animationDuration / 1000 }}
          className={cn(
            "border",
            positionStyles[position],
            isTop ? "border-b" : "border-t"
          )}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
