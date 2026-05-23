// components/alert-dialog/alert-dialog.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertDialogProps } from "@/types/alert-dialog.types";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -20 },
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  actions,
  action,
  cancel,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  size = "md",
}: AlertDialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!closeOnEscape || !open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, isLoading, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleAction = async (onClick: () => void | Promise<void>) => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && !isLoading) {
      onOpenChange(false);
    }
  };

  if (!mounted) return null;

  const renderActions = () => {
    if (actions) return actions;

    const actionButtons = [];

    if (cancel) {
      actionButtons.push(
        <Button
          key="cancel"
          variant={cancel.variant || "outline"}
          onClick={() =>
            cancel.onClick ? handleAction(cancel.onClick) : onOpenChange(false)
          }
          disabled={isLoading}
        >
          {cancel.label}
        </Button>
      );
    }

    if (action) {
      actionButtons.push(
        <Button
          key="action"
          variant={action.variant || "default"}
          onClick={() => handleAction(action.onClick)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : action.label}
        </Button>
      );
    }

    return (
      <div
        className={cn(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          actionsClassName
        )}
      >
        {actionButtons.reverse()}
      </div>
    );
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4",
            className
          )}
        >
          {/* Overlay with animation */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            className={cn("absolute inset-0 bg-black/80", overlayClassName)}
            onClick={handleOverlayClick}
          />

          {/* Content with animation */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-10 w-full rounded-lg bg-background p-6 shadow-lg",
              sizeClasses[size],
              contentClassName
            )}
          >
            {/* Icon */}
            {icon && <div className="mb-4">{icon}</div>}

            {/* Title */}
            {title && (
              <h2
                className={cn(
                  "text-lg font-semibold leading-none tracking-tight",
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p
                className={cn(
                  "mt-2 text-sm text-muted-foreground",
                  descriptionClassName
                )}
              >
                {description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6">{renderActions()}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
