// types/modal-layout.types.ts
import { ReactNode } from "react";

export interface ModalLayoutProps {
  // Core
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;

  // Content
  title?: string;
  description?: string;
  footer?: ReactNode;

  // Size & Position
  size?: "sm" | "md" | "lg" | "xl" | "full" | "auto";
  position?: "center" | "top" | "bottom" | "left" | "right";

  // Animation
  animation?: "fade" | "slide" | "zoom" | "none";
  animationDuration?: number;

  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  lockFocus?: boolean;

  // Styling
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  // Loading & Error
  loading?: boolean;
  loadingComponent?: ReactNode;

  // Callbacks
  onOpen?: () => void;
  onCloseComplete?: () => void;
  onAfterOpen?: () => void;
}

export interface ModalHeaderProps {
  title?: string;
  description?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}
