// components/breadcrumb/breadcrumb-item.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BreadcrumbItem as BreadcrumbItemType } from "@/types/breadcrumb.types";

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  index: number;
  isLast: boolean;
  separator?: React.ReactNode;
  onItemClick?: (item: BreadcrumbItemType, index: number) => void;
  className?: string;
}

export function BreadcrumbItemComponent({
  item,
  index,
  isLast,
  separator,
  onItemClick,
  className,
}: BreadcrumbItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (item.isCurrent || !item.href) {
      e.preventDefault();
    }
    onItemClick?.(item, index);
  };

  const content = (
    <div className="flex items-center gap-2">
      {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
      <span
        className={cn(
          "text-sm transition-colors",
          item.isCurrent
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground",
          !item.href && "cursor-default"
        )}
      >
        {item.label}
      </span>
    </div>
  );

  return (
    <li className="flex items-center gap-2">
      {item.href && !item.isCurrent ? (
        <Link
          href={item.href}
          onClick={handleClick}
          className={cn("flex items-center", className)}
        >
          {content}
        </Link>
      ) : (
        <div className={cn("flex items-center", className)}>{content}</div>
      )}
      {!isLast && separator && (
        <span className="text-muted-foreground">{separator}</span>
      )}
    </li>
  );
}
