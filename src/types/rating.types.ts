// types/rating.types.ts
export interface RatingProps {
  // Core
  value?: number;
  onChange?: (value: number) => void;
  max?: number;

  // Labels
  label?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Display
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "outline" | "modern";
  icon?: "star" | "heart" | "circle";
  allowHalf?: boolean;
  precision?: 0.5 | 0.25 | 0.1;
  showCount?: boolean;
  showValue?: boolean;
  showFeedback?: boolean;

  // Feedback messages
  feedbackLabels?: Record<number, string>;
  customFeedback?: (value: number, max: number) => string;

  // Colors
  activeColor?: string;
  inactiveColor?: string;
  hoverColor?: string;

  // Styling
  className?: string;
  starClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onHover?: (value: number) => void;
  onRatingChange?: (value: number) => void;
}

export interface StarProps {
  index: number;
  value: number;
  filled: number; // 0: empty, 0.5: half, 1: full
  hoverValue: number;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onClick: (index: number) => void;
  size: "sm" | "md" | "lg";
  variant: string;
  activeColor?: string;
  inactiveColor?: string;
  hoverColor?: string;
  disabled: boolean;
  readOnly: boolean;
  className?: string;
}
