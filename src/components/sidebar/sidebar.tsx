// components/sidebar/sidebar.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarItem } from "./sidebar-item";
import { SidebarProvider } from "@/contexts/sidebar-context";
import {
  SidebarProps as SidebarPropsType,
  SidebarItem as SidebarItemType,
} from "@/types/sidebar.types";

type SidebarProps = Omit<SidebarPropsType, "header" | "footer"> & {
  header?:
    | React.ReactNode
    | (({ isOpen }: { isOpen: boolean }) => React.ReactNode);
  footer?:
    | React.ReactNode
    | (({ isOpen }: { isOpen: boolean }) => React.ReactNode);
};

const variantClasses = {
  default: "bg-background border-r border-border",
  floating: "bg-background rounded-r-xl shadow-lg m-2 h-[calc(100%-1rem)]",
  compact: "bg-background border-r border-border",
  mini: "bg-background border-r border-border",
};

export function Sidebar({
  items,
  isOpen: controlledOpen,
  onOpenChange,
  collapsible = true,
  defaultOpen = true,
  defaultOpenItems = [],
  hoverExpand = true,
  position = "left",
  variant = "default",
  width = 260,
  collapsedWidth = 80,
  className,
  header,
  footer,
  loading = false,
  onItemClick,
}: SidebarProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [hovered, setHovered] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string>();
  const [openSubmenus, setOpenSubmenus] = React.useState<Set<string>>(
    new Set(defaultOpenItems)
  );

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const isCollapsed = !isOpen;
  const isCompact = variant === "compact";
  const isMini = variant === "mini";
  const shouldShowText =
    isOpen || (hoverExpand && hovered) || (!isCollapsed && !isMini);

  React.useEffect(() => {
    // Set active item based on current path or first item
    if (items.length > 0 && !activeId) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleItemClick = (item: SidebarItemType) => {
    setActiveId(item.id);
    onItemClick?.(item);
  };

  const handleToggleSubmenu = (id: string) => {
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(id)) {
      newOpenSubmenus.delete(id);
    } else {
      newOpenSubmenus.add(id);
    }
    setOpenSubmenus(newOpenSubmenus);
  };

  const currentWidth = isCollapsed && !isMini ? collapsedWidth : width;

  if (loading) {
    return (
      <div
        className={cn(
          "flex h-full flex-col",
          variantClasses[variant],
          position === "left" ? "left-0" : "right-0",
          className
        )}
        style={{ width: currentWidth }}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex-1 space-y-2 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const sidebarWidth = isCollapsed && !isMini ? collapsedWidth : width;

  return (
    <SidebarProvider
      isOpen={isOpen}
      collapsed={isCollapsed}
      hoverExpand={hoverExpand}
      variant={variant}
      onItemClick={handleItemClick}
    >
      <div
        className={cn(
          "relative flex h-full flex-col transition-all duration-300",
          variantClasses[variant],
          position === "left" ? "left-0" : "right-0",
          className
        )}
        style={{ width: sidebarWidth }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header */}
        {header && (
          <div className="shrink-0 border-b p-4">
            {typeof header === "function"
              ? header({ isOpen: shouldShowText })
              : header}
          </div>
        )}

        {/* Toggle Button */}
        {collapsible && !isMini && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute -right-3 top-4 h-6 w-6 rounded-full border shadow-sm",
              "bg-background p-0"
            )}
            onClick={handleToggle}
          >
            {isOpen ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}

        {/* Navigation Items */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isOpen={shouldShowText}
                activeId={activeId}
                collapsed={isCollapsed}
                onItemClick={handleItemClick}
                onToggleSubmenu={handleToggleSubmenu}
                openSubmenus={openSubmenus}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t p-4">
            {typeof footer === "function"
              ? footer({ isOpen: shouldShowText })
              : footer}
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}

export { SidebarItem } from "./sidebar-item";
