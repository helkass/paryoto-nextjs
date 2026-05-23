"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PieChartProps } from "./chart";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "./chart-skeleton";

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PieChart({
  data,
  dataKey,
  nameKey,
  height = 400,
  width = "100%",
  className,
  loading = false,
  error = null,
  emptyMessage = "No data available",
  innerRadius = 0,
  outerRadius = 80,
  showLabel = false,
  showLegend = true,
  showTooltip = true,
}: PieChartProps) {
  if (loading) {
    return <ChartSkeleton height={height} className={className} />;
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10",
          className
        )}
        style={{ height }}
      >
        <p className="text-destructive text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-muted bg-muted/20",
          className
        )}
        style={{ height }}
      >
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }
  const renderLabel = showLabel
    ? (entry: Record<string, string | number>) => entry[nameKey]
    : undefined;

  return (
    <div className={cn("w-full", className)} style={{ height, width }}>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            label={renderLabel}
            labelLine={showLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            />
          )}
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
