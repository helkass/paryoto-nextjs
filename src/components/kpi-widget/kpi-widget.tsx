// components/kpi-widget/kpi-widget.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KpiSparkline } from "./kpi-sparkline";
import { KpiTrendIndicator } from "./kpi-trend-indicator";
import {
  KpiWidgetProps,
  KpiTrend,
  KpiVariant,
  KpiSize,
} from "@/types/kpi-widget.types";
import { Info, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

const variantClasses: Record<KpiVariant, string> = {
  default: "bg-card border-border",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  danger: "bg-danger/5 border-danger/20",
  info: "bg-info/5 border-info/20",
};

const sizeClasses: Record<KpiSize, string> = {
  sm: "p-3 gap-1",
  md: "p-4 gap-2",
  lg: "p-5 gap-3",
};

const titleSizes: Record<KpiSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const valueSizes: Record<KpiSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

const iconSizes: Record<KpiSize, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function KpiWidget({
  title,
  value,
  previousValue,
  target,
  sparklineData,
  sparklineColor,
  sparklineVariant = "area",
  trend,
  trendValue,
  trendLabel,
  valueFormat,
  prefix,
  suffix,
  decimals = 0,
  icon,
  iconColor,
  iconBackground = true,
  variant = "default",
  size = "md",
  showTrend = true,
  showTarget = false,
  showSparkline = true,
  showComparison = true,
  showChange = true,
  customColors,
  className,
  titleClassName,
  valueClassName,
  trendClassName,
  loading = false,
  animated = true,
  clickable = false,
  onClick,
  onRefresh,
  onInfo,
  tooltip,
}: KpiWidgetProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formattedValue = () => {
    if (typeof value === "string") return value;

    let formatted: string;
    if (valueFormat) {
      formatted = valueFormat(value);
    } else if (decimals !== undefined) {
      formatted = value.toFixed(decimals);
    } else {
      formatted = value.toLocaleString();
    }

    if (prefix) formatted = `${prefix}${formatted}`;
    if (suffix) formatted = `${formatted}${suffix}`;
    return formatted;
  };

  const getChange = (): number | null => {
    if (!previousValue || typeof value !== "number") return null;
    const change = ((value - previousValue) / previousValue) * 100;
    return change;
  };

  const getChangeDirection = (): KpiTrend | null => {
    const change = getChange();
    if (change === null) return null;
    if (change > 0) return "up";
    if (change < 0) return "down";
    return "stable";
  };

  const getTargetProgress = (): number | null => {
    if (!target || typeof value !== "number") return null;
    return (value / target) * 100;
  };

  const change = getChange();
  const changeDirection = getChangeDirection();
  const targetProgress = getTargetProgress();
  const displayTrend = trend || changeDirection || "stable";
  const displayTrendValue =
    trendValue !== undefined
      ? trendValue
      : Number(Math.abs(change || 0).toFixed(1));

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const valueVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  if (loading || !mounted) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-card p-4",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={clickable ? "hover" : undefined}
      className={cn(
        "relative rounded-lg border transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        clickable && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-lg",
                iconBackground && "bg-background/50",
                iconSizes[size]
              )}
              style={{ color: iconColor }}
            >
              {icon}
            </div>
          )}
          <div>
            <div className={cn("flex items-center gap-2", titleClassName)}>
              <h3
                className={cn(
                  "font-medium text-muted-foreground",
                  titleSizes[size]
                )}
              >
                {title}
              </h3>
              {tooltip && onInfo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInfo();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-3 w-3" />
                </button>
              )}
              {onRefresh && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefresh();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trend indicator */}
        {showTrend && displayTrendValue > 0 && (
          <KpiTrendIndicator
            trend={displayTrend}
            value={displayTrendValue}
            label={trendLabel}
            size={size}
            className={trendClassName}
          />
        )}
      </div>

      {/* Value */}
      <motion.div variants={valueVariants} className="space-y-1">
        <div className={cn("font-bold", valueSizes[size], valueClassName)}>
          {formattedValue()}
        </div>

        {/* Comparison and change */}
        {showComparison &&
          previousValue !== undefined &&
          change !== null &&
          showChange && (
            <div className="text-xs text-muted-foreground flex flex-col">
              vs{" "}
              {valueFormat
                ? valueFormat(previousValue)
                : previousValue.toLocaleString()}
              {changeDirection && (
                <span
                  className={cn(
                    "ml-1",
                    changeDirection === "up" ? "text-success" : "text-danger"
                  )}
                >
                  {changeDirection === "up" ? "↑" : "↓"}{" "}
                  {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </div>
          )}

        {/* Target progress */}
        {showTarget && targetProgress !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Target: {target}%</span>
              <span className="font-medium">
                {Math.min(100, Math.round(targetProgress))}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, targetProgress)}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Sparkline */}
      {showSparkline && sparklineData && sparklineData.length > 0 && (
        <div className="mt-2 flex justify-end">
          <KpiSparkline
            data={sparklineData}
            color={
              sparklineColor || customColors?.accent || "hsl(var(--primary))"
            }
            variant={sparklineVariant}
            height={size === "sm" ? 30 : size === "lg" ? 50 : 40}
            width={size === "sm" ? 100 : size === "lg" ? 140 : 120}
            animated={animated}
          />
        </div>
      )}
    </motion.div>
  );
}
