// types/button-loader.types.ts
import { ReactNode, ButtonHTMLAttributes } from "react";

export interface ButtonLoaderProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Core
  loading?: boolean;
  children: ReactNode;

  // Variants
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";

  // Loader
  loaderPosition?: "left" | "right" | "replace";
  loaderText?: string;
  loaderSize?: "sm" | "md" | "lg";
  spinnerType?: "border" | "grow" | "dots";

  // Icon
  icon?: ReactNode;
  iconPosition?: "left" | "right";

  // Behavior
  disabled?: boolean;
  fullWidth?: boolean;
  preventMultipleClicks?: boolean;

  // Styling
  className?: string;
  loaderClassName?: string;

  // Callbacks
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  type?: "border" | "grow" | "dots";
  className?: string;
}
