// types/timeline-chart.types.ts
export interface TimelineTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress?: number;
  color?: string;
  dependencies?: string[];
  assignee?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed" | "delayed";
  metadata?: Record<string, any>;
}

export interface TimelineChartProps {
  // Core
  tasks: TimelineTask[];
  startDate?: Date;
  endDate?: Date;
  width?: number;
  height?: number;

  // Display
  viewMode?: "day" | "week" | "month" | "quarter";
  showWeekends?: boolean;
  showToday?: boolean;
  showProgress?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showDependencies?: boolean;

  // Labels
  valueFormat?: (date: Date) => string;
  taskNameFormat?: (name: string) => string;

  // Colors
  colorScheme?: "default" | "blue" | "green" | "purple" | "orange" | "rainbow";
  customColors?: Record<string, string>;
  weekendColor?: string;
  todayColor?: string;

  // Behavior
  animated?: boolean;
  animationDuration?: number;
  interactive?: boolean;
  zoomable?: boolean;
  draggable?: boolean;

  // Styling
  className?: string;
  taskClassName?: string;
  barClassName?: string;
  labelClassName?: string;

  // Title
  title?: string;
  description?: string;

  // Callbacks
  onTaskClick?: (task: TimelineTask) => void;
  onTaskHover?: (task: TimelineTask | null) => void;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;

  // Loading
  loading?: boolean;
}

export interface TimelineHeaderProps {
  startDate: Date;
  endDate: Date;
  viewMode: "day" | "week" | "month" | "quarter";
  cellWidth: number;
  valueFormat?: (date: Date) => string;
  showWeekends?: boolean;
  weekendColor?: string;
  className?: string;
}

export interface TimelineBarProps {
  task: TimelineTask;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  progress: number;
  showProgress: boolean;
  showTooltip: boolean;
  interactive: boolean;
  animated: boolean;
  animationDuration: number;
  valueFormat?: (date: Date) => string;
  className?: string;
  onBarClick?: (task: TimelineTask) => void;
  onBarHover?: (task: TimelineTask | null) => void;
}

export interface TimelineDependencyProps {
  fromTask: TimelineTask;
  toTask: TimelineTask;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  animated: boolean;
  animationDuration: number;
  className?: string;
}
