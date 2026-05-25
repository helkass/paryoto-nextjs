// components/sparkline/sparkline-tooltip.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SparklineTooltipProps } from "@/types/sparkline.types";

export function SparklineTooltip({
  value,
  label,
  x,
  y,
  valueFormat,
  labelFormat,
}: SparklineTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="pointer-events-none absolute z-50 rounded-md bg-popover px-2 py-1 text-xs shadow-md"
      style={{ left: x, top: y - 30 }}
    >
      <div className="font-medium">
        {valueFormat ? valueFormat(value) : value.toLocaleString()}
      </div>
      {label && (
        <div className="text-muted-foreground">
          {labelFormat ? labelFormat(label) : label}
        </div>
      )}
    </motion.div>
  );
}
