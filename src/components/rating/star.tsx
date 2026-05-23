// components/rating/star.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star as StarIcon, Heart, Circle } from "lucide-react";
import { StarProps } from "@/types/rating.types";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const iconComponents = {
  star: StarIcon as React.ElementType,
  heart: Heart as React.ElementType,
  circle: Circle as React.ElementType,
};

export function Star({
  index,
  filled,
  hoverValue,
  onMouseEnter,
  onMouseLeave,
  onClick,
  size,
  variant,
  activeColor = "#FBBF24",
  inactiveColor = "#D1D5DB",
  hoverColor = "#FCD34D",
  disabled,
  readOnly,
  className,
}: StarProps) {
  const isActive = filled > 0;
  const isHovered = hoverValue >= index;
  const fillPercentage = filled === 0.5 ? 50 : filled === 1 ? 100 : 0;

  const IconComponent =
    iconComponents[variant as keyof typeof iconComponents] || StarIcon;

  const handleMouseEnter = () => {
    if (!disabled && !readOnly) {
      onMouseEnter(index);
    }
  };

  const handleClick = () => {
    if (!disabled && !readOnly) {
      onClick(index);
    }
  };

  const getColor = () => {
    if (isHovered && !readOnly) return hoverColor;
    if (isActive) return activeColor;
    return inactiveColor;
  };

  return (
    <div
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center transition-all duration-150 hover:scale-110",
        sizeClasses[size],
        (disabled || readOnly) && "cursor-default hover:scale-100",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      {/* Background (inactive) icon */}
      <IconComponent
        className={cn("absolute", sizeClasses[size])}
        style={{ color: inactiveColor }}
      />

      {/* Foreground (active/hover) icon with clip-path */}
      <div
        className="h-full overflow-hidden"
        style={{ width: `${fillPercentage}%` }}
      >
        <IconComponent
          className={cn("h-full w-full", sizeClasses[size])}
          style={{ color: getColor() }}
        />
      </div>
    </div>
  );
}
