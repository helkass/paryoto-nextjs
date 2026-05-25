// components/timeline-chart/timeline-dependency.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineDependencyProps } from "@/types/timeline-chart.types";

export function TimelineDependency({
  fromTask,
  toTask,
  fromX,
  fromY,
  toX,
  toY,
  animated,
  animationDuration,
  className,
}: TimelineDependencyProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.5,
      transition: { duration: animationDuration / 1000 },
    },
  };

  // Calculate bezier path for dependency line
  const midX = (fromX + toX) / 2;
  const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

  return (
    <g className={cn("pointer-events-none", className)}>
      <motion.path
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        d={path}
        fill="none"
        stroke="#9CA3AF"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        markerEnd="url(#arrowhead)"
      />

      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#9CA3AF" />
        </marker>
      </defs>
    </g>
  );
}
