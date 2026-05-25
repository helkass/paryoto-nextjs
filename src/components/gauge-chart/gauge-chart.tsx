// components/gauge-chart/gauge-chart.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GaugeChartProps, GaugeSegment } from "@/types/gauge-chart.types";
import {
  getDefaultSegments,
  getNeedleRotation,
  formatDefaultValue,
  getThresholdColor,
} from "@/lib/gauge-utils";

const sizeConfig = {
  sm: {
    width: 200,
    height: 120,
    strokeWidth: 16,
    fontSize: "text-2xl",
    labelSize: "text-xs",
  },
  md: {
    width: 280,
    height: 168,
    strokeWidth: 20,
    fontSize: "text-3xl",
    labelSize: "text-sm",
  },
  lg: {
    width: 360,
    height: 216,
    strokeWidth: 24,
    fontSize: "text-4xl",
    labelSize: "text-base",
  },
  xl: {
    width: 440,
    height: 264,
    strokeWidth: 28,
    fontSize: "text-5xl",
    labelSize: "text-lg",
  },
};

const variantColors = {
  default: "#3B82F6",
  primary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  title,
  subtitle,
  variant = "default",
  color,
  segments: customSegments,
  size = "md",
  showValue = true,
  valueFormat,
  showMinMax = true,
  showThresholds = false,
  showPercentage = false,
  animated = true,
  animationDuration = 1,
  thresholds,
  showNeedle = true,
  needleColor,
  needleBaseColor = "#64748B",
  labelFormatter,
  className,
  gaugeClassName,
  labelClassName,
  loading = false,
  error,
}: GaugeChartProps) {
  const [animatedValue, setAnimatedValue] = React.useState(min);
  const config = sizeConfig[size];

  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const segments = customSegments || getDefaultSegments(variant);
  const finalColor =
    color ||
    (thresholds
      ? getThresholdColor(percentage, thresholds)
      : variantColors[variant]);
  const needleRotation = getNeedleRotation(clampedValue, min, max);

  const radius = config.width / 2 - config.strokeWidth / 2;
  const centerX = config.width / 2;
  const centerY = config.height - config.strokeWidth / 2;

  const startAngle = -180;
  const endAngle = 0;

  React.useEffect(() => {
    if (animated) {
      const duration = animationDuration * 1000;
      const steps = 60;
      const stepTime = duration / steps;
      const increment = (clampedValue - animatedValue) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        if (currentStep < steps) {
          setAnimatedValue((prev) => prev + increment);
          currentStep++;
        } else {
          setAnimatedValue(clampedValue);
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setAnimatedValue(clampedValue);
    }
  }, [clampedValue, animated, animationDuration]);

  const getArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  const getSegmentPath = (segmentStart: number, segmentEnd: number) => {
    const angleRange = 180;
    const start = -180 + (segmentStart / 100) * angleRange;
    const end = -180 + (segmentEnd / 100) * angleRange;
    return getArcPath(start, end, radius);
  };

  const formatValue = (val: number): string => {
    if (valueFormat) return valueFormat(val);
    if (showPercentage)
      return `${Math.round(((val - min) / (max - min)) * 100)}%`;
    return formatDefaultValue(val);
  };

  const formatDisplayValue = (val: number): string => {
    if (labelFormatter) return labelFormatter(val);
    return formatValue(val);
  };

  if (loading) {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <div
          className="relative"
          style={{ width: config.width, height: config.height }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-destructive",
          className
        )}
      >
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const displayValue = animated ? animatedValue : clampedValue;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Gauge Container */}
      <div
        className="relative"
        style={{ width: config.width, height: config.height }}
      >
        <svg
          viewBox={`0 0 ${config.width} ${config.height}`}
          className={cn("overflow-visible", gaugeClassName)}
          style={{ transform: "rotate(0deg)" }}
        >
          {/* Background arc */}
          <path
            d={getArcPath(-180, 0, radius)}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            className="dark:stroke-slate-700"
          />

          {/* Segments */}
          {segments.map((segment, idx) => (
            <path
              key={idx}
              d={getSegmentPath(segment.start, segment.end)}
              fill="none"
              stroke={segment.color}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
          ))}

          {/* Value arc */}
          <path
            d={getArcPath(-180, -180 + percentage * 1.8, radius)}
            fill="none"
            stroke={finalColor}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
          />

          {/* Needle */}
          {showNeedle && (
            <g transform={`rotate(${needleRotation} ${centerX} ${centerY})`}>
              {/* Needle line */}
              <line
                x1={centerX}
                y1={centerY - config.strokeWidth / 2}
                x2={centerX}
                y2={centerY - radius + 10}
                stroke={needleColor || finalColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Needle base */}
              <circle
                cx={centerX}
                cy={centerY}
                r={config.strokeWidth / 2}
                fill={needleBaseColor}
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={config.strokeWidth / 4}
                fill={needleColor || finalColor}
              />
            </g>
          )}
        </svg>

        {/* Value Text */}
        {showValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: animationDuration }}
            className={cn(
              "absolute left-1/2 transform -translate-x-1/2 font-bold",
              config.fontSize,
              labelClassName
            )}
            style={{ bottom: 0 }}
          >
            {formatDisplayValue(displayValue)}
          </motion.div>
        )}
      </div>

      {/* Labels */}
      {(title || subtitle) && (
        <div className="mt-4 text-center">
          {title && <h4 className="font-medium">{title}</h4>}
          {subtitle && (
            <p className={cn("text-muted-foreground", config.labelSize)}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Min/Max Labels */}
      {showMinMax && (
        <div className="mt-2 flex w-full justify-between text-xs text-muted-foreground">
          <span>{formatDisplayValue(min)}</span>
          <span>{formatDisplayValue(max)}</span>
        </div>
      )}

      {/* Threshold Labels */}
      {showThresholds && thresholds && (
        <div className="mt-1 flex w-full justify-between text-xs">
          <span className="text-green-500">Good</span>
          <span className="text-yellow-500">Warning</span>
          <span className="text-red-500">Critical</span>
        </div>
      )}
    </div>
  );
}
