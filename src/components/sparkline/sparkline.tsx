// components/sparkline/sparkline.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SparklineTooltip } from "./sparkline-tooltip";
import { SparklineProps, SparklineData } from "@/types/sparkline.types";
import {
  normalizeData,
  getMinMax,
  getTrend,
  getTrendPercentage,
  getColorValue,
} from "@/lib/sparkline-utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function Sparkline({
  data,
  width = 150,
  height = 40,
  variant = "line",
  color = "default",
  customColor,
  showArea = true,
  showPoints = false,
  showTooltip = true,
  showTrend = true,
  showMinMax = false,
  animated = true,
  animationDuration = 300,
  interactive = true,
  valueFormat,
  labelFormat,
  tooltipFormatter,
  className,
  lineClassName,
  areaClassName,
  pointClassName,
  loading = false,
}: SparklineProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<{
    index: number;
    x: number;
    y: number;
  } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const normalizedData = normalizeData(data);
  const { min, max } = getMinMax(normalizedData);
  const trend = getTrend(normalizedData);
  const trendPercentage = getTrendPercentage(normalizedData);
  const colorValue = customColor || getColorValue(color);

  const padding = { top: 5, right: 5, bottom: 5, left: 5 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index: number): number => {
    return padding.left + (index / (normalizedData.length - 1)) * chartWidth;
  };

  const getY = (value: number): number => {
    const range = max - min;
    if (range === 0) return padding.top + chartHeight / 2;
    return padding.top + chartHeight - ((value - min) / range) * chartHeight;
  };

  const getLinePath = (): string => {
    if (normalizedData.length === 0) return "";

    let path = `M ${getX(0)} ${getY(normalizedData[0].value)}`;
    for (let i = 1; i < normalizedData.length; i++) {
      path += ` L ${getX(i)} ${getY(normalizedData[i].value)}`;
    }
    return path;
  };

  const getAreaPath = (): string => {
    if (normalizedData.length === 0) return "";

    let path = `M ${getX(0)} ${getY(normalizedData[0].value)}`;
    for (let i = 1; i < normalizedData.length; i++) {
      path += ` L ${getX(i)} ${getY(normalizedData[i].value)}`;
    }
    path += ` L ${getX(normalizedData.length - 1)} ${
      chartHeight + padding.top
    }`;
    path += ` L ${getX(0)} ${chartHeight + padding.top} Z`;
    return path;
  };

  const getBarPath = (index: number): string => {
    const x = getX(index);
    const barWidth = (chartWidth / normalizedData.length) * 0.7;
    const value = normalizedData[index].value;
    const y = getY(value);
    const barHeight = chartHeight + padding.top - y;
    const barX = x - barWidth / 2;

    return `M ${barX} ${y} L ${barX + barWidth} ${y} L ${barX + barWidth} ${
      chartHeight + padding.top
    } L ${barX} ${chartHeight + padding.top} Z`;
  };

  const getColumnPath = (index: number): string => {
    const x = getX(index);
    const columnWidth = (chartWidth / normalizedData.length) * 0.5;
    const value = normalizedData[index].value;
    const y = getY(value);
    const columnHeight = chartHeight + padding.top - y;
    const columnX = x - columnWidth / 2;

    return `M ${columnX} ${padding.top} L ${columnX + columnWidth} ${
      padding.top
    } L ${columnX + columnWidth} ${y} L ${columnX} ${y} Z`;
  };

  const handlePointHover = (
    index: number,
    event: React.MouseEvent<SVGCircleElement>
  ) => {
    if (!interactive || !showTooltip) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect =
      event.currentTarget.parentElement?.parentElement?.getBoundingClientRect();

    if (containerRect) {
      setHoveredPoint({
        index,
        x: rect.left - containerRect.left + 5,
        y: rect.top - containerRect.top - 10,
      });
    }
  };

  const getTooltipValue = () => {
    if (!hoveredPoint) return null;
    const point = normalizedData[hoveredPoint.index];
    if (tooltipFormatter) {
      return tooltipFormatter(point.value, point.label);
    }
    return undefined;
  };

  const trendIcon = {
    up: <TrendingUp className="h-3 w-3 text-success" />,
    down: <TrendingDown className="h-3 w-3 text-danger" />,
    stable: <Minus className="h-3 w-3 text-muted-foreground" />,
  };

  const trendColor = {
    up: "text-success",
    down: "text-danger",
    stable: "text-muted-foreground",
  };

  if (!mounted || loading) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ width, height }}
      >
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (normalizedData.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  const linePath = getLinePath();
  const areaPath = getAreaPath();

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <svg width={width} height={height} className="block">
        {/* Area under line */}
        {variant === "area" && showArea && (
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: animationDuration / 1000 }}
            d={areaPath}
            fill={colorValue}
            className={areaClassName}
          />
        )}

        {/* Area under line (default variant with showArea) */}
        {variant === "line" && showArea && (
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: animationDuration / 1000 }}
            d={areaPath}
            fill={colorValue}
            className={areaClassName}
          />
        )}

        {/* Line */}
        {(variant === "line" || variant === "area") && (
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: animationDuration / 1000,
              ease: "easeInOut",
            }}
            d={linePath}
            fill="none"
            stroke={colorValue}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={lineClassName}
          />
        )}

        {/* Bars */}
        {variant === "bar" && (
          <g>
            {normalizedData.map((_, index) => (
              <motion.path
                key={index}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: animationDuration / 1000,
                  delay: index * 0.02,
                }}
                d={getBarPath(index)}
                fill={colorValue}
                className="origin-bottom"
              />
            ))}
          </g>
        )}

        {/* Columns (vertical bars from top) */}
        {variant === "column" && (
          <g>
            {normalizedData.map((_, index) => (
              <motion.path
                key={index}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: animationDuration / 1000,
                  delay: index * 0.02,
                }}
                d={getColumnPath(index)}
                fill={colorValue}
                className="origin-top"
              />
            ))}
          </g>
        )}

        {/* Points */}
        {showPoints && (variant === "line" || variant === "area") && (
          <g>
            {normalizedData.map((point, index) => (
              <motion.circle
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                cx={getX(index)}
                cy={getY(point.value)}
                r={2.5}
                fill={colorValue}
                stroke="white"
                strokeWidth={1}
                className={cn(interactive && "cursor-pointer", pointClassName)}
                onMouseEnter={(e) => handlePointHover(index, e)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <SparklineTooltip
          value={normalizedData[hoveredPoint.index].value}
          label={normalizedData[hoveredPoint.index].label}
          x={hoveredPoint.x}
          y={hoveredPoint.y}
          valueFormat={valueFormat}
          labelFormat={labelFormat}
        />
      )}

      {/* Trend Indicator */}
      {showTrend && (
        <div className="absolute -right-1 -top-1 flex items-center gap-0.5 rounded-full bg-background/80 px-1 text-xs backdrop-blur-sm">
          {trendIcon[trend]}
          <span className={cn("text-xs font-medium", trendColor[trend])}>
            {Math.abs(trendPercentage).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Min/Max Labels */}
      {showMinMax && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground">
          <span>{valueFormat ? valueFormat(min) : min}</span>
          <span>{valueFormat ? valueFormat(max) : max}</span>
        </div>
      )}
    </div>
  );
}
