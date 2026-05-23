// types/page-loader.types.ts
import { ReactNode } from "react";

export interface PageLoaderProps {
  // Core
  loading?: boolean;
  children?: ReactNode;

  // Variants
  variant?: "spinner" | "progress" | "skeleton" | "custom";
  size?: "sm" | "md" | "lg";

  // Text
  text?: string;
  subtext?: string;

  // Progress
  progress?: number;
  showProgress?: boolean;

  // Behavior
  fullScreen?: boolean;
  overlay?: boolean;
  blur?: boolean;
  delay?: number;
  minimumDuration?: number;

  // Styling
  className?: string;
  spinnerClassName?: string;
  textClassName?: string;

  // Custom
  customLoader?: ReactNode;

  // Callbacks
  onLoad?: () => void;
  onComplete?: () => void;
}

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  className?: string;
  barClassName?: string;
}

export interface SkeletonLoaderProps {
  type?: "text" | "card" | "table" | "form" | "dashboard";
  count?: number;
  className?: string;
}
