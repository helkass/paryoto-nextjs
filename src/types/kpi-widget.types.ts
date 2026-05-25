// types/kpi-widget.types.ts
import { ReactNode } from "react";

export type KpiTrend = "up" | "down" | "stable";
export type KpiVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type KpiSize = "sm" | "md" | "lg";

export interface KpiWidgetProps {
  // Core
  title: string;
  value: number | string;
  previousValue?: number;
  target?: number;

  // Sparkline data
  sparklineData?: number[];
  sparklineColor?: string;
  sparklineVariant?: "line" | "area" | "bar";

  // Trend
  trend?: KpiTrend;
  trendValue?: number;
  trendLabel?: string;

  // Formatting
  valueFormat?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  decimals?: number;

  // Icon
  icon?: ReactNode;
  iconColor?: string;
  iconBackground?: boolean;

  // Display
  variant?: KpiVariant;
  size?: KpiSize;
  showTrend?: boolean;
  showTarget?: boolean;
  showSparkline?: boolean;
  showComparison?: boolean;
  showChange?: boolean;

  // Colors
  customColors?: {
    background?: string;
    text?: string;
    accent?: string;
  };

  // Styling
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  trendClassName?: string;

  // Behavior
  loading?: boolean;
  animated?: boolean;
  clickable?: boolean;

  // Callbacks
  onClick?: () => void;
  onRefresh?: () => void;
  onInfo?: () => void;

  // Tooltip
  tooltip?: string;
}

export interface KpiSparklineProps {
  data: number[];
  color: string;
  variant?: "line" | "area" | "bar";
  height?: number;
  width?: number;
  animated?: boolean;
}

export interface KpiTrendIndicatorProps {
  trend: KpiTrend;
  value: number;
  label?: string;
  size?: KpiSize;
  className?: string;
}
