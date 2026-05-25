// lib/funnel-utils.ts
import { FunnelStage } from "@/types/funnel-chart.types";

export const calculatePercentages = (data: FunnelStage[]): number[] => {
  if (data.length === 0) return [];
  const maxValue = data[0].value;
  return data.map((stage) => (stage.value / maxValue) * 100);
};

export const calculateConversionRates = (data: FunnelStage[]): number[] => {
  if (data.length === 0) return [];
  const rates: number[] = [100];
  for (let i = 1; i < data.length; i++) {
    const rate = (data[i].value / data[i - 1].value) * 100;
    rates.push(rate);
  }
  return rates;
};

export const getDefaultColors = (
  colorScheme: string,
  count: number
): string[] => {
  const schemes: Record<string, string[]> = {
    default: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
    blue: ["#1E3A8A", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA"],
    green: ["#064E3B", "#047857", "#10B981", "#34D399", "#6EE7B7"],
    purple: ["#4C1D95", "#6D28D9", "#8B5CF6", "#A855F7", "#C084FC"],
    red: ["#7F1D1D", "#991B1B", "#DC2626", "#EF4444", "#F87171"],
    orange: ["#7C2D12", "#9A3412", "#EA580C", "#F97316", "#FB923C"],
  };

  const colors = schemes[colorScheme] || schemes.default;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

export const getCurvedPath = (
  x1: number,
  y1: number,
  width1: number,
  x2: number,
  y2: number,
  width2: number
): string => {
  const cp1x = x1 + width1 / 2;
  const cp1y = y1 + (y2 - y1) * 0.3;
  const cp2x = x2 + width2 / 2;
  const cp2y = y2 - (y2 - y1) * 0.3;

  return `M ${x1} ${y1} 
          C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2 + width2} ${y2}
          L ${x2} ${y2}
          C ${cp2x - width2} ${cp2y}, ${cp1x - width1} ${cp1y}, ${
    x1 + width1
  } ${y1} Z`;
};
