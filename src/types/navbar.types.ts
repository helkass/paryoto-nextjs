// types/navbar.types.ts
import { ReactNode } from "react";

export interface NavbarItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
  children?: NavbarItem[];
  badge?: string | number;
  badgeColor?: "default" | "primary" | "success" | "warning" | "danger";
}

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  divider?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  timestamp: string | Date;
  read: boolean;
  href?: string;
  onClick?: () => void;
}

export interface NavbarProps {
  // Core
  brand?: {
    title: string;
    logo?: ReactNode;
    href?: string;
  };
  items?: NavbarItem[];

  // User
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    menuItems?: UserMenuItem[];
  };

  // Notifications
  notifications?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAllAsRead?: () => void;

  // Search
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;

  // Theme
  showThemeToggle?: boolean;

  // Behavior
  sticky?: boolean;
  transparent?: boolean;
  mobileBreakpoint?: number;

  // Actions
  actions?: ReactNode;

  // Styling
  className?: string;
  brandClassName?: string;
  menuClassName?: string;

  // Callbacks
  onMenuClick?: (item: NavbarItem) => void;
  onUserMenuClick?: (item: UserMenuItem) => void;
  onThemeToggle?: () => void;
}
