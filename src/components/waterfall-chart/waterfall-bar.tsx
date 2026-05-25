// components/waterfall-chart/waterfall-bar.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaterfallBarProps } from "@/types/waterfall-chart.types";

export function WaterfallBar({
  data,
  index,
  x,
  y,
  width,
  height,
  color,
  isPositive,
  isTotal,
  previousValue,
  cumulativeValue,
  showValues,
  showConnectors,
  showTooltip,
  interactive,
  animated,
  animationDuration,
  valueFormat,
  labelFormat,
  className,
  onBarClick,
  onBarHover,
}: WaterfallBarProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const barHeight = Math.abs(height);
  const barY = height >= 0 ? y - barHeight : y;

  const handleClick = () => {
    if (!interactive) return;
    onBarClick?.(data, index);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    onBarHover?.(data, index);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    onBarHover?.(null, null);
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: animationDuration / 1000,
        delay: index * 0.05,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scaleY: 1.02,
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
    ? valueFormat(data.value)
    : data.value.toLocaleString();
  const formattedCumulative = valueFormat
    ? valueFormat(cumulativeValue + (isTotal ? 0 : data.value))
    : (cumulativeValue + (isTotal ? 0 : data.value)).toLocaleString();

  return (
    <g
      className={cn(interactive && "cursor-pointer", className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Connector line from previous bar */}
      {showConnectors && index > 0 && (
        <line
          x1={x}
          y1={previousValue >= 0 ? y - barHeight : y}
          x2={x}
          y2={cumulativeValue >= 0 ? y - barHeight : y}
          stroke="hsl(var(--border))"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          className="opacity-50"
        />
      )}

      {/* Bar */}
      <motion.rect
        variants={barVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : undefined}
        x={x}
        y={barY}
        width={width}
        height={barHeight}
        fill={color}
        rx={4}
        className="transition-shadow duration-200"
        style={{
          filter: isHovered
            ? "brightness(0.95) drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
            : "none",
        }}
      />

      {/* Value label on bar */}
      {showValues && barHeight > 25 && (
        <motion.text
          variants={labelVariants}
          initial="hidden"
          animate="visible"
          x={x + width / 2}
          y={barY + barHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium fill-white"
        >
          {isTotal ? formattedCumulative : formattedValue}
        </motion.text>
      )}

      {/* Value label above/below bar */}
      {showValues && barHeight <= 25 && (
        <motion.text
          variants={labelVariants}
          initial="hidden"
          animate="visible"
          x={x + width / 2}
          y={height >= 0 ? barY - 5 : barY + barHeight + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-muted-foreground"
        >
          {isTotal ? formattedCumulative : formattedValue}
        </motion.text>
      )}

      {/* Tooltip */}
      {showTooltip && interactive && isHovered && (
        <g>
          <rect
            x={x + width / 2 - 70}
            y={height >= 0 ? barY - 60 : barY + 20}
            width={140}
            height={isTotal ? 60 : 75}
            rx={6}
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            className="shadow-lg"
          />
          <text
            x={x + width / 2}
            y={height >= 0 ? barY - 40 : barY + 40}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold fill-foreground"
          >
            {labelFormat ? labelFormat(data.label) : data.label}
          </text>
          <text
            x={x + width / 2}
            y={height >= 0 ? barY - 20 : barY + 60}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            Change: {isPositive ? "+" : ""}
            {formattedValue}
          </text>
          {!isTotal && (
            <text
              x={x + width / 2}
              y={height >= 0 ? barY - 5 : barY + 75}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              Running Total: {formattedCumulative}
            </text>
          )}
          {data.metadata && (
            <text
              x={x + width / 2}
              y={height >= 0 ? barY + 10 : barY + 90}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              {Object.entries(data.metadata)
                .map(([key, val]) => `${key}: ${val}`)
                .join(", ")}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
