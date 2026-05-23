// types/alert-dialog.types.ts
import { ReactNode } from "react";

export interface AlertDialogProps {
  // Core
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Content
  title?: string;
  description?: string;
  icon?: ReactNode;

  // Actions
  actions?: ReactNode;
  action?: {
    label: string;
    onClick: () => void | Promise<void>;
    variant?: "default" | "destructive" | "outline" | "secondary";
  };
  cancel?: {
    label: string;
    onClick?: () => void | Promise<void>;
    variant?: "default" | "destructive" | "outline" | "secondary";
  };

  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;

  // Styling
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;

  // Size
  size?: "sm" | "md" | "lg";
}

export interface AlertDialogAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

export interface AlertDialogState {
  isOpen: boolean;
  config: AlertDialogConfig;
}

export interface AlertDialogConfig {
  title: string;
  description: string;
  action: AlertDialogAction;
  cancel?: AlertDialogAction;
  icon?: ReactNode;
}
