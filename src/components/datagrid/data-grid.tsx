"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { DataGridSkeleton } from "./data-grid-skeleton";
import { DataGridProps } from "@/types/datagrid.types";
import { DataGridToolbar } from "./data-grid-toolbar";
import { DataGridPagination } from "./data-grid-pagination";

export function DataGrid<TData>({
  data,
  renderCard,
  loading = false,
  error = null,
  pagination,
  gridConfig = {
    columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 },
    gap: 4,
    cardMinWidth: 250,
    cardMaxWidth: 350,
  },
  filtering,
  selection,
  emptyMessage = "No data available",
  emptyIcon,
  className,
  gridClassName,
  cardClassName,
  virtualScroll = { enabled: false, itemHeight: 300, overscan: 5 },
}: DataGridProps<TData>) {
  const [selectedItems, setSelectedItems] = React.useState<
    Set<string | number>
  >(new Set());
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Helper to get item ID
  const getItemId = React.useCallback(
    (item: TData): string | number => {
      if (selection?.getItemId) {
        return selection.getItemId(item);
      }
      // Fallback: check if item has id property
      const itemWithId = item as Record<string, unknown>;
      return (itemWithId.id as string | number) || "";
    },
    [selection]
  );
  // Handle selection
  const handleSelect = React.useCallback(
    (item: TData) => {
      if (!selection?.enabled) return;

      const itemId = getItemId(item);
      const newSelected = new Set(selectedItems);

      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }

      setSelectedItems(newSelected);

      const selectedData = data.filter((item) => {
        const id = getItemId(item);
        return newSelected.has(id);
      });

      selection.onSelectionChange?.(selectedData);
    },
    [data, selection, selectedItems, getItemId]
  );

  // Clear selection
  const clearSelection = React.useCallback(() => {
    setSelectedItems(new Set());
    selection?.onSelectionChange?.([]);
  }, [selection]);
  // Get grid columns based on screen size
  const getGridColumns = React.useCallback(() => {
    const { columns = { default: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 } } =
      gridConfig;
    return {
      default: columns.default,
      sm: columns.sm ?? columns.default,
      md: columns.md ?? columns.sm ?? columns.default,
      lg: columns.lg ?? columns.md ?? columns.sm ?? columns.default,
      xl:
        columns.xl ?? columns.lg ?? columns.md ?? columns.sm ?? columns.default,
      "2xl":
        columns["2xl"] ??
        columns.xl ??
        columns.lg ??
        columns.md ??
        columns.sm ??
        columns.default,
    };
  }, [gridConfig]);

  // Always call the hook, but only use it when virtual scroll is enabled
  const allRowVirtualizer = useVirtualizer({
    count: Math.ceil(data.length / getGridColumns().default),
    getScrollElement: () => containerRef.current,
    estimateSize: () => virtualScroll.itemHeight ?? 300,
    overscan: virtualScroll.overscan ?? 5,
  });

  // Only use the virtualizer if virtual scroll is enabled
  const rowVirtualizer = virtualScroll.enabled ? allRowVirtualizer : null;

  // Loading state
  if (loading) {
    return (
      <DataGridSkeleton
        itemCount={pagination?.pageSize || 12}
        gridColumns={getGridColumns()}
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

  // Empty state
  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
      >
        {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const gridColumnsClass = getGridColumns();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <DataGridToolbar
        searchPlaceholder={filtering?.searchPlaceholder}
        onSearch={filtering?.onSearch}
        filters={filtering?.filters}
        totalItems={data.length}
        onViewChange={setViewMode}
        defaultView={viewMode}
      >
        {selection?.enabled && selectedItems.size > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{selectedItems.size} selected</span>
            <button
              onClick={clearSelection}
              className="text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </DataGridToolbar>

      {/* Grid/List View */}
      <div
        ref={containerRef}
        className={cn(
          virtualScroll.enabled && "overflow-auto max-h-[600px]",
          gridClassName
        )}
      >
        {viewMode === "grid" ? (
          // Grid View
          <div
            className={cn(
              "grid",
              `grid-cols-${gridColumnsClass.default}`,
              `sm:grid-cols-${gridColumnsClass.sm}`,
              `md:grid-cols-${gridColumnsClass.md}`,
              `lg:grid-cols-${gridColumnsClass.lg}`,
              `xl:grid-cols-${gridColumnsClass.xl}`,
              `2xl:grid-cols-${gridColumnsClass["2xl"]}`
            )}
            style={{
              gap: `${gridConfig.gap ?? 4}px`,
            }}
          >
            {virtualScroll.enabled && rowVirtualizer ? (
              // Virtual Scroll Grid
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const startIndex =
                    virtualRow.index * gridColumnsClass.default;
                  const endIndex = Math.min(
                    startIndex + gridColumnsClass.default,
                    data.length
                  );
                  const rowData = data.slice(startIndex, endIndex);

                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                        display: "grid",
                        gridTemplateColumns: `repeat(${gridColumnsClass.default}, minmax(0, 1fr))`,
                        gap: `${gridConfig.gap ?? 4}px`,
                      }}
                    >
                      {" "}
                      {rowData.map((item, idx) => {
                        const itemId = getItemId(item);
                        const isSelected =
                          selection?.enabled && selectedItems.has(itemId);

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelect(item)}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              isSelected && "ring-2 ring-primary rounded-lg"
                            )}
                          >
                            {renderCard(item, startIndex + idx)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Regular Grid
              data.map((item, index) => {
                const itemId = getItemId(item);
                const isSelected =
                  selection?.enabled && selectedItems.has(itemId);

                return (
                  <div
                    key={itemId ?? index}
                    onClick={() => handleSelect(item)}
                    onDoubleClick={() =>
                      selection?.enabled && handleSelect(item)
                    }
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      isSelected && "ring-2 ring-primary rounded-lg",
                      cardClassName
                    )}
                  >
                    {renderCard(item, index)}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {data.map((item, index) => {
              const itemId = getItemId(item);
              const isSelected =
                selection?.enabled && selectedItems.has(itemId);

              return (
                <div
                  key={itemId ?? index}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isSelected && "ring-2 ring-primary rounded-lg",
                    cardClassName
                  )}
                >
                  {renderCard(item, index)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <DataGridPagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  );
}
