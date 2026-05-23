// types/split-layout.types.ts
import { ReactNode } from "react";

export interface SplitLayoutProps {
  // Core
  left: ReactNode;
  right: ReactNode;

  // Configuration
  defaultSize?: number; // percentage (0-100)
  size?: number;
  onSizeChange?: (size: number) => void;
  minSize?: number; // minimum percentage for left panel
  maxSize?: number; // maximum percentage for left panel

  // Behavior
  resizable?: boolean;
  savePreference?: boolean;
  preferenceKey?: string;
  direction?: "horizontal" | "vertical";

  // Display
  gutterSize?: number;
  showGutter?: boolean;
  gutterClassName?: string;

  // Styling
  className?: string;
  leftClassName?: string;
  rightClassName?: string;

  // Loading & Error
  loading?: boolean;
  loadingComponent?: ReactNode;
  error?: string;

  // Callbacks
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

export interface SplitPanelProps {
  children: ReactNode;
  size: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  direction?: "horizontal" | "vertical";
}

export interface SplitGutterProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  resizable?: boolean;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export interface SplitLayoutRef {
  resetLayout: () => void;
  setSize: (size: number) => void;
  getSize: () => number;
}
