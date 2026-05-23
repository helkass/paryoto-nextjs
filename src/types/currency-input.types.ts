// types/currency-input.types.ts
export interface CurrencyInputProps {
  // Core
  value?: number | string;
  onChange?: (value: number | null) => void;

  // Currency configuration
  currency?: string;
  locale?: string;
  intlConfig?: {
    locale: string;
    currency: string;
  };

  // Formatting
  decimals?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  prefix?: string;
  suffix?: string;

  // Behavior
  allowNegative?: boolean;
  allowDecimals?: boolean;
  disableGroupSeparators?: boolean;
  disableAbbreviations?: boolean;
  maxLength?: number;
  max?: number;
  min?: number;

  // Input props
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;

  // Labels
  label?: string;
  description?: string;

  // Styling
  className?: string;
  inputClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onValueChange?: (value: number | null, name?: string) => void;
}

export interface CurrencyInputFieldProps
  extends Omit<CurrencyInputProps, "value" | "onChange" | "error"> {
  name: string;
}
