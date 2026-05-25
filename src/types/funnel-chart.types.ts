// types/funnel-chart.types.ts
export interface FunnelStage {
  id: string;
  name: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface FunnelChartProps {
  // Core
  data: FunnelStage[];
  width?: number;
  height?: number;

  // Display
  variant?: "default" | "pyramid" | "inverted" | "curved";
  showLabels?: boolean;
  showValues?: boolean;
  showPercentages?: boolean;
  showTooltip?: boolean;
  showConnector?: boolean;

  // Labels
  title?: string;
  description?: string;
  valueFormat?: (value: number) => string;
  percentageFormat?: (percentage: number) => string;

  // Colors
  colorScheme?:
    | "default"
    | "blue"
    | "green"
    | "purple"
    | "red"
    | "orange"
    | "custom";
  customColors?: string[];

  // Behavior
  interactive?: boolean;
  loading?: boolean;
  animated?: boolean;

  // Styling
  className?: string;
  stageClassName?: string;
  labelClassName?: string;

  // Callbacks
  onStageClick?: (stage: FunnelStage, index: number) => void;
  onStageHover?: (stage: FunnelStage | null, index: number | null) => void;
}

export interface FunnelStageProps {
  stage: FunnelStage;
  index: number;
  total: number;
  width: number;
  height: number;
  yOffset: number;
  color: string;
  showLabels: boolean;
  showValues: boolean;
  showPercentages: boolean;
  showTooltip: boolean;
  interactive: boolean;
  animated: boolean;
  valueFormat: (value: number) => string;
  percentageFormat: (percentage: number) => string;
  className?: string;
  labelClassName?: string;
  onStageClick?: (stage: FunnelStage, index: number) => void;
  onStageHover?: (stage: FunnelStage | null, index: number | null) => void;
}
