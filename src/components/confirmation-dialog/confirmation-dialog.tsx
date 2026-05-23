// components/confirmation-dialog/confirmation-dialog.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmationDialogProps } from "@/types/confirmation-dialog.types";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const positionClasses = {
  center: "items-center justify-center p-4",
  top: "items-start justify-center pt-8 px-4",
  bottom: "items-end justify-center pb-8 px-4",
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,

  title = "Confirm Action",
  description = "Are you sure you want to proceed?",

  icon,

  confirmLabel = "Confirm",
  cancelLabel = "Cancel",

  confirmVariant = "default",
  cancelVariant = "outline",

  closeOnOverlayClick = true,
  closeOnEscape = true,

  showCancelButton = true,
  reverseButtons = false,

  loading = false,
  loadingText = "Processing...",

  className,
  overlayClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  buttonsClassName,

  size = "md",
  position = "center",

  animationDuration = 200,

  onOpen,
  onCloseComplete,
}: ConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const isLoading = loading || isProcessing;

  // Handle open callback
  React.useEffect(() => {
    if (isOpen) {
      onOpen?.();
    }
  }, [isOpen, onOpen]);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOnEscape, isLoading, onClose]);

  const handleConfirm = React.useCallback(async () => {
    if (isLoading) return;

    try {
      setIsProcessing(true);
      await onConfirm();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }, [isLoading, onConfirm, onClose]);

  const handleCancel = React.useCallback(async () => {
    if (isLoading) return;

    try {
      if (onCancel) {
        setIsProcessing(true);
        await onCancel();
      }

      onClose();
    } finally {
      setIsProcessing(false);
    }
  }, [isLoading, onCancel, onClose]);

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        event.target === event.currentTarget &&
        closeOnOverlayClick &&
        !isLoading
      ) {
        onClose();
      }
    },
    [closeOnOverlayClick, isLoading, onClose]
  );

  const dialogIcon = React.useMemo(() => {
    if (icon) return icon;

    if (confirmVariant === "destructive") {
      return <AlertCircle className="h-6 w-6 text-destructive" />;
    }

    return <Info className="h-6 w-6 text-primary" />;
  }, [icon, confirmVariant]);

  const buttonContent = React.useMemo(() => {
    const confirmButton = (
      <Button
        variant={confirmVariant}
        onClick={handleConfirm}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading ? loadingText : confirmLabel}
      </Button>
    );

    const cancelButton = (
      <Button
        variant={cancelVariant}
        onClick={handleCancel}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {cancelLabel}
      </Button>
    );

    if (!showCancelButton) {
      return confirmButton;
    }

    return reverseButtons ? (
      <>
        {confirmButton}
        {cancelButton}
      </>
    ) : (
      <>
        {cancelButton}
        {confirmButton}
      </>
    );
  }, [
    confirmVariant,
    cancelVariant,
    handleConfirm,
    handleCancel,
    isLoading,
    loadingText,
    confirmLabel,
    cancelLabel,
    showCancelButton,
    reverseButtons,
  ]);

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={onCloseComplete}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: animationDuration / 1000,
          }}
          className={cn(
            "fixed inset-0 z-50 flex",
            positionClasses[position],
            className
          )}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: animationDuration / 1000,
            }}
            onClick={handleOverlayClick}
            className={cn("absolute inset-0 bg-black/50", overlayClassName)}
          />

          {/* Dialog */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            transition={{
              duration: animationDuration / 1000,
            }}
            className={cn(
              "relative z-10 w-full rounded-xl bg-background p-6 shadow-xl",
              sizeClasses[size],
              contentClassName
            )}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                "absolute right-4 top-4 rounded-md p-1",
                "opacity-70 transition-opacity hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:pointer-events-none"
              )}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="mb-4 flex justify-center">{dialogIcon}</div>

            {/* Title */}
            <h2
              className={cn(
                "text-center text-lg font-semibold",
                titleClassName
              )}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className={cn(
                "mt-2 text-center text-sm text-muted-foreground",
                descriptionClassName
              )}
            >
              {description}
            </p>

            {/* Buttons */}
            <div
              className={cn("mt-6 flex justify-center gap-3", buttonsClassName)}
            >
              {buttonContent}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
