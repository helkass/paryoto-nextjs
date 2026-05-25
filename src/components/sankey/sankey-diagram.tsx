// components/sankey/sankey-diagram.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SankeyNode } from "./sankey-node";
import { SankeyLink } from "./sankey-link";
import { SankeyDiagramProps } from "@/types/sankey.types";
import { computeSankeyLayout, getColorScheme } from "@/lib/sankey-layout";
import { Loader2 } from "lucide-react";

export function SankeyDiagram({
  data,
  width = 900,
  height = 500,
  variant = "default",
  nodeWidth = 24,
  nodePadding = 24,
  showLabels = true,
  showValues = true,
  showTooltip = true,
  showLegend = true,
  colorScheme = "default",
  nodeColors,
  linkColors,
  valueFormat = (val) => val.toLocaleString(),
  labelFormat,
  animated = true,
  animationDuration = 800,
  interactive = true,
  className,
  nodeClassName,
  linkClassName,
  labelClassName,
  title,
  description,
  loading = false,
}: SankeyDiagramProps) {
  const [mounted, setMounted] = React.useState(false);
  const [layout, setLayout] = React.useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (data.nodes.length > 0) {
      const computed = computeSankeyLayout(
        data,
        width,
        height,
        nodeWidth,
        nodePadding
      );

      // Apply colors
      computed.nodes.forEach((node, idx) => {
        if (nodeColors && nodeColors[node.id]) {
          node.color = nodeColors[node.id];
        } else {
          node.color = getColorScheme(colorScheme, idx, computed.nodes.length);
        }
      });

      computed.links.forEach((link, idx) => {
        if (linkColors && linkColors[`${link.source.id}-${link.target.id}`]) {
          link.color = linkColors[`${link.source.id}-${link.target.id}`];
        } else {
          link.color = "#9CA3AF";
        }
      });

      setLayout(computed);
    }
  }, [
    data,
    width,
    height,
    nodeWidth,
    nodePadding,
    colorScheme,
    nodeColors,
    linkColors,
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  if (!mounted || loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className
        )}
        style={{ width, height }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (layout.nodes.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20 text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        No data available
      </div>
    );
  }

  // Calculate total flow value for legend
  const totalFlow = layout.links.reduce((sum, link) => sum + link.value, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Diagram */}
      <div className="relative rounded-xl bg-gradient-to-br from-background to-muted/10 p-4 shadow-sm">
        <svg width={width} height={height} className="block overflow-visible">
          {/* Links (drawn first to be behind nodes) */}
          {layout.links.map((link, idx) => (
            <SankeyLink
              key={`link-${idx}`}
              link={link}
              index={idx}
              variant={variant}
              showTooltip={showTooltip}
              interactive={interactive}
              animated={animated}
              animationDuration={animationDuration}
              valueFormat={valueFormat}
              className={linkClassName}
            />
          ))}

          {/* Nodes */}
          {layout.nodes.map((node, idx) => (
            <SankeyNode
              key={node.id}
              node={node}
              index={idx}
              showLabels={showLabels}
              showValues={showValues}
              showTooltip={showTooltip}
              interactive={interactive}
              animated={animated}
              animationDuration={animationDuration}
              valueFormat={valueFormat}
              labelFormat={labelFormat}
              className={nodeClassName}
              labelClassName={labelClassName}
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4">
          {layout.nodes.slice(0, 6).map((node) => (
            <div key={node.id} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-xs text-muted-foreground">
                {labelFormat ? labelFormat(node.id) : node.id}
              </span>
            </div>
          ))}
          {layout.nodes.length > 6 && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-gray-400" />
              <span className="text-xs text-muted-foreground">
                +{layout.nodes.length - 6} more
              </span>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/30 p-3 text-center">
        <div>
          <div className="text-xs text-muted-foreground">Nodes</div>
          <div className="text-lg font-semibold">{layout.nodes.length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Connections</div>
          <div className="text-lg font-semibold">{layout.links.length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Total Flow</div>
          <div className="text-lg font-semibold">{valueFormat(totalFlow)}</div>
        </div>
      </div>
    </motion.div>
  );
}
