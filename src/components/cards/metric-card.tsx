"use client";

import { DataCard } from "./data-card";
import { MetricCardProps } from "@/types/datacard.types";

export function MetricCard({
  target,
  targetLabel = "Target",
  formatValue,
  ...props
}: MetricCardProps) {
  const formattedValue =
    props.value !== undefined && formatValue
      ? formatValue(Number(props.value))
      : props.value;

  const progress =
    target !== undefined && props.value !== undefined
      ? {
          value: Math.round((Number(props.value) / target) * 100),
          label: targetLabel,
        }
      : undefined;

  return <DataCard {...props} value={formattedValue} progress={progress} />;
}
