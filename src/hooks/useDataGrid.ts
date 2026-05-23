// hooks/useDataGrid.ts
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

interface UseDataGridOptions<T> {
  queryKey: string[];
  fetchFn: (
    params: Record<string, unknown>
  ) => Promise<{ data: T[]; total: number }>;
  initialPageSize?: number;
  initialSearch?: string;
  initialFilters?: Record<string, unknown>;
  enableSearch?: boolean;
}

export function useDataGrid<T>({
  queryKey,
  fetchFn,
  initialPageSize = 12,
  initialSearch = "",
  initialFilters = {},
  enableSearch = true,
}: UseDataGridOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: currentPage,
      limit: pageSize,
      ...filters,
    };

    if (enableSearch && searchTerm) {
      params.search = searchTerm;
    }

    return params;
  }, [currentPage, pageSize, searchTerm, filters, enableSearch]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [...queryKey, queryParams],
    queryFn: () => fetchFn(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);
  const handleFilterChange = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm(initialSearch);
    setCurrentPage(1);
  }, [initialFilters, initialSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    data: data?.data || [],
    total: data?.total || 0,
    loading: isLoading || isFetching,
    error: error?.message || null,
    pagination: {
      currentPage,
      pageSize,
      totalPages: Math.ceil((data?.total || 0) / pageSize),
      totalItems: data?.total || 0,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
    search: {
      term: searchTerm,
      onSearch: handleSearch,
      enabled: enableSearch,
    },
    filters: {
      values: filters,
      onFilterChange: handleFilterChange,
      reset: resetFilters,
    },
    refetch,
  };
}
