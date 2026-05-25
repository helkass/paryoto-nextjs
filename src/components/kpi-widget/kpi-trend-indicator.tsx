// components/kpi-widget/kpi-trend-indicator.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiTrendIndicatorProps, KpiSize } from "@/types/kpi-widget.types";

const sizeClasses: Record<KpiSize, string> = {
  sm: "text-xs gap-0.5",
  md: "text-sm gap-1",
  lg: "text-base gap-1.5",
};

const iconSizes: Record<KpiSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const trendColors = {
  up: "text-emerald-500", // atau text-green-500
  down: "text-destructive", // text-destructive atau text-red-500
  stable: "text-muted-foreground",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function KpiTrendIndicator({
  trend,
  value,
  label,
  size = "md",
  className,
}: KpiTrendIndicatorProps) {
  const Icon = trendIcons[trend];
  const color = trendColors[trend];
  const formattedValue = `${
    trend === "up" ? "+" : trend === "down" ? "-" : ""
  }${Math.abs(value)}%`;

  const variants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn(
        "flex items-center whitespace-nowrap shrink-0",
        sizeClasses[size],
        className
      )}
    >
      <div>
        <div className="flex items-end justify-end">
          <Icon className={cn(iconSizes[size], color, "shrink-0")} />
          <span className={cn("font-medium", color)}>{formattedValue}</span>
        </div>
        {label && <span className="text-muted-foreground ml-1">{label}</span>}
      </div>
    </motion.div>
  );
}
