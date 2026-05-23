// types/confirmation-dialog.types.ts
import { ReactNode } from "react";

export interface ConfirmationDialogProps {
  // Core
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;

  // Content
  title?: string;
  description?: string;
  icon?: ReactNode;

  // Buttons
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary";
  cancelVariant?: "default" | "destructive" | "outline" | "secondary";

  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCancelButton?: boolean;
  reverseButtons?: boolean;

  // Loading
  loading?: boolean;
  loadingText?: string;

  // Styling
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonsClassName?: string;

  // Size & Position
  size?: "sm" | "md" | "lg" | "xl";
  position?: "center" | "top" | "bottom";

  // Animation
  animation?: "fade" | "slide" | "zoom";
  animationDuration?: number;

  // Callbacks
  onOpen?: () => void;
  onCloseComplete?: () => void;
}

export interface ConfirmationDialogState {
  isOpen: boolean;
  config: ConfirmationDialogConfig;
}

export interface ConfirmationDialogConfig {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  icon?: ReactNode;
}
