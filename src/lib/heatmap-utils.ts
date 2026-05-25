// lib/heatmap-utils.ts
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subWeeks,
  addWeeks,
} from "date-fns";
import { id } from "date-fns/locale";
import { HeatmapData } from "@/types/heatmap.types";

export const getColorSchemes = () => ({
  default: [
    "#E2E8F0",
    "#BFDBFE",
    "#93C5FD",
    "#60A5FA",
    "#3B82F6",
    "#2563EB",
    "#1D4ED8",
  ],
  green: [
    "#E2E8F0",
    "#D1FAE5",
    "#A7F3D0",
    "#6EE7B7",
    "#34D399",
    "#10B981",
    "#059669",
  ],
  blue: [
    "#E2E8F0",
    "#DBEAFE",
    "#BFDBFE",
    "#93C5FD",
    "#60A5FA",
    "#3B82F6",
    "#2563EB",
  ],
  purple: [
    "#E2E8F0",
    "#F3E8FF",
    "#E9D5FF",
    "#D8B4FE",
    "#C084FC",
    "#A855F7",
    "#9333EA",
  ],
  red: [
    "#E2E8F0",
    "#FEE2E2",
    "#FECACA",
    "#FCA5A5",
    "#F87171",
    "#EF4444",
    "#DC2626",
  ],
});

export const getColorForValue = (
  value: number,
  minValue: number,
  maxValue: number,
  colors: string[]
): string => {
  if (value === 0 || minValue === maxValue) return colors[0];

  const percentage = (value - minValue) / (maxValue - minValue);
  const index = Math.min(
    Math.floor(percentage * (colors.length - 1)),
    colors.length - 1
  );
  return colors[index];
};

export const generateWeekDays = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const getWeeksRange = (startDate: Date, endDate: Date): Date[] => {
  const weeks: Date[] = [];
  let current = startOfWeek(startDate, { weekStartsOn: 1 });
  const end = endOfWeek(endDate, { weekStartsOn: 1 });

  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }

  return weeks;
};

export const getWeekdays = (): string[] => {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
};

export const getMonths = (
  startDate: Date,
  endDate: Date
): { month: string; weeks: number }[] => {
  const weeks = getWeeksRange(startDate, endDate);
  const months: { month: string; weeks: number }[] = [];
  let currentMonth = "";
  let monthCount = 0;

  weeks.forEach((week, index) => {
    const monthName = format(week, "MMM", { locale: id });
    if (monthName !== currentMonth) {
      if (currentMonth) {
        months.push({ month: currentMonth, weeks: monthCount });
      }
      currentMonth = monthName;
      monthCount = 1;
    } else {
      monthCount++;
    }

    if (index === weeks.length - 1) {
      months.push({ month: currentMonth, weeks: monthCount });
    }
  });

  return months;
};

export const getDayValue = (date: Date, data: HeatmapData[]): number => {
  const found = data.find((d) => isSameDay(new Date(d.date), date));
  return found?.value || 0;
};

export const getDayMetadata = (
  date: Date,
  data: HeatmapData[]
): Record<string, any> | undefined => {
  const found = data.find((d) => isSameDay(new Date(d.date), date));
  return found?.metadata;
};
