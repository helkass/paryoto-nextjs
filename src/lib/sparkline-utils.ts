// lib/sparkline-utils.ts
import { SparklineData } from "@/types/sparkline.types";

export const normalizeData = (
  data: number[] | SparklineData[]
): SparklineData[] => {
  if (data.length === 0) return [];

  if (typeof data[0] === "number") {
    return (data as number[]).map((value, index) => ({
      value,
      label: index.toString(),
    }));
  }

  return data as SparklineData[];
};

export const getMinMax = (data: SparklineData[]) => {
  const values = data.map((d) => d.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

export const getTrend = (data: SparklineData[]): "up" | "down" | "stable" => {
  if (data.length < 2) return "stable";

  const first = data[0].value;
  const last = data[data.length - 1].value;

  if (last > first) return "up";
  if (last < first) return "down";
  return "stable";
};

export const getTrendPercentage = (data: SparklineData[]): number => {
  if (data.length < 2) return 0;

  const first = data[0].value;
  const last = data[data.length - 1].value;

  if (first === 0) return last > 0 ? 100 : 0;
  return ((last - first) / first) * 100;
};

export const getColorValue = (color: string): string => {
  const colors: Record<string, string> = {
    default: "hsl(var(--primary))",
    primary: "hsl(var(--primary))",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  return colors[color] || color;
};

export const getPointPath = (x: number, y: number, radius: number): string => {
  return `M ${x - radius} ${y} A ${radius} ${radius} 0 1 0 ${
    x + radius
  } ${y} A ${radius} ${radius} 0 1 0 ${x - radius} ${y}`;
};
