// types/color-picker.types.ts
export type ColorFormat = "hex" | "hex8" | "rgb" | "rgba" | "hsl" | "hsla";

export interface ColorPickerProps {
  // Core
  value?: string;
  onChange?: (color: string) => void;
  format?: ColorFormat;

  // Labels
  label?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Options
  presetColors?: string[];
  showPresets?: boolean;
  showInput?: boolean;
  showOpacity?: boolean;
  showEyeDropper?: boolean;

  // Display
  size?: "sm" | "md" | "lg";
  variant?: "default" | "card" | "compact";

  // Styling
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onColorChange?: (color: string) => void;
}

export interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}
