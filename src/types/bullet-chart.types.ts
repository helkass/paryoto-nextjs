// types/bullet-chart.types.ts
export interface BulletChartData {
  title: string;
  value: number;
  target: number;
  min?: number;
  max?: number;
  ranges?: {
    poor: number;
    average: number;
    good: number;
    excellent?: number;
  };
  metadata?: Record<string, any>;
}

export interface BulletChartProps {
  // Core
  data: BulletChartData;
  width?: number;
  height?: number;

  // Display
  orientation?: "horizontal" | "vertical";
  showValue?: boolean;
  showTarget?: boolean;
  showRanges?: boolean;
  showTitle?: boolean;
  showTooltip?: boolean;
  showComparison?: boolean;

  // Colors
  colorScheme?: "default" | "blue" | "green" | "purple" | "orange" | "red";
  customColors?: {
    poor?: string;
    average?: string;
    good?: string;
    excellent?: string;
    target?: string;
    actual?: string;
  };

  // Labels
  valueFormat?: (value: number) => string;
  targetFormat?: (value: number) => string;
  titleFormat?: (title: string) => string;

  // Behavior
  animated?: boolean;
  animationDuration?: number;
  interactive?: boolean;

  // Styling
  className?: string;
  barClassName?: string;
  targetClassName?: string;

  // Loading
  loading?: boolean;
}

export interface BulletChartBarProps {
  value: number;
  target: number;
  min: number;
  max: number;
  ranges: {
    poor: number;
    average: number;
    good: number;
    excellent?: number;
  };
  colors: {
    poor: string;
    average: string;
    good: string;
    excellent: string;
    target: string;
    actual: string;
  };
  orientation: "horizontal" | "vertical";
  width: number;
  height: number;
  animated: boolean;
  animationDuration: number;
  showTooltip: boolean;
  valueFormat?: (value: number) => string;
  className?: string;
  targetClassName?: string;
}
