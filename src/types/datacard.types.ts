// types/datacard.types.ts
import { ReactNode } from "react";

export interface DataCardProps {
  // Core
  title?: string;
  value?: string | number;
  subtitle?: string;
  icon?: ReactNode;

  // Trend
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };

  // Progress
  progress?: {
    value: number;
    max?: number;
    label?: string;
    showLabel?: boolean;
  };

  // Chart
  chart?: ReactNode;
  sparklineData?: number[];

  // Period
  period?: {
    label: string;
    options?: string[];
    value?: string;
    onChange?: (value: string) => void;
  };

  // Actions
  actions?: ReactNode;
  onRefresh?: () => void;
  onViewMore?: () => void;
  onClick?: () => void;

  // Badge
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  };

  // Loading & Error
  loading?: boolean;
  error?: string | null;

  // Variants
  variant?: "default" | "glass" | "gradient" | "bordered";

  // Accent
  accent?: {
    color: string;
    position?: "top" | "left" | "right" | "bottom";
  };

  // Animation
  animated?: boolean;

  // Styling
  className?: string;
  contentClassName?: string;

  // Children
  children?: ReactNode;
  footer?: ReactNode;
}

export interface StatsGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
      value: number;
      isPositive?: boolean;
    };
    onClick?: () => void;
  }>;
  columns?: 2 | 3 | 4;
  variant?: "default" | "glass" | "bordered";
  className?: string;
}

export interface MetricCardProps extends DataCardProps {
  target?: number;
  targetLabel?: string;
  formatValue?: (value: number) => string;
  comparison?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}
