// types/sankey.types.ts
export interface SankeyNode {
  id: string;
  name: string;
  color?: string;
  value?: number;
}

export interface SankeyLink {
  source: string | number;
  target: string | number;
  value: number;
  label?: string;
  color?: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SankeyDiagramProps {
  // Core
  data: SankeyData;
  width?: number;
  height?: number;

  // Display
  variant?: "default" | "curved" | "straight";
  nodeWidth?: number;
  nodePadding?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;

  // Colors
  colorScheme?: "default" | "blue" | "green" | "purple" | "orange" | "rainbow";
  nodeColors?: Record<string, string>;
  linkColors?: Record<string, string>;

  // Labels
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;

  // Behavior
  animated?: boolean;
  animationDuration?: number;
  interactive?: boolean;

  // Styling
  className?: string;
  nodeClassName?: string;
  linkClassName?: string;
  labelClassName?: string;

  // Title
  title?: string;
  description?: string;

  // Loading
  loading?: boolean;
}

export interface SankeyNodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  color: string;
}

export interface SankeyLinkPath {
  source: SankeyNodePosition;
  target: SankeyNodePosition;
  value: number;
  color: string;
  label?: string;
}
