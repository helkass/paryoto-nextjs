// components/banner/banner-stack.tsx
"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Banner } from "./banner";
import { BannerStackProps, BannerItem } from "@/types/banner.types";

export function BannerStack({
  banners,
  onDismiss,
  position = "top",
  className,
}: BannerStackProps) {
  const isFixed = position === "fixed-top" || position === "fixed-bottom";
  const isTop = position === "top" || position === "fixed-top";

  const stackPosition = isFixed ? position : "relative";

  return (
    <div
      className={cn(
        "z-50",
        stackPosition === "fixed-top" && "fixed top-0 left-0 right-0",
        stackPosition === "fixed-bottom" && "fixed bottom-0 left-0 right-0",
        stackPosition === "relative" && "relative",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          isTop ? "space-y-0" : "space-y-0 flex-col-reverse"
        )}
      >
        <AnimatePresence mode="popLayout">
          {banners.map((banner) => (
            <Banner
              key={banner.id}
              {...banner}
              position="top"
              onDismiss={() => onDismiss(banner.id)}
              animated
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
