// types/breadcrumb.types.ts
import { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  // Core
  items?: BreadcrumbItem[];
  dynamic?: boolean;

  // Behavior
  separator?: ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeIcon?: ReactNode;
  maxItems?: number;
  truncateLabels?: boolean;

  // Styling
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;

  // Customization
  customMapping?: Record<string, string>;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export interface BreadcrumbRoute {
  path: string;
  label: string;
  icon?: ReactNode;
}
