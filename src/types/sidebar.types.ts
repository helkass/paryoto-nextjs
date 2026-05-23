// types/sidebar.types.ts
import { ReactNode } from "react";

export type SidebarItem = {
  id: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  badge?: string | number;
  badgeColor?: "default" | "primary" | "success" | "warning" | "danger";
  disabled?: boolean;
} & (
  | {
      title: string;
      divider?: false;
    }
  | {
      title?: string;
      divider: true;
    }
);

export interface SidebarProps {
  // Core
  items: SidebarItem[];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;

  // Behavior
  collapsible?: boolean;
  defaultOpen?: boolean;
  defaultOpenItems?: string[];
  hoverExpand?: boolean;

  // Position & Variant
  position?: "left" | "right";
  variant?: "default" | "floating" | "compact" | "mini";

  // Width
  width?: number;
  collapsedWidth?: number;

  // Styling
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;

  // State
  loading?: boolean;

  // Callbacks
  onItemClick?: (item: SidebarItem) => void;
}

export interface SidebarItemProps {
  item: SidebarItem;
  depth?: number;
  isOpen: boolean;
  activeId?: string;
  collapsed?: boolean;
  onItemClick: (item: SidebarItem) => void;
  onToggleSubmenu: (id: string) => void;
  openSubmenus: Set<string>;
}

export interface SidebarContextType {
  isOpen: boolean;
  collapsed: boolean;
  hoverExpand: boolean;
  variant: "default" | "floating" | "compact" | "mini";
  onItemClick: (item: SidebarItem) => void;
}
