// components/timeline-chart/timeline-header.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  isWeekend,
} from "date-fns";
import { cn } from "@/lib/utils";
import { TimelineHeaderProps } from "@/types/timeline-chart.types";

export function TimelineHeader({
  startDate,
  endDate,
  viewMode,
  cellWidth,
  valueFormat,
  showWeekends = true,
  weekendColor = "#F3F4F6",
  className,
}: TimelineHeaderProps) {
  const getTimeUnits = () => {
    switch (viewMode) {
      case "day":
        return eachDayOfInterval({ start: startDate, end: endDate });
      case "week":
        return eachWeekOfInterval({ start: startDate, end: endDate });
      case "month":
        return eachMonthOfInterval({ start: startDate, end: endDate });
      case "quarter":
        return eachQuarterOfInterval({ start: startDate, end: endDate });
      default:
        return eachDayOfInterval({ start: startDate, end: endDate });
    }
  };

  const timeUnits = getTimeUnits();
  const totalWidth = timeUnits.length * cellWidth;

  const getUnitLabel = (date: Date): string => {
    if (valueFormat) return valueFormat(date);

    switch (viewMode) {
      case "day":
        return format(date, "d MMM");
      case "week":
        return `W${format(date, "w")}`;
      case "month":
        return format(date, "MMM yyyy");
      case "quarter":
        return `Q${Math.ceil((date.getMonth() + 1) / 3)} ${format(
          date,
          "yyyy"
        )}`;
      default:
        return format(date, "d MMM");
    }
  };

  const getSubUnitLabel = (date: Date): string => {
    switch (viewMode) {
      case "day":
        return format(date, "EEEE");
      case "week":
        return format(date, "d MMM");
      case "month":
        return format(date, "MMMM");
      case "quarter":
        return format(date, "MMM");
      default:
        return "";
    }
  };

  return (
    <div className={cn("sticky top-0 z-10 bg-background", className)}>
      {/* Main header row */}
      <div className="flex border-b">
        {/* Task name column */}
        <div className="sticky left-0 z-20 w-48 border-r bg-background px-4 py-2 text-sm font-medium">
          Task
        </div>

        {/* Timeline header */}
        <div className="flex" style={{ width: totalWidth }}>
          {timeUnits.map((date, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-col items-center justify-center border-r text-center",
                !showWeekends && isWeekend(date) && "hidden",
                isWeekend(date) && `bg-${weekendColor}`
              )}
              style={{ width: cellWidth }}
            >
              <div className="text-xs font-medium text-muted-foreground">
                {getUnitLabel(date)}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {getSubUnitLabel(date)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
