// components/responsive-grid/responsive-grid-item.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ResponsiveGridItemProps } from "@/types/responsive-grid.types";

export function ResponsiveGridItem({
  children,
  index,
  onClick,
  className,
  animated = true,
  delay = 0,
}: ResponsiveGridItemProps) {
  if (!animated) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
          onClick && "hover:shadow-md",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * index }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}
