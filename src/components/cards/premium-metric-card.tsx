"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MetricCardProps } from "@/types/datacard.types";

export function PremiumMetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  comparison,
  target,
  targetLabel = "Target",
  formatValue,
  onClick,
  className,
}: MetricCardProps) {
  const formattedValue =
    value !== undefined && formatValue && typeof value === "number"
      ? formatValue(value)
      : value;

  const progress =
    target !== undefined && typeof value === "number"
      ? (value / target) * 100
      : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl",
        className
      )}
      onClick={onClick}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative circle */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              {subtitle && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{subtitle}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {formattedValue}
              </span>
              {trend && (
                <span
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    trend.isPositive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
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
          </div>

          {/* Icon with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-3">
              {icon}
            </div>
          </div>
        </div>

        {/* Progress ring alternative */}
        {progress !== undefined && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{targetLabel}</span>
              <span className="font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Comparison */}
        {comparison && (
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                comparison.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {comparison.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(comparison.value)}%
            </span>
            <span className="text-muted-foreground">{comparison.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
