// components/heatmap/heatmap-cell.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { HeatmapCellProps } from "@/types/heatmap.types";

export function HeatmapCell({
  data,
  color,
  size,
  gap,
  showTooltip,
  valueFormat,
  dateFormat,
  onClick,
  onHover,
}: HeatmapCellProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const date = new Date(data.date);
  const formattedDate = dateFormat
    ? dateFormat(date)
    : format(date, "EEEE, d MMMM yyyy", { locale: id });
  const formattedValue = valueFormat
    ? valueFormat(data.value)
    : data.value.toString();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(data);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.1 }}
        onClick={() => onClick?.(data)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "rounded-sm transition-all duration-150",
          "cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary"
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          marginRight: gap,
          marginBottom: gap,
        }}
      />

      {showTooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-muted-foreground">Value: {formattedValue}</div>
          {data.metadata &&
            Object.entries(data.metadata).map(([key, val]) => (
              <div key={key} className="text-xs text-muted-foreground">
                {key}: {String(val)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
