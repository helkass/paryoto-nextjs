// types/sparkline.types.ts
export type SparklineVariant = "line" | "area" | "bar" | "column";
export type SparklineColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "custom";

export interface SparklineData {
  value: number;
  label?: string;
  timestamp?: Date | string;
}

export interface SparklineProps {
  // Core
  data: number[] | SparklineData[];
  width?: number;
  height?: number;

  // Display
  variant?: SparklineVariant;
  color?: SparklineColor;
  customColor?: string;
  showArea?: boolean;
  showPoints?: boolean;
  showTooltip?: boolean;
  showTrend?: boolean;
  showMinMax?: boolean;

  // Behavior
  animated?: boolean;
  animationDuration?: number;
  interactive?: boolean;

  // Labels
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;

  // Tooltip
  tooltipFormatter?: (value: number, label?: string) => string;

  // Styling
  className?: string;
  lineClassName?: string;
  areaClassName?: string;
  pointClassName?: string;

  // Loading
  loading?: boolean;
}

export interface SparklineTooltipProps {
  value: number;
  label?: string;
  x: number;
  y: number;
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;
}
