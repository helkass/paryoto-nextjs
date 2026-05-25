// types/heatmap.types.ts
export interface HeatmapData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface HeatmapProps {
  // Core
  data: HeatmapData[];
  startDate?: Date;
  endDate?: Date;

  // Display
  variant?: "default" | "compact" | "detailed";
  colorScheme?: "default" | "green" | "blue" | "purple" | "red" | "custom";
  customColors?: string[];
  showTooltip?: boolean;
  showLegend?: boolean;
  showWeekdays?: boolean;
  showMonths?: boolean;
  cellSize?: number;
  cellGap?: number;

  // Value range
  minValue?: number;
  maxValue?: number;

  // Labels
  title?: string;
  description?: string;
  emptyMessage?: string;

  // Behavior
  interactive?: boolean;
  loading?: boolean;

  // Styling
  className?: string;
  cellClassName?: string;

  // Callbacks
  onCellClick?: (data: HeatmapData) => void;
  onCellHover?: (data: HeatmapData | null) => void;

  // Formatting
  valueFormat?: (value: number) => string;
  dateFormat?: (date: Date) => string;
}

export interface HeatmapCellProps {
  data: HeatmapData;
  color: string;
  size: number;
  gap: number;
  showTooltip: boolean;
  valueFormat?: (value: number) => string;
  dateFormat?: (date: Date) => string;
  onClick?: (data: HeatmapData) => void;
  onHover?: (data: HeatmapData | null) => void;
}

export interface HeatmapLegendProps {
  minValue: number;
  maxValue: number;
  colors: string[];
  valueFormat?: (value: number) => string;
  className?: string;
}
