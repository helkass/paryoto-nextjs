// types/banner.types.ts
import { ReactNode } from "react";

export type BannerVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error";
export type BannerPosition = "top" | "bottom" | "fixed-top" | "fixed-bottom";

export interface BannerProps {
  // Core
  message: string;
  variant?: BannerVariant;
  position?: BannerPosition;

  // Content
  title?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void | Promise<void>;
  };

  // Behavior
  dismissible?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  persistent?: boolean;

  // Callbacks
  onDismiss?: () => void;
  onAction?: () => void;

  // Styling
  className?: string;
  contentClassName?: string;
  actionClassName?: string;

  // Animation
  animated?: boolean;
  animationDuration?: number;
}

export interface BannerStackProps {
  banners: BannerItem[];
  onDismiss: (id: string) => void;
  position?: BannerPosition;
  className?: string;
}

export interface BannerItem extends BannerProps {
  id: string;
}
