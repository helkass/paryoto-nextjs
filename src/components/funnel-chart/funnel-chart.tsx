// components/funnel-chart/funnel-chart.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FunnelStage } from "./funnel-stage";
import {
  FunnelChartProps,
  FunnelStage as FunnelStageType,
} from "@/types/funnel-chart.types";
import {
  getDefaultColors,
  calculatePercentages,
  calculateConversionRates,
} from "@/lib/funnel-utils";
import { Loader2, TrendingDown } from "lucide-react";

export function FunnelChart({
  data,
  width = 700,
  height = 500,
  variant = "default",
  showLabels = true,
  showValues = true,
  showPercentages = true,
  showTooltip = true,
  showConnector = true,
  title,
  description,
  valueFormat = (val) => val.toLocaleString(),
  percentageFormat = (pct) => `${Math.round(pct)}%`,
  colorScheme = "default",
  customColors,
  interactive = true,
  loading = false,
  animated = true,
  className,
  stageClassName,
  labelClassName,
  onStageClick,
  onStageHover,
}: FunnelChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const stageHeight = height / data.length;
  const percentages = calculatePercentages(data);
  const conversionRates = calculateConversionRates(data);
  const colors = customColors || getDefaultColors(colorScheme, data.length);

  const getStageWidth = (percentage: number): number => {
    if (variant === "inverted") {
      return (width * (100 - percentage)) / 100;
    }
    if (variant === "pyramid") {
      const centerWidth = width * 0.4;
      const maxWidth = width * 0.9;
      const ratio = percentage / 100;
      return centerWidth + (maxWidth - centerWidth) * ratio;
    }
    return (width * percentage) / 100;
  };

  const getStageX = (percentage: number, stageWidth: number): number => {
    if (variant === "inverted") {
      return stageWidth;
    }
    if (variant === "pyramid") {
      return (width - stageWidth) / 2;
    }
    return 0;
  };

  const getPyramidY = (index: number): number => {
    if (variant !== "pyramid") return index * stageHeight;
    const totalHeight = height;
    const marginTop = totalHeight * 0.05;
    const availableHeight = totalHeight - marginTop * 2;
    const stepHeight = availableHeight / data.length;
    return marginTop + index * stepHeight;
  };

  const getConnectorLine = (
    index: number
  ): { x1: number; y1: number; x2: number; y2: number } => {
    const currentPercentage = percentages[index];
    const nextPercentage = percentages[index + 1];
    const currentWidth = getStageWidth(currentPercentage);
    const nextWidth = getStageWidth(nextPercentage);
    const currentX = getStageX(currentPercentage, currentWidth);
    const nextX = getStageX(nextPercentage, nextWidth);
    const y1 = (index + 1) * stageHeight;
    const y2 = (index + 1) * stageHeight;

    return {
      x1: currentX + currentWidth / 2,
      y1: y1 - 5,
      x2: nextX + nextWidth / 2,
      y2: y2 + 5,
    };
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className
        )}
        style={{ width, height }}
      >
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (loading) {
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

  if (!data.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20 text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        No data available
      </div>
    );
  }

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

      {/* Chart Container */}
      <div className="relative rounded-xl bg-gradient-to-br from-background to-muted/10 p-4 shadow-sm">
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height} className="block">
            {/* Background grid lines */}
            <defs>
              <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.1"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.02"
                />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background funnel shape */}
            <polygon
              points={`
                0,0
                ${width},0
                ${width * 0.85},${height}
                0,${height}
              `}
              fill="url(#funnelGradient)"
              opacity={0.3}
            />

            {/* Connectors with smooth animation */}
            {showConnector && variant !== "pyramid" && (
              <g>
                {data.slice(0, -1).map((_, index) => {
                  const line = getConnectorLine(index);
                  return (
                    <motion.line
                      key={`connector-${index}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      className="opacity-60"
                    />
                  );
                })}
              </g>
            )}

            {/* Stages */}
            {data.map((stage, index) => {
              const percentage = percentages[index];
              const stageWidth = getStageWidth(percentage);
              const stageX = getStageX(percentage, stageWidth);
              const yOffset =
                variant === "pyramid"
                  ? getPyramidY(index)
                  : index * stageHeight;
              const currentStageHeight =
                variant === "pyramid" ? stageHeight * 0.9 : stageHeight;

              return (
                <FunnelStage
                  key={stage.id}
                  stage={stage}
                  index={index}
                  total={data.length}
                  width={stageWidth}
                  height={currentStageHeight}
                  yOffset={yOffset}
                  color={colors[index]}
                  showLabels={showLabels}
                  showValues={showValues}
                  showPercentages={showPercentages}
                  showTooltip={showTooltip}
                  interactive={interactive}
                  animated={animated}
                  valueFormat={valueFormat}
                  percentageFormat={percentageFormat}
                  className={stageClassName}
                  labelClassName={labelClassName}
                  onStageClick={onStageClick}
                  onStageHover={onStageHover}
                />
              );
            })}
          </svg>

          {/* Conversion Rate Labels */}
          {showPercentages && variant !== "pyramid" && (
            <div className="absolute left-0 right-0 pointer-events-none">
              {data.map((stage, index) => {
                if (index === 0) return null;
                const rate = conversionRates[index];
                const yPosition = index * stageHeight - 12;

                return (
                  <motion.div
                    key={`rate-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap"
                    style={{ top: yPosition }}
                  >
                    <div className="flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
                      <TrendingDown className="h-3 w-3" />
                      {percentageFormat(rate)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Conversion Summary Card */}
      {data.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-4 text-center shadow-sm"
        >
          <div className="text-sm text-muted-foreground">
            Overall Conversion Rate
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {percentageFormat(conversionRates[conversionRates.length - 1])}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            From {data[0].name} to {data[data.length - 1].name}
          </div>

          {/* Mini progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${conversionRates[conversionRates.length - 1]}%`,
              }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
