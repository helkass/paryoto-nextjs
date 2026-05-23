// types/toggle.types.ts
export interface ToggleOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ToggleProps {
  // Core
  value?: boolean | string | string[];
  onChange?: (value: boolean | string | string[]) => void;
  mode?: "single" | "multiple";

  // Options (for multiple mode)
  options?: ToggleOption[];

  // Labels
  label?: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Size
  size?: "sm" | "md" | "lg";

  // Styling
  className?: string;
  switchClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onToggle?: (checked: boolean) => void;
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export interface ToggleGroupProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: ToggleOption[];
  mode?: "single" | "multiple";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}
