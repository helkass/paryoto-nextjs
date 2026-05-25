// components/treemap/treemap.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TreeMapLegend } from "./treemap-legend";
import { TreeMapProps, TreeNode, TreeMapCell } from "@/types/treemap.types";
import {
  computeSquarifiedLayout,
  computeSliceLayout,
  computeDiceLayout,
  computeSliceDiceLayout,
  getNodeValue,
} from "@/lib/treemap-algorithm";
import { Loader2 } from "lucide-react";

const colorSchemes = {
  default: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
  green: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
  blue: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
  purple: ["#8B5CF6", "#A855F7", "#C084FC", "#D8B4FE", "#E9D5FF"],
  red: ["#EF4444", "#F87171", "#FCA5A5", "#FECACA", "#FEE2E2"],
};

export function TreeMap({
  data,
  width = 800,
  height = 500,
  variant = "squarified",
  colorScheme = "default",
  customColors,
  showLabels = true,
  showValues = true,
  showTooltip = true,
  showLegend = true,
  title,
  description,
  valueFormat = (val) => val.toLocaleString(),
  labelFormat,
  interactive = true,
  loading = false,
  className,
  cellClassName,
  onCellClick,
  onCellHover,
}: TreeMapProps) {
  const [mounted, setMounted] = React.useState(false);
  const [hoveredCell, setHoveredCell] = React.useState<TreeMapCell | null>(
    null
  );
  const [cells, setCells] = React.useState<TreeMapCell[]>([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!data) return;

    let computedCells: TreeMapCell[] = [];

    switch (variant) {
      case "slice":
        computedCells = computeSliceLayout(data, { x: 0, y: 0, width, height });
        break;
      case "dice":
        computedCells = computeDiceLayout(data, { x: 0, y: 0, width, height });
        break;
      case "slice-dice":
        computedCells = computeSliceDiceLayout(data, {
          x: 0,
          y: 0,
          width,
          height,
        });
        break;
      default:
        computedCells = computeSquarifiedLayout(data, {
          x: 0,
          y: 0,
          width,
          height,
        });
    }

    setCells(computedCells);
  }, [data, width, height, variant]);

  const getColorForNode = (node: TreeNode, depth: number): string => {
    if (node.color) return node.color;

    let colors: string[];
    if (customColors) {
      colors = customColors;
    } else if (colorScheme in colorSchemes) {
      colors = colorSchemes[colorScheme as keyof typeof colorSchemes];
    } else {
      colors = colorSchemes["default"];
    }
    const index = depth % colors.length;
    return colors[index];
  };

  const getDisplayLabel = (node: TreeNode, value: number): string => {
    if (labelFormat) return labelFormat(node.name, value);
    if (showValues) return `${node.name}\n${valueFormat(value)}`;
    return node.name;
  };

  const getLegendItems = () => {
    const rootValue = getNodeValue(data);
    const items: Array<{ name: string; color: string; value: number }> = [];

    if (data.children) {
      for (const child of data.children) {
        items.push({
          name: child.name,
          color: getColorForNode(child, 0),
          value: getNodeValue(child),
        });
      }
    }

    return items;
  };

  const handleCellClick = (cell: TreeMapCell) => {
    if (!interactive) return;
    onCellClick?.(cell.node, cell.path);
  };

  const handleCellHover = (cell: TreeMapCell | null) => {
    if (!interactive) return;
    setHoveredCell(cell);
    onCellHover?.(cell?.node || null, cell?.path || []);
  };

  if (!mounted) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ width, height }}
      >
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ width, height }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const legendItems = getLegendItems();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Treemap Container */}
      <div
        className="relative overflow-hidden rounded-lg border bg-muted/10"
        style={{ width, height }}
      >
        <svg width={width} height={height} className="block">
          {cells.map((cell, index) => {
            const color = getColorForNode(cell.node, cell.depth);
            const value = getNodeValue(cell.node);
            const label = getDisplayLabel(cell.node, value);
            const isTooSmall = cell.width < 40 || cell.height < 30;

            return (
              <g key={index}>
                <motion.rect
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.001 }}
                  x={cell.x}
                  y={cell.y}
                  width={cell.width}
                  height={cell.height}
                  fill={color}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={1}
                  className={cn(
                    "transition-all duration-200",
                    interactive && "cursor-pointer hover:brightness-95",
                    cellClassName
                  )}
                  onClick={() => handleCellClick(cell)}
                  onMouseEnter={() => handleCellHover(cell)}
                  onMouseLeave={() => handleCellHover(null)}
                />

                {/* Label */}
                {showLabels && !isTooSmall && (
                  <text
                    x={cell.x + 4}
                    y={cell.y + 16}
                    fontSize={Math.min(12, Math.max(8, cell.width / 15))}
                    fill="white"
                    className="select-none"
                    style={{ textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}
                  >
                    <tspan x={cell.x + 4} dy="0">
                      {label.split("\n")[0]}
                    </tspan>
                    {showValues && label.split("\n")[1] && (
                      <tspan
                        x={cell.x + 4}
                        dy={cell.height < 40 ? 12 : 16}
                        fontSize={Math.min(10, Math.max(7, cell.width / 18))}
                      >
                        {label.split("\n")[1]}
                      </tspan>
                    )}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {showTooltip && interactive && hoveredCell && (
          <div
            className="pointer-events-none absolute z-10 rounded-md bg-popover px-3 py-2 text-sm shadow-md"
            style={{
              left: Math.min(
                hoveredCell.x + hoveredCell.width / 2,
                width - 150
              ),
              top: Math.max(hoveredCell.y - 40, 10),
            }}
          >
            <div className="font-medium">{hoveredCell.node.name}</div>
            <div className="text-xs text-muted-foreground">
              Value: {valueFormat(getNodeValue(hoveredCell.node))}
            </div>
            {hoveredCell.node.metadata && (
              <div className="mt-1 text-xs text-muted-foreground">
                {Object.entries(hoveredCell.node.metadata).map(([key, val]) => (
                  <div key={key}>
                    {key}: {String(val)}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-1 text-xs text-muted-foreground">
              Path: {hoveredCell.path.join(" > ")}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && legendItems.length > 0 && (
        <TreeMapLegend items={legendItems} valueFormat={valueFormat} />
      )}
    </div>
  );
}
