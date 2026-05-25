// components/kpi-widget/kpi-sparkline.tsx
"use client";

import * as React from "react";
import { motion, easeInOut } from "framer-motion";
import { KpiSparklineProps } from "@/types/kpi-widget.types";

export function KpiSparkline({
  data,
  color,
  variant = "line",
  height = 40,
  width = 120,
  animated = true,
}: KpiSparklineProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || data.length === 0) {
    return <div className="h-10 w-30 animate-pulse rounded bg-muted" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const padding = { top: 4, bottom: 4, left: 0, right: 0 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;
  const step = chartWidth / (data.length - 1);

  const getY = (value: number): number => {
    if (range === 0) return padding.top + chartHeight / 2;
    return padding.top + chartHeight - ((value - min) / range) * chartHeight;
  };

  const getLinePath = (): string => {
    let path = `M ${padding.left} ${getY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${padding.left + i * step} ${getY(data[i])}`;
    }
    return path;
  };

  const getAreaPath = (): string => {
    let path = `M ${padding.left} ${getY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${padding.left + i * step} ${getY(data[i])}`;
    }
    path += ` L ${padding.left + (data.length - 1) * step} ${
      height - padding.bottom
    }`;
    path += ` L ${padding.left} ${height - padding.bottom} Z`;
    return path;
  };

  const getBarPath = (index: number): string => {
    const x = padding.left + index * step;
    const barWidth = step * 0.6;
    const value = data[index];
    const y = getY(value);
    const barHeight = height - padding.bottom - y;
    const barX = x - barWidth / 2;
    return `M ${barX} ${y} L ${barX + barWidth} ${y} L ${barX + barWidth} ${
      height - padding.bottom
    } L ${barX} ${height - padding.bottom} Z`;
  };

  const linePath = getLinePath();
  const areaPath = getAreaPath();

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: easeInOut },
    },
  };

  const areaVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.2,
      transition: { duration: 0.5 },
    },
  };

  return (
    <svg width={width} height={height} className="block">
      {variant === "area" && (
        <motion.path
          variants={areaVariants}
          initial="hidden"
          animate="visible"
          d={areaPath}
          fill={color}
        />
      )}

      {(variant === "line" || variant === "area") && (
        <motion.path
          variants={pathVariants}
          initial="hidden"
          animate={animated ? "visible" : "visible"}
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {variant === "bar" && (
        <g>
          {data.map((_, index) => (
            <motion.path
              key={index}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              d={getBarPath(index)}
              fill={color}
              className="origin-bottom"
            />
          ))}
        </g>
      )}
    </svg>
  );
}
