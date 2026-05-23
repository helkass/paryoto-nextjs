// types/empty-state.types.ts
import { ReactNode } from "react";

export type EmptyStateSize = "sm" | "md" | "lg";
export type EmptyStateVariant = "default" | "card" | "minimal";

export interface EmptyStateProps {
  // Core
  title: string;
  description?: string;
  icon?: ReactNode;

  // Action
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: "default" | "outline" | "secondary" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };

  // Display
  size?: EmptyStateSize;
  variant?: EmptyStateVariant;
  showIllustration?: boolean;

  // Styling
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;

  // Children
  children?: ReactNode;
}

export interface EmptyStateIllustrationProps {
  type?: "search" | "data" | "error" | "network" | "custom";
  className?: string;
}
