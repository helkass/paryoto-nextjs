// types/radio-group.types.ts
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioGroupProps {
  // Core
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];

  // Labels
  label?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Display Options
  layout?: "horizontal" | "vertical" | "grid";
  columns?: 1 | 2 | 3 | 4;
  variant?: "default" | "card" | "button" | "modern";
  size?: "sm" | "md" | "lg";

  // Styling
  className?: string;
  radioClassName?: string;
  labelClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface RadioCardProps {
  option: RadioOption;
  isSelected: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  name: string;
  variant?: "card" | "button" | "modern";
  size?: "sm" | "md" | "lg";
  className?: string;
}
