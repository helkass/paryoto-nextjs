// components/bullet-chart/bullet-chart-bar.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BulletChartBarProps } from "@/types/bullet-chart.types";
import { getPercentage } from "@/lib/bullet-chart-utils";

export function BulletChartBar({
  value,
  target,
  min,
  max,
  ranges,
  colors,
  orientation,
  width,
  height,
  animated,
  animationDuration,
  showTooltip,
  valueFormat,
  className,
  targetClassName,
}: BulletChartBarProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const isHorizontal = orientation === "horizontal";

  const valuePercent = getPercentage(value, min, max);
  const targetPercent = getPercentage(target, min, max);
  const poorPercent = getPercentage(ranges.poor, min, max);
  const averagePercent = getPercentage(ranges.average, min, max);
  const goodPercent = getPercentage(ranges.good, min, max);
  const excellentPercent = ranges.excellent
    ? getPercentage(ranges.excellent, min, max)
    : 100;

  const barWidth = isHorizontal ? width : height;
  const barHeight = isHorizontal ? height : width;

  const getRangeWidth = (rangeEnd: number): number => {
    return isHorizontal ? (rangeEnd / 100) * barWidth : barHeight;
  };

  const getRangeHeight = (rangeEnd: number): number => {
    return isHorizontal ? barHeight : (rangeEnd / 100) * barWidth;
  };

  const getValueWidth = (): number => {
    return isHorizontal ? (valuePercent / 100) * barWidth : barHeight;
  };

  const getValueHeight = (): number => {
    return isHorizontal ? barHeight : (valuePercent / 100) * barWidth;
  };

  const getTargetPosition = (): number => {
    return isHorizontal
      ? (targetPercent / 100) * barWidth
      : barHeight - (targetPercent / 100) * barWidth;
  };

  const actualBarColor = colors.actual;
  const targetBarColor = colors.target;

  return (
    <g
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <rect
        x={isHorizontal ? 0 : 0}
        y={isHorizontal ? 0 : 0}
        width={isHorizontal ? barWidth : barHeight}
        height={isHorizontal ? barHeight : barWidth}
        fill="#E2E8F0"
        rx={4}
        className="dark:fill-slate-700"
      />

      {/* Poor Range */}
      <rect
        x={isHorizontal ? 0 : 0}
        y={isHorizontal ? 0 : 0}
        width={isHorizontal ? getRangeWidth(poorPercent) : barHeight}
        height={isHorizontal ? barHeight : getRangeHeight(poorPercent)}
        fill={colors.poor}
        rx={4}
      />

      {/* Average Range */}
      <rect
        x={isHorizontal ? getRangeWidth(poorPercent) : 0}
        y={isHorizontal ? 0 : getRangeHeight(poorPercent)}
        width={
          isHorizontal ? getRangeWidth(averagePercent - poorPercent) : barHeight
        }
        height={
          isHorizontal
            ? barHeight
            : getRangeHeight(averagePercent - poorPercent)
        }
        fill={colors.average}
      />

      {/* Good Range */}
      <rect
        x={isHorizontal ? getRangeWidth(averagePercent) : 0}
        y={isHorizontal ? 0 : getRangeHeight(averagePercent)}
        width={
          isHorizontal ? getRangeWidth(goodPercent - averagePercent) : barHeight
        }
        height={
          isHorizontal
            ? barHeight
            : getRangeHeight(goodPercent - averagePercent)
        }
        fill={colors.good}
      />

      {/* Excellent Range */}
      {excellentPercent > goodPercent && (
        <rect
          x={isHorizontal ? getRangeWidth(goodPercent) : 0}
          y={isHorizontal ? 0 : getRangeHeight(goodPercent)}
          width={
            isHorizontal
              ? getRangeWidth(excellentPercent - goodPercent)
              : barHeight
          }
          height={
            isHorizontal
              ? barHeight
              : getRangeHeight(excellentPercent - goodPercent)
          }
          fill={colors.excellent}
          rx={isHorizontal ? 0 : 4}
        />
      )}

      {/* Actual Value Bar */}
      <motion.rect
        initial={{ scaleX: 0, scaleY: 0 }}
        animate={{ scaleX: 1, scaleY: 1 }}
        transition={{ duration: animationDuration / 1000 }}
        x={isHorizontal ? 0 : 0}
        y={isHorizontal ? 0 : 0}
        width={getValueWidth()}
        height={getValueHeight()}
        fill={actualBarColor}
        rx={4}
        className="opacity-90"
      />

      {/* Target Marker */}
      <motion.line
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: animationDuration / 1000 }}
        x1={isHorizontal ? getTargetPosition() : 0}
        y1={isHorizontal ? 0 : getTargetPosition()}
        x2={isHorizontal ? getTargetPosition() : barHeight}
        y2={isHorizontal ? barHeight : getTargetPosition()}
        stroke={targetBarColor}
        strokeWidth={3}
        strokeLinecap="round"
        className={targetClassName}
      />

      {/* Tooltip */}
      {showTooltip && isHovered && (
        <g>
          <rect
            x={isHorizontal ? valuePercent / 2 - 50 : -60}
            y={isHorizontal ? -30 : valuePercent / 2 - 30}
            width={100}
            height={50}
            rx={6}
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            className="shadow-lg"
          />
          <text
            x={isHorizontal ? valuePercent / 2 : -10}
            y={isHorizontal ? -15 : valuePercent / 2 - 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-foreground"
          >
            Actual: {valueFormat ? valueFormat(value) : value}
          </text>
          <text
            x={isHorizontal ? valuePercent / 2 : -10}
            y={isHorizontal ? 0 : valuePercent / 2 + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            Target: {valueFormat ? valueFormat(target) : target}
          </text>
          <text
            x={isHorizontal ? valuePercent / 2 : -10}
            y={isHorizontal ? 15 : valuePercent / 2 + 25}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            Achievement: {Math.round((value / target) * 100)}%
          </text>
        </g>
      )}
    </g>
  );
}
