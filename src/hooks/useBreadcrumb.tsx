// hooks/useBreadcrumb.ts
"use client";

import { useBreadcrumb as useBreadcrumbContext } from "@/contexts/breadcrumb-context";
import { BreadcrumbItem } from "@/types/breadcrumb.types";

export function useBreadcrumb() {
  const { items, setItems, addItem, removeLastItem, reset } =
    useBreadcrumbContext();

  const updateItems = (newItems: BreadcrumbItem[]) => {
    setItems(newItems);
  };

  const push = (item: BreadcrumbItem) => {
    addItem(item);
  };

  const pop = () => {
    removeLastItem();
  };

  const clear = () => {
    reset();
  };

  return {
    items,
    updateItems,
    push,
    pop,
    reset: clear,
  };
}
