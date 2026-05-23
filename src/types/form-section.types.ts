// types/form-section.types.ts
import { ReactNode } from "react";

export interface FormSectionProps {
  // Core
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;

  // Behavior
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  collapsible?: boolean;

  // Validation
  required?: boolean;
  disabled?: boolean;

  // Display
  variant?: "default" | "card" | "borderless";
  size?: "sm" | "md" | "lg";

  // Actions
  actions?: ReactNode;
  showDivider?: boolean;

  // Styling
  className?: string;
  headerClassName?: string;
  contentClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Badge
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  };

  // Callbacks
  onToggle?: (isOpen: boolean) => void;
}

export interface FormSectionGroupProps {
  sections: FormSectionProps[];
  defaultOpenAll?: boolean;
  allowMultipleOpen?: boolean;
  className?: string;
  children?: ReactNode;
}
