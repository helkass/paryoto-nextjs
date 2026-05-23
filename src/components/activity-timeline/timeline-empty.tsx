// components/activity-timeline/timeline-empty.tsx
"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface TimelineEmptyProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
}

export function TimelineEmpty({
  message = "No activities found",
  icon,
  className,
}: TimelineEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {icon || <Inbox className="h-12 w-12 text-muted-foreground mb-4" />}
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
