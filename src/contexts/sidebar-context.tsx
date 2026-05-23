// contexts/sidebar-context.tsx
"use client";

import * as React from "react";
import { SidebarContextType } from "@/types/sidebar.types";

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  isOpen: boolean;
  collapsed: boolean;
  hoverExpand: boolean;
  variant: SidebarContextType["variant"];
  onItemClick: (item: any) => void;
}

export function SidebarProvider({
  children,
  isOpen,
  collapsed,
  hoverExpand,
  variant,
  onItemClick,
}: SidebarProviderProps) {
  const value = {
    isOpen,
    collapsed,
    hoverExpand,
    variant,
    onItemClick,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
