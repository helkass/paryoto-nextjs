// components/navbar/mobile-menu.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarItem } from "@/types/navbar.types";
import { useNavbar } from "@/contexts/navbar-context";

interface MobileMenuProps {
  items: NavbarItem[];
  onItemClick?: (item: NavbarItem) => void;
  className?: string;
}

export function MobileMenu({ items, onItemClick, className }: MobileMenuProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavbar();
  const [openSubmenus, setOpenSubmenus] = React.useState<Set<string>>(
    new Set()
  );

  const toggleSubmenu = (id: string) => {
    const newOpen = new Set(openSubmenus);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenSubmenus(newOpen);
  };

  const handleItemClick = (item: NavbarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onItemClick?.(item);
    if (!item.children) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderMenuItem = (item: NavbarItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSubmenus.has(item.id);

    return (
      <div key={item.id} className="w-full">
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-4 py-2 transition-colors hover:bg-muted cursor-pointer",
            depth > 0 && "ml-4"
          )}
          onClick={() =>
            hasChildren ? toggleSubmenu(item.id) : handleItemClick(item)
          }
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="text-muted-foreground">{item.icon}</span>
            )}
            <span>{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-90"
              )}
            />
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("border-t bg-background", className)}
        >
          <div className="space-y-1 p-4">
            {items.map((item) => renderMenuItem(item))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
