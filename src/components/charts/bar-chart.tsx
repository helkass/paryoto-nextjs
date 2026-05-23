// components/charts/bar-chart.tsx
"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { BarChartProps } from "./chart";
import { ChartSkeleton } from "./chart-skeleton";

export function BarChart({
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
  layout = "horizontal",
  barSize = 40,
}: BarChartProps) {
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

  const BarComponent = () => (
    <RechartsBarChart
      data={data}
      layout={layout}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      {showGrid && (
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      )}
      <XAxis
        dataKey={layout === "horizontal" ? xAxisKey : undefined}
        type={layout === "vertical" ? "number" : "category"}
        stroke="var(--foreground)"
        tick={{ fill: "var(--foreground)" }}
      />
      <YAxis
        dataKey={layout === "vertical" ? xAxisKey : undefined}
        type={layout === "vertical" ? "category" : "number"}
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
        <Bar
          key={s.dataKey}
          dataKey={s.dataKey}
          name={s.name}
          fill={s.color || s.fill || "var(--primary)"}
          stroke={s.stroke || "var(--primary)"}
          barSize={barSize}
          radius={[4, 4, 0, 0]}
        />
      ))}
    </RechartsBarChart>
  );

  return (
    <div className={cn("w-full", className)} style={{ height, width }}>
      <ResponsiveContainer>
        <BarComponent />
      </ResponsiveContainer>
    </div>
  );
}
