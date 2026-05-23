// components/cards/data-card.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { DataCardProps } from "@/types/datacard.types";

const variantStyles = {
  default: "bg-card border-border shadow-sm hover:shadow-md",
  glass:
    "bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-lg",
  gradient:
    "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20",
  bordered: "bg-transparent border-2 border-border hover:border-primary/50",
};

const accentStyles = {
  top: "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
  left: "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
  right: "absolute right-0 top-0 bottom-0 w-1 rounded-r-xl",
  bottom: "absolute bottom-0 left-0 right-0 h-1 rounded-b-xl",
};

const badgeVariants = {
  default: "bg-muted text-muted-foreground",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const sparklineColors = {
  up: "stroke-green-500 fill-green-500/20",
  down: "stroke-red-500 fill-red-500/20",
  neutral: "stroke-primary fill-primary/20",
};

export function DataCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  chart,
  sparklineData,
  period,
  actions,
  onRefresh,
  onViewMore,
  onClick,
  badge,
  loading = false,
  error = null,
  variant = "default",
  accent,
  animated = true,
  className,
  contentClassName,
  children,
  footer,
}: DataCardProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [selectedPeriod, setSelectedPeriod] = React.useState(
    period?.value || "weekly"
  );

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const handlePeriodChange = (periodValue: string) => {
    setSelectedPeriod(periodValue);
    period?.onChange?.(periodValue);
  };

  // Simple sparkline component
  const Sparkline = ({
    data,
    trend,
  }: {
    data: number[];
    trend?: { isPositive?: boolean };
  }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - ((value - min) / range) * 100,
    }));

    const pathData = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const trendColor = trend?.isPositive
      ? "up"
      : trend?.isPositive === false
      ? "down"
      : "neutral";

    return (
      <svg viewBox="0 0 100 40" className="w-full h-10">
        <path
          d={pathData}
          fill="none"
          strokeWidth="2"
          className={sparklineColors[trendColor]}
        />
        <path
          d={`${pathData} L 100 40 L 0 40 Z`}
          fill="currentColor"
          className={sparklineColors[trendColor].replace("stroke", "fill")}
          opacity="0.1"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div
        className={cn(
          "relative rounded-xl overflow-hidden",
          variantStyles[variant],
          className
        )}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-8 bg-muted rounded w-32 animate-pulse" />
            </div>
            <div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "relative rounded-xl overflow-hidden border-destructive/50",
          variantStyles[variant],
          className
        )}
      >
        <div className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <p className="text-sm text-destructive font-medium mb-2">
            Failed to load data
          </p>
          <p className="text-xs text-muted-foreground mb-3">{error}</p>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              className="text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const CardWrapper = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        whileHover: { scale: 1.01, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <CardWrapper
      {...animationProps}
      className={cn(
        "relative rounded-xl transition-all duration-300",
        variantStyles[variant],
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Accent bar */}
      {accent && (
        <div
          className={accentStyles[accent.position || "top"]}
          style={{
            backgroundColor: accent.color,
            width:
              accent.position === "left" || accent.position === "right"
                ? "4px"
                : "auto",
            height:
              accent.position === "top" || accent.position === "bottom"
                ? "4px"
                : "auto",
          }}
        />
      )}

      {/* Content */}
      <div className={cn("p-6", contentClassName)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mb-2",
                  badgeVariants[badge.variant || "default"]
                )}
              >
                {badge.text}
              </span>
            )}
            {title && (
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
            )}
            {value !== undefined && (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold tracking-tight">
                  {value}
                </span>
                {trend && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-sm font-medium",
                      trend.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div
              className={cn(
                "rounded-xl p-2.5 transition-all duration-300",
                isHovered ? "bg-primary/10 scale-110" : "bg-muted",
                "text-primary"
              )}
            >
              {icon}
            </div>
          )}

          {/* Actions Menu */}
          {(actions || onRefresh) && (
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {onRefresh && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh();
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground",
                      isRefreshing && "animate-spin"
                    )}
                  />
                </button>
              )}
              {actions}
            </div>
          )}
        </div>

        {/* Period Selector */}
        {period && period.options && (
          <div className="flex gap-1 mb-4 p-1 bg-muted/50 rounded-lg">
            {period.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handlePeriodChange(opt)}
                className={cn(
                  "flex-1 px-2 py-1 text-xs rounded-md transition-all",
                  selectedPeriod === opt
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        {children ? (
          children
        ) : (
          <>
            {/* Sparkline Chart */}
            {sparklineData && !chart && (
              <div className="mt-4">
                <Sparkline data={sparklineData} trend={trend} />
              </div>
            )}

            {/* Custom Chart */}
            {chart && <div className="mt-4">{chart}</div>}

            {/* Progress Bar */}
            {progress && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {progress.label || "Progress"}
                  </span>
                  <span className="font-medium">{progress.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (progress.value / (progress.max || 100)) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                {progress.showLabel && progress.max && (
                  <p className="text-xs text-muted-foreground">
                    Target: {progress.max.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-border">{footer}</div>
        )}

        {/* View More Button */}
        {onViewMore && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewMore();
            }}
            className="mt-4 w-full flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <span>View Details</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </CardWrapper>
  );
}
