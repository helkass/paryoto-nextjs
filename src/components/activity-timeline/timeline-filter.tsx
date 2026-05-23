"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterState {
  search: string;
  types: string[];
  dateRange: { start: Date; end: Date } | null;
}

interface TimelineFilterProps {
  onFilterChange: (filters: FilterState) => void;
  onSearchChange: (search: string) => void;
  onTypeChange: (types: string[]) => void;
  onDateRangeChange: (range: { start: Date; end: Date } | null) => void;
  onReset: () => void;
  types?: string[];
  className?: string;
}

export function TimelineFilter({
  onSearchChange,
  onTypeChange,
  onDateRangeChange,
  onReset,
  types = [],
  className,
}: TimelineFilterProps) {
  const [search, setSearch] = React.useState("");
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    onTypeChange(newTypes);
  };

  const handleDateRange = (range: { start: Date; end: Date } | null) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedTypes([]);
    setDateRange(null);
    onReset();
  };

  const hasFilters = search || selectedTypes.length > 0 || dateRange;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span>Filters</span>
              {hasFilters && (
                <span className="ml-1 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Event Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <Button
                      key={type}
                      variant={
                        selectedTypes.includes(type) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeToggle(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange ? (
                        `${format(dateRange.start, "dd MMM yyyy")} - ${format(
                          dateRange.end,
                          "dd MMM yyyy"
                        )}`
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dateRange?.start,
                        to: dateRange?.end,
                      }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          handleDateRange({ start: range.from, end: range.to });
                        } else {
                          handleDateRange(null);
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset Filters
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded">
              Search: {search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSearch("")}
              />
            </span>
          )}
          {selectedTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded"
            >
              Type: {type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTypeToggle(type)}
              />
            </span>
          ))}
          {dateRange && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded">
              Date: {format(dateRange.start, "dd MMM")} -{" "}
              {format(dateRange.end, "dd MMM")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleDateRange(null)}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
