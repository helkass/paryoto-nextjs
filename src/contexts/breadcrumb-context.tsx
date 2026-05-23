// contexts/breadcrumb-context.tsx
"use client";

import * as React from "react";
import { BreadcrumbItem } from "@/types/breadcrumb.types";

interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeLastItem: () => void;
  reset: () => void;
}

const BreadcrumbContext = React.createContext<
  BreadcrumbContextType | undefined
>(undefined);

export function useBreadcrumb() {
  const context = React.useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
}

interface BreadcrumbProviderProps {
  children: React.ReactNode;
  initialItems?: BreadcrumbItem[];
}

export function BreadcrumbProvider({
  children,
  initialItems = [],
}: BreadcrumbProviderProps) {
  const [items, setItems] = React.useState<BreadcrumbItem[]>(initialItems);

  const addItem = React.useCallback((item: BreadcrumbItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeLastItem = React.useCallback(() => {
    setItems((prev) => prev.slice(0, -1));
  }, []);

  const reset = React.useCallback(() => {
    setItems([]);
  }, []);

  return (
    <BreadcrumbContext.Provider
      value={{
        items,
        setItems,
        addItem,
        removeLastItem,
        reset,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}
