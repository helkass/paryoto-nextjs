// components/sankey/sankey-node.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SankeyNodePosition } from "@/types/sankey.types";

interface SankeyNodeProps {
  node: SankeyNodePosition;
  index: number;
  showLabels: boolean;
  showValues: boolean;
  showTooltip: boolean;
  interactive: boolean;
  animated: boolean;
  animationDuration: number;
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;
  className?: string;
  labelClassName?: string;
  onNodeClick?: (node: SankeyNodePosition) => void;
  onNodeHover?: (node: SankeyNodePosition | null) => void;
}

export function SankeyNode({
  node,
  index,
  showLabels,
  showValues,
  showTooltip,
  interactive,
  animated,
  animationDuration,
  valueFormat,
  labelFormat,
  className,
  labelClassName,
  onNodeClick,
  onNodeHover,
}: SankeyNodeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (!interactive) return;
    onNodeClick?.(node);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    onNodeHover?.(node);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    onNodeHover?.(null);
  };

  const nodeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: animationDuration / 1000, delay: index * 0.05 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const labelVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.05 + 0.1 },
    },
  };

  const formattedValue = valueFormat
    ? valueFormat(node.value)
    : node.value.toLocaleString();
  const displayLabel = labelFormat ? labelFormat(node.id) : node.id;

  return (
    <g
      className={cn(interactive && "cursor-pointer", className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Node rectangle */}
      <motion.rect
        variants={nodeVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : undefined}
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={node.color}
        rx={4}
        className="transition-shadow duration-200"
        style={{
          filter: isHovered
            ? "brightness(0.95) drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
            : "none",
        }}
      />

      {/* Node label */}
      {showLabels && (
        <motion.text
          variants={labelVariants}
          initial="hidden"
          animate="visible"
          x={node.x + node.width + 5}
          y={node.y + node.height / 2}
          dominantBaseline="middle"
          className={cn("text-sm fill-foreground", labelClassName)}
        >
          {displayLabel}
          {showValues && (
            <tspan className="text-xs fill-muted-foreground">
              {` (${formattedValue})`}
            </tspan>
          )}
        </motion.text>
      )}

      {/* Tooltip */}
      {showTooltip && interactive && isHovered && (
        <g>
          <rect
            x={node.x + node.width / 2 - 60}
            y={node.y - 35}
            width={120}
            height={50}
            rx={6}
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            className="shadow-lg"
          />
          <text
            x={node.x + node.width / 2}
            y={node.y - 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold fill-foreground"
          >
            {displayLabel}
          </text>
          <text
            x={node.x + node.width / 2}
            y={node.y + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            Value: {formattedValue}
          </text>
        </g>
      )}
    </g>
  );
}
