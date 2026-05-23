// hooks/useDataTable.ts
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseDataTableOptions<T> {
  queryKey: string[];
  fetchFn: (
    params: Record<string, unknown>
  ) => Promise<{ data: T[]; total: number }>;
  initialPageSize?: number;
  initialSort?: { field: string; direction: "asc" | "desc" };
  initialFilters?: Record<string, unknown>;
}

export function useDataTable<T>({
  queryKey,
  fetchFn,
  initialPageSize = 10,
  initialSort,
  initialFilters = {},
}: UseDataTableOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sorting, setSorting] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);

  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      sort: sorting,
      ...filters,
    };
  }, [currentPage, pageSize, sorting, filters]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...queryKey, queryParams],
    queryFn: () => fetchFn(queryParams),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSorting({ field, direction });
  };
  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handleExport = useCallback(async () => {
    try {
      const result = await fetchFn({ ...queryParams, export: true });
      return result.data;
    } catch (error) {
      toast.error("Failed to export data");
      throw error;
    }
  }, [fetchFn, queryParams]);

  return {
    data: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    pagination: {
      currentPage,
      pageSize,
      totalPages: Math.ceil((data?.total || 0) / pageSize),
      totalItems: data?.total || 0,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
    sorting: {
      current: sorting,
      onSortChange: handleSortChange,
    },
    filtering: {
      filters,
      onFilterChange: handleFilterChange,
      resetFilters,
    },
    refetch,
    exportData: handleExport,
  };
}
