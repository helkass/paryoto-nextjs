// components/funnel-chart/funnel-stage.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FunnelStageProps } from "@/types/funnel-chart.types";

export function FunnelStage({
  stage,
  index,
  total,
  width,
  height,
  yOffset,
  color,
  showLabels,
  showValues,
  showPercentages,
  showTooltip,
  interactive,
  animated,
  valueFormat,
  percentageFormat,
  className,
  labelClassName,
  onStageClick,
  onStageHover,
}: FunnelStageProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  // Fix: percentage calculation
  const percentage = total > 0 ? (stage.value / total) * 100 : 0;

  // Smooth polygon points for path (rounded corners)
  const getSmoothPolygonPath = () => {
    const topWidth = width;
    const bottomWidth = width * 0.85;
    const cornerRadius = 12;
    const x0 = 0;
    const x1 = topWidth;
    const x2 = (topWidth - bottomWidth) / 2;
    const x3 = x2 + bottomWidth;
    const y0 = yOffset;
    const y1 = yOffset + height;

    // Top left arc
    return `
      M${x0 + cornerRadius},${y0}
      H${x1 - cornerRadius}
      Q${x1},${y0} ${x1},${y0 + cornerRadius}
      V${y1 - cornerRadius}
      Q${x1},${y1} ${x1 - cornerRadius},${y1}
      H${x3 + cornerRadius}
      Q${x3},${y1} ${x3},${y1 - cornerRadius}
      V${y0 + cornerRadius}
      Q${x3},${y0} ${x3 - cornerRadius},${y0}
      H${x0 + cornerRadius}
      Q${x0},${y0} ${x0},${y0 + cornerRadius}
      V${y1 - cornerRadius}
      Q${x0},${y1} ${x0 + cornerRadius},${y1}
      H${x2 - cornerRadius}
      Q${x2},${y1} ${x2},${y1 - cornerRadius}
      V${y0 + cornerRadius}
      Q${x2},${y0} ${x2 + cornerRadius},${y0}
      Z
    `;
  };

  const handleClick = () => {
    if (!interactive) return;
    onStageClick?.(stage, index);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    onStageHover?.(stage, index);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    onStageHover?.(null, null);
  };

  const stageVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18,
        delay: index * 0.08,
      },
    },
    hover: {
      scale: 1.03,
      filter: "brightness(1.08) drop-shadow(0 6px 12px rgba(0,0,0,0.10))",
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
  };

  const labelVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.08 + 0.15 },
    },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const displayValue = showValues ? valueFormat(stage.value) : "";
  const displayPercentage = showPercentages ? percentageFormat(percentage) : "";

  return (
    <g>
      {/* Stage shape with smooth corners */}
      <motion.path
        variants={stageVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : undefined}
        d={getSmoothPolygonPath()}
        fill={color}
        stroke="#fff"
        strokeOpacity={0.18}
        strokeWidth={2}
        className={cn(
          "transition-all duration-300",
          interactive && "cursor-pointer",
          className
        )}
        style={{
          filter: isHovered
            ? "brightness(1.07) drop-shadow(0 6px 16px rgba(0,0,0,0.10))"
            : "none",
          transition: "filter 0.25s cubic-bezier(.4,0,.2,1)",
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Glass overlay effect on hover */}
      {isHovered && (
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.13 }}
          exit={{ opacity: 0 }}
          d={getSmoothPolygonPath()}
          fill="#fff"
          style={{ mixBlendMode: "lighten" }}
          className="pointer-events-none"
        />
      )}

      {/* Label with smooth animation */}
      {showLabels && (
        <motion.g variants={labelVariants} initial="hidden" animate="visible">
          <text
            x={width + 18}
            y={yOffset + height / 2}
            dominantBaseline="middle"
            className={cn("font-medium fill-foreground", labelClassName)}
            style={{ fontSize: index === 0 ? "15px" : "13.5px" }}
          >
            <tspan x={width + 18} dy="-7">
              {stage.name}
            </tspan>
            {displayValue && (
              <tspan
                x={width + 18}
                dy="18"
                className="text-xs fill-muted-foreground"
              >
                {displayValue}
              </tspan>
            )}
            {displayPercentage && (
              <tspan
                x={width + 18}
                dy="16"
                className="text-xs fill-muted-foreground"
              >
                {displayPercentage}
              </tspan>
            )}
          </text>
        </motion.g>
      )}

      {/* Smooth Tooltip */}
      {showTooltip && interactive && isHovered && (
        <motion.g
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.18 }}
        >
          <defs>
            <filter
              id="tooltipShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodOpacity="0.13"
              />
            </filter>
          </defs>

          <rect
            x={width / 2 - 90}
            y={yOffset - 48}
            width={180}
            height={80}
            rx={10}
            fill="#fff"
            fillOpacity={0.97}
            stroke="#e5e7eb"
            strokeWidth={1}
            filter="url(#tooltipShadow)"
          />

          {/* Arrow pointer */}
          <polygon
            points={`
              ${width / 2 - 8},${yOffset - 8}
              ${width / 2},${yOffset + 4}
              ${width / 2 + 8},${yOffset - 8}
            `}
            fill="#fff"
            fillOpacity={0.97}
            stroke="#e5e7eb"
            strokeWidth={1}
          />

          <text
            x={width / 2}
            y={yOffset - 28}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold fill-foreground"
          >
            {stage.name}
          </text>

          <text
            x={width / 2}
            y={yOffset - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            Value: {valueFormat(stage.value)}
          </text>

          {stage.metadata &&
            Object.entries(stage.metadata).map(([key, val], idx) => (
              <text
                key={key}
                x={width / 2}
                y={yOffset + 10 + idx * 16}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-muted-foreground"
              >
                {key}: {String(val)}
              </text>
            ))}
        </motion.g>
      )}

      {/* Small value indicator inside stage */}
      {showValues && width > 100 && height > 40 && (
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.3 }}
          x={width / 2}
          y={yOffset + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium"
          fill="#fff"
          fillOpacity={0.85}
          style={{
            textShadow:
              "0 1px 4px rgba(0,0,0,0.18), 0 0.5px 0.5px rgba(0,0,0,0.10)",
          }}
        >
          {valueFormat(stage.value)}
        </motion.text>
      )}
    </g>
  );
}
