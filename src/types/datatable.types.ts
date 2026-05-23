import {
  ColumnDef,
  Table,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

export interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface SortingConfig {
  id: string;
  desc: boolean;
}

export interface DataTableProps<TData, TValue = unknown> {
  // Core
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // Loading & Error
  loading?: boolean;
  error?: string | null;

  // Pagination
  pagination?: PaginationConfig;

  // Sorting
  sorting?: {
    enabled?: boolean;
    onSortChange?: (sorting: SortingState) => void;
  };

  // Filtering
  filtering?: {
    enabled?: boolean;
    globalFilter?: string;
    onGlobalFilterChange?: (filter: string) => void;
    columnFilters?: ColumnFiltersState;
    onColumnFilterChange?: (columnId: string, value: unknown) => void;
  };

  // Selection
  selection?: {
    enabled?: boolean;
    onSelectionChange?: (selectedRows: TData[]) => void;
    getRowId?: (row: TData) => string | number;
  };

  // Virtual Scrolling
  virtualScroll?: {
    enabled?: boolean;
    rowHeight?: number;
    overscan?: number;
  };

  // Export
  export?: {
    enabled?: boolean;
    filename?: string;
    onExport?: (data: TData[]) => void;
  };

  // Actions
  actions?: {
    onRowClick?: (row: TData) => void;
    rowActions?: (row: TData) => Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (row: TData) => void;
    }>;
  };

  // Styling
  className?: string;
  tableClassName?: string;
  rowClassName?: string | ((row: TData) => string);
  emptyMessage?: string;

  // Children
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination?: DataTableProps<TData>["pagination"];
}

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: ColumnDef<TData, TValue>;
  title: string;
}

export type SortDirection = "asc" | "desc" | false;
