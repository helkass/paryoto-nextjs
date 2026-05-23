// components/breadcrumb/breadcrumb.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { BreadcrumbItemComponent } from "./breadcrumb-item";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { BreadcrumbProps, BreadcrumbItem } from "@/types/breadcrumb.types";

// Default route mapping
const defaultRouteMapping: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  products: "Products",
  orders: "Orders",
  settings: "Settings",
  profile: "Profile",
  analytics: "Analytics",
  reports: "Reports",
  invoices: "Invoices",
  messages: "Messages",
  notifications: "Notifications",
  calendar: "Calendar",
  tasks: "Tasks",
  files: "Files",
  teams: "Teams",
  projects: "Projects",
  documents: "Documents",
};

function BreadcrumbInner({
  items: externalItems,
  dynamic = true,
  separator = "/",
  showHome = true,
  homeLabel = "Home",
  homeIcon = <Home className="h-4 w-4" />,
  maxItems = 5,
  truncateLabels = true,
  className,
  itemClassName,
  customMapping = {},
  onItemClick,
}: BreadcrumbProps) {
  const pathname = usePathname();
  // Generate breadcrumb items from pathname
  const internalItems = React.useMemo<BreadcrumbItem[]>(() => {
    if (!dynamic) return [];

    const paths = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    if (showHome) {
      items.push({
        label: homeLabel,
        href: "/",
        icon: homeIcon,
      });
    }

    let currentPath = "";
    const mapping = {
      ...defaultRouteMapping,
      ...customMapping,
    };

    paths.forEach((path, index) => {
      currentPath += `/${path}`;

      const isLast = index === paths.length - 1;

      // Try mapping first
      let label =
        mapping[path] ||
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

      // Dynamic route handling
      if (path.startsWith("[") && path.endsWith("]")) {
        label = path.slice(1, -1).charAt(0).toUpperCase() + path.slice(2, -1);
      }

      items.push({
        label,
        href: isLast ? undefined : currentPath,
        isCurrent: isLast,
      });
    });

    return items;
  }, [pathname, dynamic, showHome, homeLabel, homeIcon, customMapping]);

  // Use external items if provided, otherwise use generated items
  const displayItems = externalItems || internalItems;

  // Apply max items limit with ellipsis
  const getDisplayItems = (): BreadcrumbItem[] => {
    if (displayItems.length <= maxItems) return displayItems;

    const firstItems = displayItems.slice(0, 2);
    const lastItems = displayItems.slice(-(maxItems - 2));

    return [
      ...firstItems,
      {
        label: "...",
        href: undefined,
        isCurrent: false,
      },
      ...lastItems,
    ];
  };

  const finalItems = getDisplayItems();

  if (finalItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {finalItems.map((item, index) => (
          <BreadcrumbItemComponent
            key={index}
            item={item}
            index={index}
            isLast={index === finalItems.length - 1}
            separator={separator}
            onItemClick={onItemClick}
            className={cn(
              truncateLabels && "max-w-[200px] truncate",
              itemClassName
            )}
          />
        ))}
      </ol>
    </nav>
  );
}

export function Breadcrumb(props: BreadcrumbProps) {
  return (
    <BreadcrumbProvider>
      <BreadcrumbInner {...props} />
    </BreadcrumbProvider>
  );
}
