// components/datatable/data-table.tsx
"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  PaginationState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";
import { DataTableProps } from "@/types/datatable.types";

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  loading = false,
  error = null,
  pagination: externalPagination,
  sorting: sortingConfig = { enabled: true },
  filtering: filteringConfig = { enabled: true },
  selection: selectionConfig,
  virtualScroll = { enabled: false, rowHeight: 48, overscan: 5 },
  export: exportConfig,
  actions,
  className,
  tableClassName,
  rowClassName,
  emptyMessage = "No data available",
  toolbar,
  footer,
}: DataTableProps<TData, TValue>) {
  // State management
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Internal pagination state untuk manual mode
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: externalPagination ? externalPagination.currentPage - 1 : 0,
      pageSize: externalPagination?.pageSize || 10,
    });
  // Sync internal pagination dengan external pagination
  React.useEffect(() => {
    if (externalPagination) {
      setInternalPagination({
        pageIndex: externalPagination.currentPage - 1,
        pageSize: externalPagination.pageSize,
      });
    }
  }, [externalPagination]);

  // Handle selection change
  React.useEffect(() => {
    if (selectionConfig?.onSelectionChange) {
      const selectedRows = Object.keys(rowSelection)
        .map((index) => data[parseInt(index)])
        .filter(Boolean);
      selectionConfig.onSelectionChange(selectedRows);
    }
  }, [rowSelection, data, selectionConfig]);

  // Handle pagination change
  const handlePaginationChange = React.useCallback(
    (
      updater: PaginationState | ((old: PaginationState) => PaginationState)
    ) => {
      const newPagination =
        typeof updater === "function" ? updater(internalPagination) : updater;

      setInternalPagination(newPagination);

      // Update external pagination jika ada
      if (externalPagination?.onPageChange) {
        externalPagination.onPageChange(newPagination.pageIndex + 1);
      }
      if (externalPagination?.onPageSizeChange) {
        externalPagination.onPageSizeChange(newPagination.pageSize);
      }
    },
    [internalPagination, externalPagination]
  );

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sortingConfig.enabled ? sorting : undefined,
      columnFilters: filteringConfig.enabled ? columnFilters : undefined,
      rowSelection: selectionConfig?.enabled ? rowSelection : undefined,
      globalFilter: filteringConfig.enabled ? globalFilter : undefined,
      pagination: externalPagination ? internalPagination : undefined,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: externalPagination ? handlePaginationChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortingConfig.enabled ? getSortedRowModel() : undefined,
    getFilteredRowModel: filteringConfig.enabled
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel: !externalPagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: !!externalPagination,
    enableRowSelection: selectionConfig?.enabled ?? false,
    enableMultiRowSelection: true,
  });

  // Virtual scrolling setup
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = virtualScroll.enabled
    ? useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => virtualScroll.rowHeight ?? 48,
        overscan: virtualScroll.overscan ?? 5,
      })
    : null;

  // Handle export
  const handleExport = () => {
    if (exportConfig?.onExport) {
      exportConfig.onExport(data);
    }
  };

  // Get current page info untuk display
  const getCurrentPageInfo = () => {
    if (externalPagination) {
      return {
        start:
          (externalPagination.currentPage - 1) * externalPagination.pageSize +
          1,
        end: Math.min(
          externalPagination.currentPage * externalPagination.pageSize,
          externalPagination.totalItems
        ),
        total: externalPagination.totalItems,
      };
    }

    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    return {
      start: pageIndex * pageSize + 1,
      end: Math.min(
        (pageIndex + 1) * pageSize,
        table.getFilteredRowModel().rows.length
      ),
      total: table.getFilteredRowModel().rows.length,
    };
  };

  // Loading state
  if (loading) {
    return (
      <DataTableSkeleton
        columns={columns.length}
        rows={10}
        className={className}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-destructive/50 bg-destructive/10 p-8",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-destructive text-sm font-medium">
            Error loading data
          </p>
          <p className="text-destructive/70 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  const pageInfo = getCurrentPageInfo();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {toolbar !== undefined ? (
        toolbar
      ) : (
        <DataTableToolbar
          table={table}
          globalFilter={filteringConfig.enabled ? globalFilter : undefined}
          onGlobalFilterChange={
            filteringConfig.enabled ? setGlobalFilter : undefined
          }
          onExport={exportConfig?.enabled ? handleExport : undefined}
        />
      )}

      {/* Table */}
      <div className="relative overflow-hidden w-full">
        <div
          ref={tableContainerRef}
          className={cn(
            "relative rounded-md border w-full overflow-auto",
            virtualScroll.enabled && "max-h-[600px]",
            tableClassName
          )}
        >
          <table className="w-full caption-bottom text-sm">
            <thead className="sticky top-0 z-10 bg-background border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : virtualScroll.enabled && rowVirtualizer ? (
                // Virtual scrolling render
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                        typeof rowClassName === "function"
                          ? rowClassName(row.original)
                          : rowClassName,
                        actions?.onRowClick && "cursor-pointer"
                      )}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      onClick={() => actions?.onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                // Regular render
                rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                      typeof rowClassName === "function"
                        ? rowClassName(row.original)
                        : rowClassName,
                      actions?.onRowClick && "cursor-pointer"
                    )}
                    onClick={() => actions?.onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {externalPagination && (
        <DataTablePagination
          currentPage={externalPagination.currentPage}
          pageSize={externalPagination.pageSize}
          totalPages={externalPagination.totalPages}
          totalItems={externalPagination.totalItems}
          onPageChange={externalPagination.onPageChange}
          onPageSizeChange={externalPagination.onPageSizeChange}
          pageInfo={pageInfo}
        />
      )}

      {!externalPagination && table.getPageCount() > 1 && (
        <DataTablePagination
          currentPage={table.getState().pagination.pageIndex + 1}
          pageSize={table.getState().pagination.pageSize}
          totalPages={table.getPageCount()}
          totalItems={table.getFilteredRowModel().rows.length}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(size) => table.setPageSize(size)}
          pageInfo={pageInfo}
        />
      )}

      {/* Footer */}
      {footer}
    </div>
  );
}
