// types/slider.types.ts
export interface SliderProps {
  // Core
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;

  // Mode
  mode?: "single" | "range";

  // Labels
  label?: string;
  description?: string;
  unit?: string;
  formatValue?: (value: number) => string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Display Options
  showInput?: boolean;
  showMarks?: boolean;
  showTooltip?: boolean;
  showMinMax?: boolean;
  marks?: Array<{ value: number; label: string }>;

  // Styling
  className?: string;
  sliderClassName?: string;
  inputClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onValueChangeEnd?: (value: number | [number, number]) => void;
}

export interface RangeSliderProps
  extends Omit<SliderProps, "mode" | "value" | "onChange"> {
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

export interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  unit?: string;
  formatValue?: (value: number) => string;
  className?: string;
}
