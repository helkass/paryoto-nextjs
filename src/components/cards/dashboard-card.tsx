import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function DashboardCard({
  title,
  description,
  action,
  children,
  className,
  fullWidth = false,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl p-6 transition-all duration-200",
        "shadow-dashboard dark:shadow-none dark:border dark:border-border",
        !fullWidth && "overflow-hidden",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          <div>
            {title && (
              <h3 className="text-base font-semibold tracking-tight text-foreground/90">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex items-center">{action}</div>}
        </div>
      )}

      <div className={cn("w-full", !fullWidth && "overflow-x-auto")}>
        {children}
      </div>
    </div>
  );
}
