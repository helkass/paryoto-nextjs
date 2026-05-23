// components/datagrid/data-grid-toolbar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { useState } from "react";

interface DataGridToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  filters?: React.ReactNode;
  totalItems?: number;
  onViewChange?: (view: "grid" | "list") => void;
  defaultView?: "grid" | "list";
  children?: React.ReactNode;
}

export function DataGridToolbar({
  searchPlaceholder = "Search...",
  onSearch,
  filters,
  totalItems,
  onViewChange,
  defaultView = "grid",
  children,
}: DataGridToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState<"grid" | "list">(defaultView);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleViewChange = (view: "grid" | "list") => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          {/* Search */}
          {onSearch && (
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          )}

          {/* Filters Toggle */}
          {filters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-9"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          )}

          {/* Total Items */}
          {totalItems !== undefined && (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalItems} items
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          {onViewChange && (
            <div className="flex rounded-md border">
              <Button
                variant={currentView === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewChange("grid")}
                className="rounded-r-none px-2"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={currentView === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewChange("list")}
                className="rounded-l-none px-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          {children}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && filters && (
        <div className="p-4 rounded-lg border bg-muted/50">{filters}</div>
      )}
    </div>
  );
}
