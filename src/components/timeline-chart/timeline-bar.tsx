// components/timeline-chart/timeline-bar.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimelineBarProps } from "@/types/timeline-chart.types";

export function TimelineBar({
  task,
  x,
  y,
  width,
  height,
  color,
  progress,
  showProgress,
  showTooltip,
  interactive,
  animated,
  animationDuration,
  valueFormat,
  className,
  onBarClick,
  onBarHover,
}: TimelineBarProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (!interactive) return;
    onBarClick?.(task);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    onBarHover?.(task);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    onBarHover?.(null);
  };

  const barVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: animationDuration / 1000 },
    },
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: animationDuration / 1000, delay: 0.2 },
    },
  };

  const formattedStartDate = valueFormat
    ? valueFormat(task.startDate)
    : format(task.startDate, "dd MMM yyyy");
  const formattedEndDate = valueFormat
    ? valueFormat(task.endDate)
    : format(task.endDate, "dd MMM yyyy");

  return (
    <g
      className={cn(interactive && "cursor-pointer", className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Task bar */}
      <motion.rect
        variants={barVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : undefined}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={4}
        className="transition-shadow duration-200"
        style={{
          filter: isHovered
            ? "brightness(0.95) drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
            : "none",
        }}
      />

      {/* Progress bar overlay */}
      {showProgress && progress > 0 && progress < 100 && (
        <motion.rect
          variants={progressVariants}
          initial="hidden"
          animate="visible"
          x={x}
          y={y}
          width={width * (progress / 100)}
          height={height}
          fill="rgba(255,255,255,0.3)"
          rx={4}
        />
      )}

      {/* Progress text */}
      {showProgress && progress > 0 && width > 40 && (
        <text
          x={x + 5}
          y={y + height / 2}
          dominantBaseline="middle"
          className="text-[10px] font-medium fill-white"
        >
          {Math.round(progress)}%
        </text>
      )}

      {/* Tooltip */}
      {showTooltip && interactive && isHovered && (
        <g>
          <rect
            x={x + width / 2 - 100}
            y={y - 60}
            width={200}
            height={70}
            rx={6}
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            className="shadow-lg"
          />
          <text
            x={x + width / 2}
            y={y - 40}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold fill-foreground"
          >
            {task.name}
          </text>
          <text
            x={x + width / 2}
            y={y - 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            {formattedStartDate} - {formattedEndDate}
          </text>
          {task.progress !== undefined && (
            <text
              x={x + width / 2}
              y={y - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              Progress: {task.progress}%
            </text>
          )}
          {task.assignee && (
            <text
              x={x + width / 2}
              y={y + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              Assignee: {task.assignee}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
