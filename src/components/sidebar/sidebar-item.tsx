// components/sidebar/sidebar-item.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItemProps } from "@/types/sidebar.types";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const badgeColors = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function SidebarItem({
  item,
  depth = 0,
  isOpen,
  activeId,
  collapsed = false,
  onItemClick,
  onToggleSubmenu,
  openSubmenus,
}: SidebarItemProps) {
  const pathname = usePathname();
  const { variant, hoverExpand } = useSidebar();
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = openSubmenus.has(item.id);
  const isActive =
    activeId === item.id || (item.href && pathname === item.href);
  const isMini = variant === "mini";
  const showTooltip = (collapsed && !hoverExpand) || isMini;

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) return;

    if (hasChildren) {
      onToggleSubmenu(item.id);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      onItemClick(item);
    }
  };

  const renderContent = () => (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
        "hover:bg-muted cursor-pointer",
        isActive && "bg-primary/10 text-primary font-medium",
        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        (collapsed || isMini) && "px-2",
        (collapsed && !(hoverExpand && isOpen)) || isMini
          ? "justify-center"
          : "",
        depth > 0 && "ml-4"
      )}
      onClick={handleClick}
    >
      {item.icon && (
        <span className={cn("shrink-0", (collapsed || isMini) && "h-5 w-5")}>
          {item.icon}
        </span>
      )}

      {(!collapsed || (hoverExpand && isOpen)) && !isMini && (
        <span className="flex-1 truncate">{item.title}</span>
      )}

      {hasChildren && (!collapsed || (hoverExpand && isOpen)) && !isMini && (
        <span className="shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      )}

      {item.badge && (!collapsed || (hoverExpand && isOpen)) && !isMini && (
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium",
            badgeColors[item.badgeColor || "default"]
          )}
        >
          {item.badge}
        </span>
      )}
    </div>
  );

  const ItemWrapper = ({ children }: { children: React.ReactNode }) => {
    if (showTooltip) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="w-full">
      <ItemWrapper>
        {item.href && !hasChildren ? (
          <Link href={item.disabled ? "#" : item.href} className="block">
            {renderContent()}
          </Link>
        ) : (
          renderContent()
        )}
      </ItemWrapper>

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              depth={depth + 1}
              isOpen={isOpen}
              activeId={activeId}
              collapsed={collapsed}
              onItemClick={onItemClick}
              onToggleSubmenu={onToggleSubmenu}
              openSubmenus={openSubmenus}
            />
          ))}
        </div>
      )}

      {item.divider && <div className="my-2 h-px bg-border" />}
    </div>
  );
}
