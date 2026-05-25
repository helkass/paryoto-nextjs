// components/bullet-chart/bullet-chart.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BulletChartBar } from "./bullet-chart-bar";
import { BulletChartProps } from "@/types/bullet-chart.types";
import {
  getDefaultRanges,
  getDefaultColors,
  getAchievement,
  getStatus,
} from "@/lib/bullet-chart-utils";
import { Loader2, Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function BulletChart({
  data,
  width = 400,
  height = 80,
  orientation = "horizontal",
  showValue = true,
  showTarget = true,
  showRanges = true,
  showTitle = true,
  showTooltip = true,
  showComparison = true,
  colorScheme = "default",
  customColors,
  valueFormat = (val) => val.toLocaleString(),
  targetFormat,
  titleFormat,
  animated = true,
  animationDuration = 800,
  interactive = true,
  className,
  barClassName,
  targetClassName,
  loading = false,
}: BulletChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const min = data.min ?? 0;
  const max = data.max ?? Math.max(data.value, data.target) * 1.2;
  const ranges = data.ranges || getDefaultRanges(max);
  const defaultColors = getDefaultColors(colorScheme);
  const colors = {
    poor: customColors?.poor || defaultColors.poor,
    average: customColors?.average || defaultColors.average,
    good: customColors?.good || defaultColors.good,
    excellent: customColors?.excellent || defaultColors.excellent,
    target: customColors?.target || defaultColors.target,
    actual: customColors?.actual || defaultColors.actual,
  };

  const achievement = getAchievement(data.value, data.target);
  const status = getStatus(data.value, data.target);
  const isHorizontal = orientation === "horizontal";

  const statusColors = {
    excellent: "text-success",
    good: "text-primary",
    average: "text-warning",
    poor: "text-danger",
  };

  const statusIcons = {
    excellent: <TrendingUp className="h-4 w-4" />,
    good: <TrendingUp className="h-4 w-4" />,
    average: <Minus className="h-4 w-4" />,
    poor: <TrendingDown className="h-4 w-4" />,
  };

  if (!mounted || loading) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ width, height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const barHeight = isHorizontal ? height - 40 : width - 40;
  const barWidth = isHorizontal ? width : height - 40;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={cn("space-y-2", className)}
      style={{ width, height: isHorizontal ? height : width }}
    >
      {/* Title Row */}
      {showTitle && (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-1">
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-foreground truncate">
              {titleFormat ? titleFormat(data.title) : data.title}
            </h4>
            {data.metadata && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                {Object.entries(data.metadata).map(([key, val]) => (
                  <span
                    key={key}
                    className="inline-block truncate max-w-[12rem]"
                  >
                    <span className="font-medium">{key}:</span> {String(val)}
                  </span>
                ))}
              </div>
            )}
          </div>
          {showComparison && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60",
                statusColors[status]
              )}
            >
              <span>{statusIcons[status]}</span>
              <span className="text-sm font-semibold">
                {achievement.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      )}
      {/* Bullet Chart */}
      <div className="relative">
        <svg
          width={isHorizontal ? width : height}
          height={isHorizontal ? height : width}
          className="block"
        >
          <BulletChartBar
            value={data.value}
            target={data.target}
            min={min}
            max={max}
            ranges={ranges}
            colors={colors}
            orientation={orientation}
            width={barWidth}
            height={barHeight}
            animated={animated}
            animationDuration={animationDuration}
            showTooltip={showTooltip && interactive}
            valueFormat={valueFormat}
            className={barClassName}
            targetClassName={targetClassName}
          />
        </svg>
      </div>

      {/* Value Labels */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {showValue && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-sm bg-current" />
              <span>
                Actual:{" "}
                <span className="font-medium text-foreground">
                  {valueFormat(data.value)}
                </span>
              </span>
            </div>
          )}
          {showTarget && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-sm bg-current opacity-60" />
              <span>
                Target:{" "}
                <span className="font-medium text-foreground">
                  {targetFormat
                    ? targetFormat(data.target)
                    : valueFormat(data.target)}
                </span>
              </span>
            </div>
          )}
        </div>

        {showRanges && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: colors.poor }}
              />
              <span>Poor</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: colors.average }}
              />
              <span>Avg</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: colors.good }}
              />
              <span>Good</span>
            </div>
            {ranges.excellent && (
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: colors.excellent }}
                />
                <span>Exc</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
