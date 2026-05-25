// lib/sankey-layout.ts
import {
  SankeyData,
  SankeyNode,
  SankeyLink,
  SankeyNodePosition,
  SankeyLinkPath,
} from "@/types/sankey.types";

interface LayoutNode extends SankeyNode {
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  value: number;
  sourceLinks?: LayoutLink[];
  targetLinks?: LayoutLink[];
}

interface LayoutLink {
  id: string;
  source: LayoutNode;
  target: LayoutNode;
  value: number;
  color?: string;
  label?: string;
  sy0?: number;
  sy1?: number;
  ty0?: number;
  ty1?: number;
}

export const computeSankeyLayout = (
  data: SankeyData,
  width: number,
  height: number,
  nodeWidth: number = 24,
  nodePadding: number = 24
): { nodes: SankeyNodePosition[]; links: SankeyLinkPath[] } => {
  // Build graph
  const nodes: LayoutNode[] = data.nodes.map((node) => ({
    ...node,
    value: node.value || 0,
    sourceLinks: [],
    targetLinks: [],
  }));

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const links: LayoutLink[] = data.links.map((link) => {
    const source = nodeMap.get(link.source.toString());
    const target = nodeMap.get(link.target.toString());
    if (!source || !target) throw new Error("Invalid link");

    const layoutLink: LayoutLink = {
      id: `${link.source}-${link.target}`,
      ...link,
      source,
      target,
      value: link.value,
    };

    source.sourceLinks!.push(layoutLink);
    target.targetLinks!.push(layoutLink);
    source.value += link.value;
    target.value += link.value;

    return layoutLink;
  });

  // Sort nodes by value
  nodes.sort((a, b) => b.value - a.value);

  // Assign columns (simple layering)
  const columns: LayoutNode[][] = [];
  const nodeColumn = new Map<LayoutNode, number>();

  // Find sources (nodes with no incoming links)
  let currentNodes = nodes.filter((n) => n.targetLinks!.length === 0);
  let column = 0;

  while (currentNodes.length > 0) {
    columns[column] = currentNodes;
    currentNodes.forEach((n) => nodeColumn.set(n, column));

    const nextNodes: LayoutNode[] = [];
    currentNodes.forEach((n) => {
      n.sourceLinks!.forEach((link) => {
        if (!nextNodes.includes(link.target)) {
          nextNodes.push(link.target);
        }
      });
    });

    currentNodes = nextNodes;
    column++;
  }

  // Assign x positions
  const columnCount = columns.length;
  const columnWidth = (width - nodeWidth) / (columnCount - 1);

  nodes.forEach((node) => {
    const col = nodeColumn.get(node)!;
    node.x0 = col * columnWidth;
    node.x1 = node.x0! + nodeWidth;
  });

  // Assign y positions (initial)
  const columnHeights = columns.map(() => 0);
  const columnNodeHeights: number[][] = columns.map(() => []);

  nodes.forEach((node) => {
    const col = nodeColumn.get(node)!;
    node.y0 = columnHeights[col];
    node.y1 = node.y0! + (node.value / 100) * height;
    columnHeights[col] = node.y1! + nodePadding;
    columnNodeHeights[col].push(node.y1!);
  });

  // Normalize heights
  columns.forEach((colNodes, col) => {
    const totalHeight = colNodes.reduce((sum, n) => sum + (n.y1! - n.y0!), 0);
    const scale = (height - nodePadding * (colNodes.length - 1)) / totalHeight;
    let currentY = 0;

    colNodes.forEach((node) => {
      const nodeHeight = (node.y1! - node.y0!) * scale;
      node.y0 = currentY;
      node.y1 = currentY + nodeHeight;
      currentY = nodeHeight + nodePadding;
    });
  });

  // Create result nodes
  const resultNodes: SankeyNodePosition[] = nodes.map((node) => ({
    id: node.id,
    x: node.x0!,
    y: node.y0!,
    width: nodeWidth,
    height: node.y1! - node.y0!,
    value: node.value,
    color: node.color || "#3B82F6",
  }));

  // Create result links with bezier paths
  const resultLinks: SankeyLinkPath[] = links.map((link) => {
    const source = resultNodes.find((n) => n.id === link.source.id)!;
    const target = resultNodes.find((n) => n.id === link.target.id)!;

    return {
      source,
      target,
      value: link.value,
      color: link.color || "#9CA3AF",
      label: link.label,
    };
  });

  return { nodes: resultNodes, links: resultLinks };
};

export const getBezierPath = (
  source: SankeyNodePosition,
  target: SankeyNodePosition,
  sourceY: number,
  targetY: number
): string => {
  const startX = source.x + source.width;
  const startY = source.y + sourceY;
  const endX = target.x;
  const endY = target.y + targetY;
  const cp1x = startX + (endX - startX) * 0.5;
  const cp1y = startY;
  const cp2x = endX - (endX - startX) * 0.5;
  const cp2y = endY;

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
};

export const getStraightPath = (
  source: SankeyNodePosition,
  target: SankeyNodePosition,
  sourceY: number,
  targetY: number
): string => {
  const startX = source.x + source.width;
  const startY = source.y + sourceY;
  const endX = target.x;
  const endY = target.y + targetY;

  return `M ${startX} ${startY} L ${endX} ${endY}`;
};

export const getColorScheme = (
  scheme: string,
  index: number,
  total: number
): string => {
  type SchemeKey =
    | "default"
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "rainbow";
  const schemes: Record<SchemeKey, string[]> = {
    default: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
    blue: ["#1E3A8A", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA"],
    green: ["#064E3B", "#047857", "#10B981", "#34D399", "#6EE7B7"],
    purple: ["#4C1D95", "#6D28D9", "#8B5CF6", "#A855F7", "#C084FC"],
    orange: ["#7C2D12", "#9A3412", "#EA580C", "#F97316", "#FB923C"],
    rainbow: ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"],
  };

  const schemeKey = (scheme in schemes ? scheme : "default") as SchemeKey;
  const colors = schemes[schemeKey];
  return colors[index % colors.length];
};
