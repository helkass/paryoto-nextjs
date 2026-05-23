// components/empty-state/empty-state-illustration.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { EmptyStateIllustrationProps } from "@/types/empty-state.types";
import {
  Search,
  FolderOpen,
  AlertCircle,
  WifiOff,
  Package,
} from "lucide-react";

const illustrations = {
  search: Search,
  data: FolderOpen,
  error: AlertCircle,
  network: WifiOff,
  custom: Package,
};

export function EmptyStateIllustration({
  type = "data",
  className,
}: EmptyStateIllustrationProps) {
  const Icon = illustrations[type];

  return (
    <div className={cn("flex justify-center", className)}>
      <Icon className="h-12 w-12 text-muted-foreground/50" strokeWidth={1.5} />
    </div>
  );
}
