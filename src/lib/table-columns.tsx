"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/datatable/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";

// Type untuk column options
interface ColumnOptions<TData> {
  accessorKey: keyof TData & string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  cell?: (value: unknown, row: TData) => React.ReactNode;
}

// Helper untuk membuat column dengan size yang tepat
export function createColumn<TData extends Record<string, unknown>>(
  options: ColumnOptions<TData>
): ColumnDef<TData> {
  return {
    accessorKey: options.accessorKey as string,
    header: ({ column }) => (
      <ColumnHeader column={column} title={options.header} />
    ),
    enableSorting: options.sortable ?? true,
    enableColumnFilter: options.filterable ?? false,
    size: options.width ?? 150,
    minSize: options.minWidth ?? 100,
    maxSize: options.maxWidth ?? 300,
    cell: ({ row }) => {
      const value = row.getValue(options.accessorKey as string);
      if (options.cell) {
        return options.cell(value, row.original);
      }
      return <span>{String(value ?? "")}</span>;
    },
  };
}

// Helper untuk text column
export function textColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: true,
    filterable: true,
    width: 150,
    minWidth: 120,
    maxWidth: 250,
    cell: (value) => <span className="truncate">{String(value ?? "")}</span>,
    ...options,
  });
}

// Helper untuk number column
export function numberColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: true,
    filterable: false,
    width: 120,
    minWidth: 100,
    maxWidth: 180,
    cell: (value) => {
      const num = Number(value);
      if (isNaN(num)) return "-";
      return (
        <span className="font-medium">
          {new Intl.NumberFormat("id-ID").format(num)}
        </span>
      );
    },
    ...options,
  });
}

// Helper untuk currency column (IDR)
export function currencyColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: true,
    filterable: false,
    width: 150,
    minWidth: 130,
    maxWidth: 200,
    cell: (value) => {
      const num = Number(value);
      if (isNaN(num)) return "-";
      return (
        <span className="font-semibold text-right">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(num)}
        </span>
      );
    },
    ...options,
  });
}

// Helper untuk date column
export function dateColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: true,
    filterable: false,
    width: 130,
    minWidth: 110,
    maxWidth: 160,
    cell: (value) => {
      if (!value) return "-";
      try {
        const date = new Date(value);
        return format(date, "dd MMM yyyy", { locale: id });
      } catch {
        return "-";
      }
    },
    ...options,
  });
}

// Helper untuk datetime column
export function datetimeColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: true,
    filterable: false,
    width: 160,
    minWidth: 140,
    maxWidth: 200,
    cell: (value) => {
      if (!value) return "-";
      try {
        const date = new Date(value);
        return format(date, "dd MMM yyyy HH:mm", { locale: id });
      } catch {
        return "-";
      }
    },
    ...options,
  });
}

// Helper untuk status badge column
interface StatusConfig {
  [key: string]: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export function statusColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  statusConfig: StatusConfig,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: true,
    filterable: true,
    width: 110,
    minWidth: 90,
    maxWidth: 140,
    cell: (value) => {
      const config = statusConfig[value];
      if (!config) return value;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    ...options,
  });
}

// Helper untuk selection column
export function selectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    minSize: 40,
    maxSize: 50,
  };
}

// Helper untuk action column dengan dropdown
interface ActionItem<TData> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: TData) => void;
  variant?: "default" | "destructive" | "ghost";
}

export function actionColumn<TData extends Record<string, unknown>>(
  actions: (row: TData) => ActionItem<TData>[]
): ColumnDef<TData> {
  return {
    id: "actions",
    header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const rowActions = actions(row.original);

      if (rowActions.length === 0) return "-";

      if (rowActions.length === 1) {
        const action = rowActions[0];
        return (
          <Button
            variant={action.variant === "destructive" ? "destructive" : "ghost"}
            size="sm"
            onClick={() => action.onClick(row.original)}
            className="h-8 w-8 p-0"
            title={action.label}
          >
            {action.icon ?? action.label}
          </Button>
        );
      }

      // Multiple actions dengan dropdown
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {rowActions.map((action, idx) => (
              <DropdownMenuItem
                key={idx}
                onClick={() => action.onClick(row.original)}
                className={
                  action.variant === "destructive" ? "text-destructive" : ""
                }
              >
                {action.icon && (
                  <span className="mr-2 h-4 w-4 flex items-center">
                    {action.icon}
                  </span>
                )}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 100,
    minSize: 80,
    maxSize: 120,
  };
}

// Helper untuk image column
export function imageColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: false,
    filterable: false,
    width: 60,
    minWidth: 50,
    maxWidth: 80,
    cell: (value) => {
      if (!value) return "-";
      return (
        <img
          src={String(value)}
          alt="preview"
          className="h-8 w-8 rounded object-cover"
        />
      );
    },
    ...options,
  });
}

// Helper untuk badge column dengan multiple items
export function badgeColumn<TData extends Record<string, unknown>>(
  accessorKey: keyof TData & string,
  header: string,
  badgeConfig?: Record<string, string>,
  options?: Partial<ColumnOptions<TData>>
): ColumnDef<TData> {
  return createColumn({
    accessorKey,
    header,
    sortable: false,
    filterable: false,
    width: 150,
    cell: (value) => {
      const items = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-wrap gap-1">
          {items.map((item, idx) => (
            <Badge key={idx} variant="outline">
              {badgeConfig?.[item] ?? item}
            </Badge>
          ))}
        </div>
      );
    },
    ...options,
  });
}
