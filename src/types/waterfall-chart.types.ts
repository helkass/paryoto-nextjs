// types/waterfall-chart.types.ts
export interface WaterfallData {
  label: string;
  value: number;
  isTotal?: boolean;
  color?: string;
  metadata?: Record<string, any>;
}

export interface WaterfallChartProps {
  // Core
  data: WaterfallData[];
  width?: number;
  height?: number;

  // Display
  variant?: "default" | "rounded" | "connector";
  showValues?: boolean;
  showLabels?: boolean;
  showConnectors?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showTotal?: boolean;

  // Colors
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
  customColors?: Record<string, string>;

  // Labels
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;
  totalLabel?: string;
  startLabel?: string;
  endLabel?: string;

  // Behavior
  animated?: boolean;
  animationDuration?: number;
  interactive?: boolean;

  // Styling
  className?: string;
  barClassName?: string;
  labelClassName?: string;

  // Title
  title?: string;
  description?: string;

  // Loading
  loading?: boolean;
}

export interface WaterfallBarProps {
  data: WaterfallData;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isPositive: boolean;
  isTotal: boolean;
  previousValue: number;
  cumulativeValue: number;
  showValues: boolean;
  showConnectors: boolean;
  showTooltip: boolean;
  interactive: boolean;
  animated: boolean;
  animationDuration: number;
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;
  className?: string;
  onBarClick?: (data: WaterfallData, index: number) => void;
  onBarHover?: (data: WaterfallData | null, index: number | null) => void;
}

export interface WaterfallConnectorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  animated: boolean;
  animationDuration: number;
  className?: string;
}
