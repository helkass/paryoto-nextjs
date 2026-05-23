export interface ChartDataPoint {
  [key: string]: string | number | boolean | null | undefined;
  name?: string;
  date?: string;
  value?: number;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color?: string;
  stroke?: string;
  fill?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number | string;
  className?: string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export interface LineChartProps extends ChartProps {
  xAxisKey: string;
  series: ChartSeries[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  curveType?: "monotone" | "linear" | "step" | "natural";
}

export interface BarChartProps extends ChartProps {
  xAxisKey: string;
  series: ChartSeries[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  layout?: "vertical" | "horizontal";
  barSize?: number;
}

export interface PieChartProps extends ChartProps {
  dataKey: string;
  nameKey: string;
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface AreaChartProps extends LineChartProps {
  fillOpacity?: number;
  stackId?: string;
}

export interface ComposedChartProps extends ChartProps {
  xAxisKey: string;
  series: ChartSeries[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}
