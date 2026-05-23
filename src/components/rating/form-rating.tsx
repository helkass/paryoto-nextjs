// components/rating/form-rating.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star, Heart, Circle } from "lucide-react";
import { DEFAULT_FEEDBACK_LABELS } from "@/lib/rating-labels";
import { RatingProps } from "@/types/rating.types";

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const iconComponents = {
  star: Star,
  heart: Heart,
  circle: Circle,
};

export function FormRating({
  value = 0,
  onChange,
  max = 5,
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  size = "md",
  variant = "default",
  icon = "star",
  allowHalf = false,
  showCount = true,
  showValue = true,
  showFeedback = true,
  feedbackLabels = DEFAULT_FEEDBACK_LABELS,
  customFeedback,
  activeColor = "#FBBF24",
  inactiveColor = "#D1D5DB",
  hoverColor = "#FCD34D",
  className,
  starClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
  onHover,
  onRatingChange,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState(0);
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleStarClick = (starIndex: number) => {
    if (disabled || readOnly) return;

    let newValue = starIndex;
    if (allowHalf && currentValue === starIndex - 0.5) {
      newValue = starIndex;
    } else if (allowHalf && currentValue === starIndex) {
      newValue = starIndex - 0.5;
    } else if (!allowHalf) {
      newValue = starIndex;
    }

    setCurrentValue(newValue);
    onChange?.(newValue);
    onRatingChange?.(newValue);
  };

  const handleStarHover = (starIndex: number) => {
    if (disabled || readOnly) return;

    let hoverVal = starIndex;
    if (allowHalf && hoverValue === starIndex - 0.5) {
      hoverVal = starIndex;
    } else if (allowHalf) {
      hoverVal = starIndex - 0.5;
    }

    setHoverValue(hoverVal);
    onHover?.(hoverVal);
  };

  const handleMouseLeave = () => {
    if (disabled || readOnly) return;
    setHoverValue(0);
    onHover?.(0);
  };

  const getStarFill = (starIndex: number): number => {
    const rating = hoverValue > 0 ? hoverValue : currentValue;

    if (rating >= starIndex) return 100;
    if (allowHalf && rating >= starIndex - 0.5) return 50;
    return 0;
  };

  const getStarColor = (starIndex: number): string => {
    const rating = hoverValue > 0 ? hoverValue : currentValue;
    const isHovered = hoverValue > 0;

    if (rating >= starIndex) {
      return isHovered && !readOnly ? hoverColor : activeColor;
    }
    if (allowHalf && rating >= starIndex - 0.5) {
      return isHovered && !readOnly ? hoverColor : activeColor;
    }
    return inactiveColor;
  };

  const getFeedbackText = (): string => {
    const rating = hoverValue > 0 ? hoverValue : currentValue;
    const roundedValue = Math.round(rating);

    if (customFeedback) {
      return customFeedback(rating, max);
    }

    if (feedbackLabels[roundedValue]) {
      return feedbackLabels[roundedValue];
    }

    return "";
  };

  const IconComponent =
    iconComponents[icon as keyof typeof iconComponents] || Star;
  const displayValue = hoverValue > 0 ? hoverValue : currentValue;

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <div className="text-sm font-medium">{label}</div>}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "animate-pulse rounded bg-muted",
                sizeClasses[size]
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Stars container */}
      <div
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
          const fillPercentage = getStarFill(star);
          const starColor = getStarColor(star);

          return (
            <div
              key={star}
              className={cn(
                "relative inline-flex cursor-pointer",
                sizeClasses[size]
              )}
              onMouseEnter={() => handleStarHover(star)}
              onClick={() => handleStarClick(star)}
            >
              {/* Background (empty star) */}
              <IconComponent
                className={cn(
                  "absolute inset-0 transition-colors duration-150",
                  sizeClasses[size],
                  starClassName
                )}
                style={{ color: inactiveColor, fill: inactiveColor }}
              />

              {/* Foreground (filled star) - using clip-path for half star */}
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <IconComponent
                    className={cn(
                      "transition-colors duration-150",
                      sizeClasses[size],
                      starClassName
                    )}
                    style={{ color: starColor, fill: starColor }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Value and count */}
      {(showValue || showCount) && (
        <div className="flex items-center gap-2">
          {showValue && (
            <span className="text-sm font-medium">
              {displayValue.toFixed(allowHalf ? 1 : 0)}
            </span>
          )}
          {showCount && (
            <span className="text-xs text-muted-foreground">/ {max}</span>
          )}
        </div>
      )}

      {/* Feedback message */}
      {showFeedback && !disabled && !readOnly && displayValue > 0 && (
        <p className="text-sm text-muted-foreground">{getFeedbackText()}</p>
      )}

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
