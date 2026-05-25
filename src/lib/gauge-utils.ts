// lib/gauge-utils.ts
export const getDefaultSegments = (variant: string) => {
  switch (variant) {
    case "success":
      return [
        { start: 0, end: 33, color: "#EF4444", label: "Poor" },
        { start: 33, end: 66, color: "#F59E0B", label: "Average" },
        { start: 66, end: 100, color: "#10B981", label: "Good" },
      ];
    case "warning":
      return [
        { start: 0, end: 50, color: "#10B981", label: "Good" },
        { start: 50, end: 75, color: "#F59E0B", label: "Warning" },
        { start: 75, end: 100, color: "#EF4444", label: "Critical" },
      ];
    case "danger":
      return [
        { start: 0, end: 60, color: "#10B981", label: "Safe" },
        { start: 60, end: 80, color: "#F59E0B", label: "Caution" },
        { start: 80, end: 100, color: "#EF4444", label: "Danger" },
      ];
    default:
      return [
        { start: 0, end: 33, color: "#3B82F6", label: "Low" },
        { start: 33, end: 66, color: "#8B5CF6", label: "Medium" },
        { start: 66, end: 100, color: "#EC4899", label: "High" },
      ];
  }
};

export const getThresholdColor = (
  value: number,
  thresholds: { low: number; medium: number; high: number }
) => {
  if (value >= thresholds.high) return "#EF4444";
  if (value >= thresholds.medium) return "#F59E0B";
  return "#10B981";
};

export const getNeedleRotation = (
  value: number,
  min: number,
  max: number
): number => {
  const angleRange = 180;
  const valueRange = max - min;
  const percentage = (value - min) / valueRange;
  return -90 + percentage * angleRange;
};

export const formatDefaultValue = (value: number): string => {
  return value.toLocaleString();
};
