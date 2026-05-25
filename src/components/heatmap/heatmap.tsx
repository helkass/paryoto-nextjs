// components/heatmap/heatmap.tsx
"use client";

import * as React from "react";
import {
  format,
  startOfYear,
  endOfYear,
  subMonths,
  addMonths,
  isWithinInterval,
} from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { HeatmapCell } from "./heatmap-cell";
import { HeatmapLegend } from "./heatmap-legend";
import { HeatmapProps, HeatmapData } from "@/types/heatmap.types";
import {
  getColorSchemes,
  getColorForValue,
  generateWeekDays,
  getWeeksRange,
  getWeekdays,
  getMonths,
  getDayValue,
  getDayMetadata,
} from "@/lib/heatmap-utils";
import { Loader2 } from "lucide-react";

export function HeatMap({
  data,
  startDate,
  endDate,
  variant = "default",
  colorScheme = "default",
  customColors,
  showTooltip = true,
  showLegend = true,
  showWeekdays = true,
  showMonths = true,
  cellSize = 14,
  cellGap = 2,
  minValue,
  maxValue,
  title,
  description,
  emptyMessage = "No data available",
  interactive = true,
  loading = false,
  className,
  cellClassName,
  onCellClick,
  onCellHover,
  valueFormat,
  dateFormat,
}: HeatmapProps) {
  const [mounted, setMounted] = React.useState(false);
  const [hoveredData, setHoveredData] = React.useState<HeatmapData | null>(
    null
  );

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine date range (memoized to prevent recalculation)
  const actualStartDate = React.useMemo(
    () => startDate || startOfYear(new Date()),
    [startDate]
  );
  const actualEndDate = React.useMemo(
    () => endDate || endOfYear(new Date()),
    [endDate]
  );

  // Generate weeks and days (memoized)
  const weeks = React.useMemo(
    () => getWeeksRange(actualStartDate, actualEndDate),
    [actualStartDate, actualEndDate]
  );
  const weekdays = React.useMemo(() => getWeekdays(), []);
  const months = React.useMemo(
    () => getMonths(actualStartDate, actualEndDate),
    [actualStartDate, actualEndDate]
  );

  // Calculate value range (memoized)
  const values = React.useMemo(() => data.map((d) => d.value), [data]);
  const actualMinValue = React.useMemo(
    () => minValue ?? Math.min(0, ...values),
    [minValue, values]
  );
  const actualMaxValue = React.useMemo(
    () => maxValue ?? Math.max(1, ...values),
    [maxValue, values]
  );

  // Get color scheme (memoized)
  const colorSchemes = React.useMemo(() => getColorSchemes(), []);
  const colors =
    colorScheme === "custom"
      ? customColors || colorSchemes["default"]
      : colorSchemes[colorScheme];

  // Generate all days and group by week (memoized)
  const daysByWeek = React.useMemo(() => {
    const allDays = generateWeekDays(actualStartDate, actualEndDate);
    const result: Date[][] = [];
    for (let i = 0; i < weeks.length; i++) {
      const weekStart = weeks[i];
      const weekDays: Date[] = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + j);
        if (
          isWithinInterval(day, { start: actualStartDate, end: actualEndDate })
        ) {
          weekDays.push(day);
        }
      }
      result.push(weekDays);
    }
    return result;
  }, [weeks, actualStartDate, actualEndDate]);

  const getCellColor = React.useCallback(
    (date: Date): string => {
      const value = getDayValue(date, data);
      if (value === 0) return colors[0];
      return getColorForValue(value, actualMinValue, actualMaxValue, colors);
    },
    [data, colors, actualMinValue, actualMaxValue]
  );

  const handleCellClick = React.useCallback(
    (date: Date) => {
      if (!interactive) return;
      const value = getDayValue(date, data);
      const metadata = getDayMetadata(date, data);
      onCellClick?.({ date: date.toISOString(), value, metadata });
    },
    [interactive, data, onCellClick]
  );

  const handleCellHover = React.useCallback(
    (date: Date | null) => {
      if (!interactive) return;
      if (date) {
        const value = getDayValue(date, data);
        const metadata = getDayMetadata(date, data);
        setHoveredData({ date: date.toISOString(), value, metadata });
        onCellHover?.({ date: date.toISOString(), value, metadata });
      } else {
        setHoveredData(null);
        onCellHover?.(null);
      }
    },
    [interactive, data, onCellHover]
  );

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center",
          className
        )}
      >
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";
  const actualCellSize = isCompact
    ? cellSize * 0.75
    : isDetailed
    ? cellSize * 1.25
    : cellSize;
  const actualCellGap = isCompact
    ? cellGap * 0.8
    : isDetailed
    ? cellGap * 1.2
    : cellGap;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          {showMonths && (
            <div
              className="mb-1 flex"
              style={{ marginLeft: showWeekdays ? 40 : 0 }}
            >
              {months.map((month, idx) => (
                <div
                  key={idx}
                  className="text-xs text-muted-foreground"
                  style={{
                    width: month.weeks * (actualCellSize + actualCellGap),
                  }}
                >
                  {month.month}
                </div>
              ))}
            </div>
          )}

          <div className="flex">
            {/* Weekday Labels */}
            {showWeekdays && (
              <div
                className="mr-2 flex flex-col justify-around"
                style={{ gap: actualCellGap }}
              >
                {weekdays.map((day, idx) => (
                  <div
                    key={idx}
                    className="text-right text-xs text-muted-foreground"
                    style={{
                      height: actualCellSize,
                      lineHeight: `${actualCellSize}px`,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* Heatmap Grid */}
            <div className="flex" style={{ gap: actualCellGap }}>
              {daysByWeek.map((week, weekIdx) => (
                <div
                  key={weekIdx}
                  className="flex flex-col"
                  style={{ gap: actualCellGap }}
                >
                  {weekdays.map((_, dayIdx) => {
                    const date = week[dayIdx];
                    if (!date) {
                      return (
                        <div
                          key={`empty-${dayIdx}`}
                          style={{
                            width: actualCellSize,
                            height: actualCellSize,
                          }}
                        />
                      );
                    }

                    const value = getDayValue(date, data);
                    const color = getCellColor(date);

                    return (
                      <HeatmapCell
                        key={date.toISOString()}
                        data={{
                          date: date.toISOString(),
                          value,
                          metadata: getDayMetadata(date, data),
                        }}
                        color={color}
                        size={actualCellSize}
                        gap={0}
                        showTooltip={showTooltip && interactive}
                        valueFormat={valueFormat}
                        dateFormat={dateFormat}
                        onClick={() => handleCellClick(date)}
                        onHover={(d) =>
                          handleCellHover(d ? new Date(d.date) : null)
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex justify-end">
          <HeatmapLegend
            minValue={actualMinValue}
            maxValue={actualMaxValue}
            colors={colors}
            valueFormat={valueFormat}
          />
        </div>
      )}

      {/* Hover Info */}
      {interactive && hoveredData && (
        <div className="text-center text-sm text-muted-foreground">
          {dateFormat
            ? dateFormat(new Date(hoveredData.date))
            : format(new Date(hoveredData.date), "EEEE, d MMMM yyyy", {
                locale: id,
              })}
          {" - "}
          Value:{" "}
          {valueFormat ? valueFormat(hoveredData.value) : hoveredData.value}
        </div>
      )}
    </div>
  );
}
