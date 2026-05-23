"use client";

import { PieChart } from "./pie-chart";
import { PieChartProps } from "./chart";

export function DonutChart(props: PieChartProps) {
  return <PieChart {...props} innerRadius={60} outerRadius={80} />;
}
