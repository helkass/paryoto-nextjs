// types/treemap.types.ts
export interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
  color?: string;
  metadata?: Record<string, any>;
}

export interface TreeMapProps {
  // Core
  data: TreeNode;
  width?: number;
  height?: number;

  // Display
  variant?: "default" | "squarified" | "slice" | "dice" | "slice-dice";
  colorScheme?: "default" | "green" | "blue" | "purple" | "red" | "custom";
  customColors?: string[];
  showLabels?: boolean;
  showValues?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;

  // Labels
  title?: string;
  description?: string;
  valueFormat?: (value: number) => string;
  labelFormat?: (name: string, value: number) => string;

  // Behavior
  interactive?: boolean;
  loading?: boolean;

  // Styling
  className?: string;
  cellClassName?: string;

  // Callbacks
  onCellClick?: (node: TreeNode, path: string[]) => void;
  onCellHover?: (node: TreeNode | null, path: string[]) => void;
}

export interface TreeMapCell {
  node: TreeNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  path: string[];
}

export interface TreeMapLegendProps {
  items: Array<{ name: string; color: string; value: number }>;
  valueFormat?: (value: number) => string;
  className?: string;
}
