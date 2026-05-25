// lib/waterfall-utils.ts
import { WaterfallData } from "@/types/waterfall-chart.types";

export const calculateCumulative = (data: WaterfallData[]): number[] => {
  const cumulative: number[] = [];
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].isTotal) {
      cumulative.push(sum);
    } else {
      cumulative.push(sum);
      sum += data[i].value;
    }
  }

  return cumulative;
};

export const getBarColor = (
  item: WaterfallData,
  positiveColor: string,
  negativeColor: string,
  totalColor: string,
  customColors?: Record<string, string>
): string => {
  if (item.isTotal) return totalColor;
  if (customColors?.[item.label]) return customColors[item.label];
  return item.value >= 0 ? positiveColor : negativeColor;
};

export const getTotalValue = (data: WaterfallData[]): number => {
  let total = 0;
  for (const item of data) {
    if (!item.isTotal) {
      total += item.value;
    }
  }
  return total;
};

export const getMinValue = (
  cumulative: number[],
  data: WaterfallData[]
): number => {
  const values = [...cumulative];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].isTotal) {
      values.push(cumulative[i] + data[i].value);
    }
  }
  return Math.min(...values, 0);
};

export const getMaxValue = (
  cumulative: number[],
  data: WaterfallData[]
): number => {
  const values = [...cumulative];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].isTotal) {
      values.push(cumulative[i] + data[i].value);
    }
  }
  return Math.max(...values, 0);
};

export const getChartRange = (
  minValue: number,
  maxValue: number
): { min: number; max: number } => {
  const padding = (maxValue - minValue) * 0.1;
  return {
    min: minValue - padding,
    max: maxValue + padding,
  };
};
