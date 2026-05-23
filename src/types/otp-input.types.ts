// types/otp-input.types.ts
export interface OtpInputProps {
  // Core
  value?: string;
  onChange?: (value: string) => void;
  numInputs?: number;

  // Labels
  label?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Behavior
  autoFocus?: boolean;
  shouldAutoFocus?: boolean;
  isDisabled?: boolean;
  isInputNum?: boolean;
  isSecure?: boolean;
  isInputPassword?: boolean;
  placeholder?: string | string[];
  separator?: React.ReactNode;

  // Styling
  className?: string;
  inputClassName?: string;
  containerClassName?: string;

  // Timer
  showTimer?: boolean;
  timerDuration?: number;
  onTimerEnd?: () => void;
  resendText?: string;
  onResend?: () => void;

  // Masking
  maskCharacter?: string;

  // Validation
  validate?: (value: string) => boolean | string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onComplete?: (value: string) => void;
  onOtpSubmit?: (value: string) => void;
}

export interface OtpInputFieldProps {
  index: number;
  value: string;
  onChange: (value: string, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  isInputNum?: boolean;
  isSecure?: boolean;
  placeholder?: string;
  maskCharacter?: string;
  className?: string;
}
