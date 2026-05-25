// components/timeline-chart/timeline-chart.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInQuarters,
  addDays,
  isWeekend,
  isToday,
  format,
} from "date-fns";
import { cn } from "@/lib/utils";
import { TimelineHeader } from "./timeline-header";
import { TimelineBar } from "./timeline-bar";
import { TimelineDependency } from "./timeline-dependency";
import { TimelineChartProps, TimelineTask } from "@/types/timeline-chart.types";
import { getColorScheme } from "@/lib/sankey-layout";
import { Loader2, ZoomIn, ZoomOut, Move } from "lucide-react";

export function TimelineChart({
  tasks,
  startDate: propStartDate,
  endDate: propEndDate,
  width = 1200,
  height = 500,
  viewMode = "day",
  showWeekends = true,
  showToday = true,
  showProgress = true,
  showTooltip = true,
  showLegend = true,
  showDependencies = true,
  valueFormat,
  taskNameFormat,
  colorScheme = "default",
  customColors,
  weekendColor = "#F3F4F6",
  todayColor = "#FEF3C7",
  animated = true,
  animationDuration = 800,
  interactive = true,
  zoomable = true,
  draggable = false,
  className,
  taskClassName,
  barClassName,
  labelClassName,
  title,
  description,
  onTaskClick,
  onTaskHover,
  onDateRangeChange,
  loading = false,
}: TimelineChartProps) {
  const [mounted, setMounted] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);

  // Calculate date range
  const startDate =
    propStartDate ||
    new Date(Math.min(...tasks.map((t) => t.startDate.getTime())));
  const endDate =
    propEndDate || new Date(Math.max(...tasks.map((t) => t.endDate.getTime())));

  // Calculate total days based on view mode
  const getTotalUnits = () => {
    switch (viewMode) {
      case "day":
        return differenceInDays(endDate, startDate) + 1;
      case "week":
        return differenceInWeeks(endDate, startDate) + 1;
      case "month":
        return differenceInMonths(endDate, startDate) + 1;
      case "quarter":
        return differenceInQuarters(endDate, startDate) + 1;
      default:
        return differenceInDays(endDate, startDate) + 1;
    }
  };

  const baseCellWidth = 40;
  const cellWidth = baseCellWidth * zoomLevel;
  const totalWidth = getTotalUnits() * cellWidth;
  const rowHeight = 40;

  // Get cell index for a date
  const getCellIndex = (date: Date): number => {
    switch (viewMode) {
      case "day":
        return differenceInDays(date, startDate);
      case "week":
        return differenceInWeeks(date, startDate);
      case "month":
        return differenceInMonths(date, startDate);
      case "quarter":
        return differenceInQuarters(date, startDate);
      default:
        return differenceInDays(date, startDate);
    }
  };

  // Calculate task position and width
  const getTaskPosition = (task: TimelineTask) => {
    const startIndex = getCellIndex(task.startDate);
    const endIndex = getCellIndex(task.endDate);
    const x = startIndex * cellWidth;
    const width = (endIndex - startIndex + 1) * cellWidth;
    const y = tasks.indexOf(task) * rowHeight;
    return { x, y, width };
  };

  // Get task color
  const getTaskColor = (task: TimelineTask, index: number): string => {
    if (customColors && customColors[task.id]) return customColors[task.id];
    if (task.color) return task.color;

    const colors = getColorScheme(colorScheme, index, tasks.length);
    return colors;
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className
        )}
        style={{ width, height }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20 text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        No tasks available
      </div>
    );
  }

  const todayIndex = getCellIndex(new Date());
  const isTodayInRange = todayIndex >= 0 && todayIndex < getTotalUnits();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Zoom Controls */}
      {zoomable && (
        <div className="flex gap-2">
          <button
            onClick={handleZoomOut}
            className="rounded-md border p-1 hover:bg-muted"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="rounded-md border p-1 hover:bg-muted"
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="ml-2 text-sm text-muted-foreground">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      )}

      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto rounded-lg border shadow-sm"
        style={{ width, height }}
      >
        <div
          ref={timelineRef}
          className="relative"
          style={{ width: totalWidth + 192 }}
        >
          {/* Header */}
          <TimelineHeader
            startDate={startDate}
            endDate={endDate}
            viewMode={viewMode}
            cellWidth={cellWidth}
            valueFormat={valueFormat}
            showWeekends={showWeekends}
            weekendColor={weekendColor}
          />

          {/* Tasks rows */}
          <div className="relative">
            {tasks.map((task, index) => {
              const { x, y, width: barWidth } = getTaskPosition(task);
              const color = getTaskColor(task, index);
              const progress = task.progress || 0;

              return (
                <div
                  key={task.id}
                  className="group relative flex border-b hover:bg-muted/30"
                  style={{ height: rowHeight }}
                >
                  {/* Task name column */}
                  <div className="sticky left-0 z-10 flex w-48 items-center border-r bg-background px-4 text-sm group-hover:bg-muted/30">
                    <span className="truncate">
                      {taskNameFormat ? taskNameFormat(task.name) : task.name}
                    </span>
                    {task.priority === "high" && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>

                  {/* Timeline background */}
                  <div className="relative" style={{ width: totalWidth }}>
                    {/* Grid lines */}
                    {Array.from({ length: getTotalUnits() }).map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute top-0 h-full border-r"
                        style={{ left: idx * cellWidth, width: cellWidth }}
                      />
                    ))}

                    {/* Weekend highlighting */}
                    {showWeekends &&
                      Array.from({ length: getTotalUnits() }).map((_, idx) => {
                        const date = addDays(startDate, idx);
                        if (isWeekend(date)) {
                          return (
                            <div
                              key={`weekend-${idx}`}
                              className="absolute top-0 h-full bg-muted/30"
                              style={{
                                left: idx * cellWidth,
                                width: cellWidth,
                              }}
                            />
                          );
                        }
                        return null;
                      })}

                    {/* Today marker */}
                    {showToday && isTodayInRange && (
                      <div
                        className="absolute top-0 z-10 w-px bg-orange-500"
                        style={{ left: todayIndex * cellWidth, height: "100%" }}
                      >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-orange-500 px-1 text-[10px] text-white">
                          Today
                        </div>
                      </div>
                    )}

                    {/* Task bar */}
                    <svg
                      width={totalWidth}
                      height={rowHeight}
                      className="absolute top-0 left-0"
                    >
                      <TimelineBar
                        task={task}
                        x={x}
                        y={2}
                        width={barWidth}
                        height={rowHeight - 4}
                        color={color}
                        progress={progress}
                        showProgress={showProgress}
                        showTooltip={showTooltip}
                        interactive={interactive}
                        animated={animated}
                        animationDuration={animationDuration}
                        valueFormat={valueFormat}
                        className={barClassName}
                        onBarClick={onTaskClick}
                        onBarHover={onTaskHover}
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dependencies */}
          {showDependencies && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: totalWidth, height: tasks.length * rowHeight }}
            >
              {tasks.map((task, index) => {
                if (!task.dependencies) return null;
                const { x: fromX, y: fromY } = getTaskPosition(task);

                return task.dependencies.map((depId, depMapIndex) => {
                  const depTask = tasks.find((t) => t.id === depId);
                  if (!depTask) return null;
                  const depTaskIndex = tasks.indexOf(depTask);
                  const { x: toX, y: toY } = getTaskPosition(depTask);

                  return (
                    <TimelineDependency
                      key={`dep-${task.id}-${depMapIndex}`}
                      fromTask={depTask}
                      toTask={task}
                      fromX={toX + cellWidth}
                      fromY={depTaskIndex * rowHeight + rowHeight / 2}
                      toX={fromX}
                      toY={index * rowHeight + rowHeight / 2}
                      animated={animated}
                      animationDuration={animationDuration}
                    />
                  );
                });
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-xs text-muted-foreground">Task</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          {showProgress && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500 opacity-50" />
              <span className="text-xs text-muted-foreground">Progress</span>
            </div>
          )}
          {showDependencies && (
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-gray-400" />
              <span className="text-xs text-muted-foreground">Dependency</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
