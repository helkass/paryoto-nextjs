// components/sankey/sankey-link.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SankeyLinkPath } from "@/types/sankey.types";
import { getBezierPath, getStraightPath } from "@/lib/sankey-layout";

interface SankeyLinkProps {
  link: SankeyLinkPath;
  index: number;
  variant: "default" | "curved" | "straight";
  showTooltip: boolean;
  interactive: boolean;
  animated: boolean;
  animationDuration: number;
  valueFormat?: (value: number) => string;
  className?: string;
  onLinkClick?: (link: SankeyLinkPath) => void;
  onLinkHover?: (link: SankeyLinkPath | null) => void;
}

export function SankeyLink({
  link,
  index,
  variant,
  showTooltip,
  interactive,
  animated,
  animationDuration,
  valueFormat,
  className,
  onLinkClick,
  onLinkHover,
}: SankeyLinkProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [sourceY, setSourceY] = React.useState(link.source.height / 2);
  const [targetY, setTargetY] = React.useState(link.target.height / 2);

  const getPath = (): string => {
    if (variant === "straight") {
      return getStraightPath(link.source, link.target, sourceY, targetY);
    }
    return getBezierPath(link.source, link.target, sourceY, targetY);
  };

  const path = getPath();
  const formattedValue = valueFormat
    ? valueFormat(link.value)
    : link.value.toLocaleString();

  const handleClick = () => {
    if (!interactive) return;
    onLinkClick?.(link);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    onLinkHover?.(link);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    onLinkHover?.(null);
  };

  const linkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: { duration: animationDuration / 1000, delay: index * 0.01 },
    },
    hover: {
      opacity: 0.9,
      strokeWidth: 3,
      transition: { duration: 0.2 },
    },
  };

  return (
    <g
      className={cn(interactive && "cursor-pointer", className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.path
        variants={linkVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : undefined}
        d={path}
        fill="none"
        stroke={link.color}
        strokeWidth={Math.max(1, Math.min(8, link.value / 100))}
        strokeLinecap="round"
        className="transition-all duration-200"
      />

      {/* Tooltip */}
      {showTooltip && interactive && isHovered && (
        <g>
          <rect
            x={link.source.x + (link.target.x - link.source.x) / 2 - 60}
            y={link.source.y + link.source.height / 2 - 25}
            width={120}
            height={50}
            rx={6}
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            className="shadow-lg"
          />
          <text
            x={link.source.x + (link.target.x - link.source.x) / 2}
            y={link.source.y + link.source.height / 2 - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold fill-foreground"
          >
            {link.label || "Flow"}
          </text>
          <text
            x={link.source.x + (link.target.x - link.source.x) / 2}
            y={link.source.y + link.source.height / 2 + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            Value: {formattedValue}
          </text>
        </g>
      )}
    </g>
  );
}
