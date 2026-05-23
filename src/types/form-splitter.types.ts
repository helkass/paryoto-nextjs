// types/form-splitter.types.ts
import { ReactNode } from "react";

export interface FormSplitterProps {
  // Core
  leftContent: ReactNode;
  rightContent: ReactNode;

  // Layout
  defaultLeftWidth?: number; // percentage (0-100)
  leftWidth?: number;
  onWidthChange?: (width: number) => void;
  minLeftWidth?: number;
  maxLeftWidth?: number;

  // Behavior
  resizable?: boolean;
  savePreference?: boolean;
  preferenceKey?: string;

  // Display
  gutter?: number;
  showGutter?: boolean;
  direction?: "horizontal" | "vertical";

  // Labels
  leftLabel?: string;
  rightLabel?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  // Styling
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
  gutterClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

export interface SplitterPanelProps {
  children: ReactNode;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  label?: string;
  icon?: ReactNode;
}

export interface SplitterGutterProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  className?: string;
  resizable?: boolean;
}
