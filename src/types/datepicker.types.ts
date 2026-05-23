import { ReactNode } from "react";

export type DatePickerMode = "single" | "range" | "multiple" | "time";
export type DateFormat =
  | "dd/MM/yyyy"
  | "MM/dd/yyyy"
  | "yyyy/MM/dd"
  | "dd-MM-yyyy"
  | "MM-dd-yyyy"
  | "yyyy-MM-dd";
export type TimeFormat = "12h" | "24h";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export type DatePickerValue = Date | DateRange | Date[] | null | undefined;

export interface FormDatePickerProps {
  // Core
  value?: DatePickerValue;
  onChange?: (value: DatePickerValue) => void;
  mode?: DatePickerMode;

  // Formatting
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  placeholder?: string;

  // Labels
  label?: string;
  fromLabel?: string;
  toLabel?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Date constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: number[]; // 0 = Sunday, 1 = Monday, etc.

  // Time picker
  enableTime?: boolean;
  timeInterval?: number; // minutes interval, default 30
  timeFormat12h?: boolean;

  // Presets
  presets?: Array<{
    label: string;
    value: Date | DateRange;
  }>;

  // UI Options
  showFooter?: boolean;
  showClearButton?: boolean;
  showTodayButton?: boolean;
  showPresets?: boolean;
  numberOfMonths?: number;
  disabledPastDates?: boolean;
  disabledFutureDates?: boolean;

  // Styling
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;

  // Callbacks
  onApply?: (value: DatePickerValue) => void;
  onClear?: () => void;
  onClose?: () => void;
  onOpen?: () => void;

  // Loading & Error
  loading?: boolean;
  error?: string | null;

  // Children
  customTrigger?: ReactNode;
  customInput?: ReactNode;
}

export interface TimePickerProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  interval?: number;
  format?: TimeFormat;
  disabled?: boolean;
  className?: string;
}

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface DatePresetProps {
  label: string;
  value: Date | DateRange;
  onClick: () => void;
  isActive?: boolean;
}
