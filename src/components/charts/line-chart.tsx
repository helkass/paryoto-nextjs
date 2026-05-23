"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { LineChartProps } from "./chart";
import { ChartSkeleton } from "./chart-skeleton";

export function LineChart({
  data,
  xAxisKey,
  series,
  height = 400,
  width = "100%",
  className,
  loading = false,
  error = null,
  emptyMessage = "No data available",
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curveType = "monotone",
}: LineChartProps) {
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

  return (
    <div className={cn("w-full", className)} style={{ height, width }}>
      <ResponsiveContainer>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          <YAxis
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            />
          )}
          {showLegend && <Legend />}
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type={curveType}
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color || s.stroke || "var(--primary)"}
              fill={s.fill || "transparent"}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
