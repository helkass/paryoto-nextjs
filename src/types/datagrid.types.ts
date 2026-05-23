// types/datagrid.types.ts
import { ReactNode } from "react";

export interface DataGridProps<TData> {
  // Core
  data: TData[];
  renderCard: (item: TData, index: number) => ReactNode;

  // Loading & Error
  loading?: boolean;
  error?: string | null;

  // Pagination
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };

  // Grid Configuration
  gridConfig?: {
    columns?: {
      default: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      "2xl"?: number;
    };
    gap?: number;
    cardMinWidth?: number;
    cardMaxWidth?: number;
  };

  // Filtering & Sorting
  filtering?: {
    enabled?: boolean;
    searchPlaceholder?: string;
    onSearch?: (searchTerm: string) => void;
    filters?: ReactNode;
  };

  // Selection
  selection?: {
    enabled?: boolean;
    onSelectionChange?: (selectedItems: TData[]) => void;
    getItemId?: (item: TData) => string | number;
  };

  // Empty State
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  // Styling
  className?: string;
  gridClassName?: string;
  cardClassName?: string;

  // Virtual Scroll
  virtualScroll?: {
    enabled?: boolean;
    itemHeight?: number;
    overscan?: number;
  };
}

export interface DataGridCardProps<TData> {
  item: TData;
  index: number;
  isSelected?: boolean;
  onSelect?: (item: TData) => void;
  onDoubleClick?: (item: TData) => void;
  className?: string;
}

export interface DataGridToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  filters?: ReactNode;
  totalItems?: number;
  onViewChange?: (view: "grid" | "list") => void;
  defaultView?: "grid" | "list";
  children?: ReactNode;
}
