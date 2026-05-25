export const getDefaultRanges = (max: number) => ({
  poor: max * 0.3,
  average: max * 0.6,
  good: max * 0.8,
  excellent: max,
});

type ColorScheme = "default" | "blue" | "green" | "purple" | "orange" | "red";

type SchemeColors = {
  poor: string;
  average: string;
  good: string;
  excellent: string;
  target: string;
  actual: string;
};

export const getDefaultColors = (colorScheme: string): SchemeColors => {
  const schemes: Record<ColorScheme, SchemeColors> = {
    default: {
      poor: "#EF4444",
      average: "#F59E0B",
      good: "#3B82F6",
      excellent: "#10B981",
      target: "#1F2937",
      actual: "#1F2937",
    },
    blue: {
      poor: "#BFDBFE",
      average: "#93C5FD",
      good: "#60A5FA",
      excellent: "#3B82F6",
      target: "#1E3A8A",
      actual: "#1E3A8A",
    },
    green: {
      poor: "#A7F3D0",
      average: "#6EE7B7",
      good: "#34D399",
      excellent: "#10B981",
      target: "#064E3B",
      actual: "#064E3B",
    },
    purple: {
      poor: "#E9D5FF",
      average: "#D8B4FE",
      good: "#C084FC",
      excellent: "#A855F7",
      target: "#4C1D95",
      actual: "#4C1D95",
    },
    orange: {
      poor: "#FED7AA",
      average: "#FDBA74",
      good: "#FB923C",
      excellent: "#F97316",
      target: "#7C2D12",
      actual: "#7C2D12",
    },
    red: {
      poor: "#FECACA",
      average: "#FCA5A5",
      good: "#F87171",
      excellent: "#EF4444",
      target: "#7F1D1D",
      actual: "#7F1D1D",
    },
  };

  return schemes[colorScheme as ColorScheme] || schemes.default;
};

export const getPercentage = (
  value: number,
  min: number,
  max: number
): number => {
  return ((value - min) / (max - min)) * 100;
};

export const getAchievement = (value: number, target: number): number => {
  if (target === 0) return 0;
  return (value / target) * 100;
};

export const getStatus = (
  value: number,
  target: number
): "excellent" | "good" | "average" | "poor" => {
  const ratio = value / target;
  if (ratio >= 1.2) return "excellent";
  if (ratio >= 1) return "good";
  if (ratio >= 0.8) return "average";
  return "poor";
};
