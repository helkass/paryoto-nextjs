// components/waterfall-chart/waterfall-chart.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaterfallBar } from "./waterfall-bar";
import { WaterfallConnector } from "./waterfall-connector";
import {
  WaterfallChartProps,
  WaterfallData,
} from "@/types/waterfall-chart.types";
import {
  calculateCumulative,
  getBarColor,
  getTotalValue,
  getMinValue,
  getMaxValue,
  getChartRange,
} from "@/lib/waterfall-utils";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export function WaterfallChart({
  data,
  width = 800,
  height = 400,
  variant = "default",
  showValues = true,
  showLabels = true,
  showConnectors = true,
  showTooltip = true,
  showLegend = true,
  showTotal = true,
  positiveColor = "#10B981",
  negativeColor = "#EF4444",
  totalColor = "#3B82F6",
  customColors,
  valueFormat = (val) => val.toLocaleString(),
  labelFormat,
  totalLabel = "Total",
  startLabel = "Start",
  endLabel = "End",
  animated = true,
  animationDuration = 800,
  interactive = true,
  className,
  barClassName,
  labelClassName,
  title,
  description,
  loading = false,
}: WaterfallChartProps) {
  const [mounted, setMounted] = React.useState(false);
  const [hoveredBar, setHoveredBar] = React.useState<{
    data: WaterfallData;
    index: number;
  } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Add total if not present
  let processedData = [...data];
  if (showTotal && !data.some((item) => item.isTotal)) {
    const totalValue = getTotalValue(data);
    processedData.push({
      label: totalLabel,
      value: totalValue,
      isTotal: true,
    });
  }

  const cumulative = calculateCumulative(processedData);
  const minValue = getMinValue(cumulative, processedData);
  const maxValue = getMaxValue(cumulative, processedData);
  const { min: chartMin, max: chartMax } = getChartRange(minValue, maxValue);
  const chartRange = chartMax - chartMin;

  const padding = { top: 40, right: 60, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const barWidth = (chartWidth / processedData.length) * 0.7;
  const barSpacing = (chartWidth / processedData.length) * 0.3;

  const getY = (value: number): number => {
    return (
      padding.top +
      chartHeight -
      ((value - chartMin) / chartRange) * chartHeight
    );
  };

  const getBarHeight = (value: number): number => {
    return (Math.abs(value) / chartRange) * chartHeight;
  };

  const chartHeight = height - padding.top - padding.bottom;

  const handleBarClick = (item: WaterfallData, index: number) => {
    console.log("Bar clicked:", item);
  };

  const handleBarHover = (item: WaterfallData | null, index: number | null) => {
    setHoveredBar(item ? { data: item, index: index! } : null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  if (!mounted || loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className
        )}
        style={{ width, height }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  let runningTotal = 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="relative rounded-xl bg-gradient-to-br from-background to-muted/10 p-4 shadow-sm">
        <svg width={width} height={height} className="block">
          {/* Grid lines */}
          <defs>
            <linearGradient id="waterfallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.05"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const value = chartMin + (chartRange / 4) * i;
            const y = getY(value);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  strokeDasharray="4"
                />
                <text
                  x={padding.left - 5}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {valueFormat(value)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {processedData.map((item, index) => {
            const x =
              padding.left + index * (barWidth + barSpacing) + barWidth / 2;
            return (
              <text
                key={index}
                x={x}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn("text-xs fill-muted-foreground", labelClassName)}
              >
                {labelFormat ? labelFormat(item.label) : item.label}
              </text>
            );
          })}

          {/* Bars */}
          {processedData.map((item, index) => {
            const x = padding.left + index * (barWidth + barSpacing);
            const currentValue = item.value;
            const isTotal = item.isTotal || false;
            const isPositive = currentValue >= 0;
            const barValue = isTotal
              ? runningTotal + currentValue
              : currentValue;
            const barHeight = getBarHeight(Math.abs(barValue));
            const cumulativeValue = runningTotal;
            const yStart = getY(
              isTotal
                ? runningTotal
                : runningTotal + (isPositive ? 0 : currentValue)
            );
            const yEnd = getY(
              runningTotal +
                (isTotal ? currentValue : isPositive ? currentValue : 0)
            );
            const barY = isPositive ? yStart : yEnd;

            const color = getBarColor(
              item,
              positiveColor,
              negativeColor,
              totalColor,
              customColors
            );

            const result = (
              <WaterfallBar
                key={index}
                data={item}
                index={index}
                x={x}
                y={Math.min(yStart, yEnd)}
                width={barWidth}
                height={yStart - yEnd}
                color={color}
                isPositive={isPositive}
                isTotal={isTotal}
                previousValue={runningTotal}
                cumulativeValue={runningTotal}
                showValues={showValues}
                showConnectors={showConnectors}
                showTooltip={showTooltip}
                interactive={interactive}
                animated={animated}
                animationDuration={animationDuration}
                valueFormat={valueFormat}
                labelFormat={labelFormat}
                className={barClassName}
                onBarClick={handleBarClick}
                onBarHover={handleBarHover}
              />
            );

            if (!isTotal) {
              runningTotal += currentValue;
            }

            return result;
          })}

          {/* Zero baseline */}
          <line
            x1={padding.left}
            y1={getY(0)}
            x2={width - padding.right}
            y2={getY(0)}
            stroke="hsl(var(--primary))"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            className="opacity-50"
          />
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: positiveColor }}
            />
            <span className="text-xs text-muted-foreground">
              Positive Change
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: negativeColor }}
            />
            <span className="text-xs text-muted-foreground">
              Negative Change
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: totalColor }}
            />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/30 p-3 text-center">
        <div>
          <div className="text-xs text-muted-foreground">Starting Value</div>
          <div className="text-lg font-semibold">
            {valueFormat(cumulative[0] || 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Net Change</div>
          <div
            className={cn(
              "text-lg font-semibold",
              getTotalValue(processedData.filter((d) => !d.isTotal)) >= 0
                ? "text-success"
                : "text-danger"
            )}
          >
            {getTotalValue(processedData.filter((d) => !d.isTotal)) >= 0
              ? "+"
              : ""}
            {valueFormat(
              getTotalValue(processedData.filter((d) => !d.isTotal))
            )}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Ending Value</div>
          <div className="text-lg font-semibold">
            {valueFormat(
              cumulative[cumulative.length - 1] +
                (processedData[processedData.length - 1].isTotal
                  ? processedData[processedData.length - 1].value
                  : 0)
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
