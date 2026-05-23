// components/modal-layout/modal-layout.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ModalHeader } from "./modal-header";
import { ModalFooter } from "./modal-footer";
import { ModalLayoutProps } from "@/types/modal-layout.types";
import { Loader2 } from "lucide-react";

const sizeClasses = {
  sm: "max-w-sm w-full",
  md: "max-w-md w-full",
  lg: "max-w-lg w-full",
  xl: "max-w-xl w-full",
  full: "max-w-[90vw] w-[90vw] max-h-[90vh]",
  auto: "max-w-none w-auto",
};

const positionClasses = {
  center: "items-center justify-center p-4",
  top: "items-start justify-center pt-8 px-4",
  bottom: "items-end justify-center pb-8 px-4",
  left: "items-center justify-start pl-8 pr-4",
  right: "items-center justify-end pr-8 pl-4",
};

// Animation classes untuk overlay
const overlayAnimationClasses = {
  fade: "animate-in fade-in duration-200",
  slide: "animate-in fade-in duration-200",
  zoom: "animate-in fade-in duration-200",
  none: "",
};

// Animation classes untuk modal container
const modalAnimationClasses = {
  fade: "animate-in fade-in duration-200",
  slide: "animate-in slide-in-from-bottom duration-300",
  zoom: "animate-in zoom-in-95 duration-200",
  none: "",
};

// Animation state classes (open/closed)
const modalStateClasses = {
  open: "opacity-100 scale-100",
  closed: "opacity-0 scale-95",
};

const overlayStateClasses = {
  open: "opacity-100",
  closed: "opacity-0",
};

export function ModalLayout({
  isOpen,
  onClose,
  children,
  title,
  description,
  footer,
  size = "md",
  position = "center",
  animation = "fade",
  animationDuration = 200,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventScroll = true,
  lockFocus = true,
  className,
  overlayClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  loading = false,
  loadingComponent,
  onOpen,
  onCloseComplete,
  onAfterOpen,
}: ModalLayoutProps) {
  const [mounted, setMounted] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const animationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle mounting for portal
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle animation and render timing
  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);

      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
    } else {
      setIsAnimating(true);

      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
        setShouldRender(false);
      }, animationDuration);
    }

    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isOpen, animationDuration]);

  // Handle body scroll lock
  React.useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, preventScroll]);

  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Save and restore focus
  React.useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      onOpen?.();

      setTimeout(() => {
        onAfterOpen?.();
        if (lockFocus && contentRef.current) {
          const firstFocusable = contentRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          firstFocusable?.focus();
        }
      }, animationDuration);
    } else {
      setTimeout(() => {
        previousFocusRef.current?.focus();
        onCloseComplete?.();
      }, animationDuration);
    }
  }, [
    isOpen,
    animationDuration,
    lockFocus,
    onOpen,
    onAfterOpen,
    onCloseComplete,
  ]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && !isAnimating) {
      onClose();
    }
  };

  if (!mounted || !shouldRender) return null;

  const isFullSize = size === "full";
  const modalState = isOpen ? modalStateClasses.open : modalStateClasses.closed;
  const overlayState = isOpen
    ? overlayStateClasses.open
    : overlayStateClasses.closed;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex transition-all duration-200",
        positionClasses[position],
        overlayAnimationClasses[animation],
        overlayState
      )}
      style={{ animationDuration: `${animationDuration}ms` }}
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-all duration-200",
          overlayState,
          overlayClassName
        )}
        onClick={handleOverlayClick}
        style={{ transitionDuration: `${animationDuration}ms` }}
      />

      {/* Modal Container */}
      <div
        ref={contentRef}
        className={cn(
          "relative z-10 bg-background rounded-lg shadow-lg transition-all duration-200",
          sizeClasses[size],
          isFullSize && "flex flex-col",
          modalAnimationClasses[animation],
          modalState,
          className
        )}
        style={{
          transitionDuration: `${animationDuration}ms`,
          maxHeight: isFullSize ? "90vh" : undefined,
          height: isFullSize ? "auto" : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
            {loadingComponent || (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            {(title || description || showCloseButton) && (
              <ModalHeader
                title={title}
                description={description}
                onClose={onClose}
                showCloseButton={showCloseButton}
                className={cn("border-b p-4", headerClassName)}
              />
            )}

            {/* Body */}
            <div
              className={cn(
                "p-4",
                isFullSize && "flex-1 overflow-auto",
                bodyClassName
              )}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <ModalFooter className={cn("border-t p-4", footerClassName)}>
                {footer}
              </ModalFooter>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
