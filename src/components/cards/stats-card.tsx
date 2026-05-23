// components/cards/stats-grid.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StatsGridProps } from "@/types/datacard.types";

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const variantStyles = {
  default: "bg-card border-border",
  glass:
    "bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20 dark:border-white/10",
  bordered: "bg-transparent border-2 border-border",
};

export function StatsCard({
  stats,
  columns = 4,
  variant = "default",
  className,
}: StatsGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid gap-4", columnClasses[columns], className)}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className={cn(
            "rounded-xl p-5 transition-all duration-300 cursor-pointer",
            variantStyles[variant],
            stat.onClick && "hover:shadow-lg"
          )}
          onClick={stat.onClick}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              {stat.trend && (
                <div className="flex items-center gap-1 mt-3">
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      stat.trend.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stat.trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(stat.trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              )}
            </div>
            {stat.icon && (
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                {stat.icon}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
