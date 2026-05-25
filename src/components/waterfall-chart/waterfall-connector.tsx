// components/waterfall-chart/waterfall-connector.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaterfallConnectorProps } from "@/types/waterfall-chart.types";

export function WaterfallConnector({
  x1,
  y1,
  x2,
  y2,
  animated,
  animationDuration,
  className,
}: WaterfallConnectorProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 0.5 },
  };

  if (!animated) {
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="hsl(var(--border))"
        strokeWidth={1}
        strokeDasharray="4 4"
        className={cn("opacity-50", className)}
      />
    );
  }

  return (
    <motion.line
      variants={pathVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: animationDuration / 1000, delay: 0.3 }}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="hsl(var(--border))"
      strokeWidth={1}
      strokeDasharray="4 4"
      className={cn("opacity-50", className)}
    />
  );
}
