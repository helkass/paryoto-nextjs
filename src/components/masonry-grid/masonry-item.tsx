// components/masonry-grid/masonry-item.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MasonryItemProps } from "@/types/masonry-grid.types";

export function MasonryItem({
  children,
  index,
  width,
  onClick,
  className,
  animated = true,
  delay = 0,
}: MasonryItemProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [height, setHeight] = React.useState("auto");

  // Handle image loading for better masonry layout
  React.useEffect(() => {
    const imgElements = document.querySelectorAll(`.masonry-item-${index} img`);
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === imgElements.length) {
        setImageLoaded(true);
      }
    };

    imgElements.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded);
        img.addEventListener("error", checkAllLoaded);
      }
    });

    return () => {
      imgElements.forEach((img) => {
        img.removeEventListener("load", checkAllLoaded);
        img.removeEventListener("error", checkAllLoaded);
      });
    };
  }, [index, children]);

  if (!animated) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg",
          onClick && "cursor-pointer",
          className
        )}
        style={{ width: `${width}%` }}
      >
        <div className={cn("masonry-item", `masonry-item-${index}`)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * index }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      style={{ width: `${width}%` }}
    >
      <div className={cn("masonry-item", `masonry-item-${index}`)}>
        {children}
      </div>
    </motion.div>
  );
}
