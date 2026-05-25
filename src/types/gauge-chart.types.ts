// types/gauge-chart.types.ts
export type GaugeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";
export type GaugeSize = "sm" | "md" | "lg" | "xl";

export interface GaugeChartProps {
  // Core
  value: number;
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;

  // Colors
  variant?: GaugeVariant;
  color?: string;
  segments?: {
    start: number;
    end: number;
    color: string;
    label?: string;
  }[];

  // Display
  size?: GaugeSize;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
  showMinMax?: boolean;
  showThresholds?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  animationDuration?: number;

  // Thresholds
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };

  // Needle
  showNeedle?: boolean;
  needleColor?: string;
  needleBaseColor?: string;

  // Labels
  labelFormatter?: (value: number) => string;

  // Styling
  className?: string;
  gaugeClassName?: string;
  labelClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;
}

export interface GaugeSegment {
  start: number;
  end: number;
  color: string;
  label?: string;
}
