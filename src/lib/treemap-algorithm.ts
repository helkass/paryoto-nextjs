// lib/treemap-algorithm.ts
import { TreeNode, TreeMapCell } from "@/types/treemap.types";

interface LayoutArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Calculate total value of a node
export const getNodeValue = (node: TreeNode): number => {
  if (node.value !== undefined) return node.value;
  if (node.children) {
    return node.children.reduce((sum, child) => sum + getNodeValue(child), 0);
  }
  return 0;
};

// Squarified treemap algorithm
export const computeSquarifiedLayout = (
  node: TreeNode,
  area: LayoutArea,
  depth: number = 0,
  path: string[] = []
): TreeMapCell[] => {
  const cells: TreeMapCell[] = [];
  const totalValue = getNodeValue(node);

  if (totalValue === 0 || !node.children || node.children.length === 0) {
    cells.push({
      node,
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      depth,
      path: [...path, node.name],
    });
    return cells;
  }

  // Sort children by value (descending) for better aspect ratios
  const sortedChildren = [...node.children].sort(
    (a, b) => getNodeValue(b) - getNodeValue(a)
  );

  const layout = squarify(
    sortedChildren.map((child) => getNodeValue(child)),
    area.x,
    area.y,
    area.width,
    area.height
  );

  for (let i = 0; i < sortedChildren.length; i++) {
    const child = sortedChildren[i];
    const childArea = layout[i];
    const childCells = computeSquarifiedLayout(child, childArea, depth + 1, [
      ...path,
      node.name,
    ]);
    cells.push(...childCells);
  }

  return cells;
};

// Squarify algorithm implementation
const squarify = (
  values: number[],
  x: number,
  y: number,
  width: number,
  height: number
): LayoutArea[] => {
  const total = values.reduce((sum, val) => sum + val, 0);
  const areas: LayoutArea[] = [];

  if (total === 0) return areas;

  // Determine orientation (row or column)
  const isHorizontal = width >= height;

  let currentX = x;
  let currentY = y;
  let remainingWidth = width;
  let remainingHeight = height;
  let remainingTotal = total;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const ratio = value / remainingTotal;

    if (isHorizontal) {
      const cellWidth = remainingWidth * ratio;
      areas.push({
        x: currentX,
        y: currentY,
        width: cellWidth,
        height: remainingHeight,
      });
      currentX += cellWidth;
      remainingWidth -= cellWidth;
    } else {
      const cellHeight = remainingHeight * ratio;
      areas.push({
        x: currentX,
        y: currentY,
        width: remainingWidth,
        height: cellHeight,
      });
      currentY += cellHeight;
      remainingHeight -= cellHeight;
    }

    remainingTotal -= value;
  }

  return areas;
};

// Simple slice layout (horizontal strips)
export const computeSliceLayout = (
  node: TreeNode,
  area: LayoutArea,
  depth: number = 0,
  path: string[] = []
): TreeMapCell[] => {
  const cells: TreeMapCell[] = [];
  const totalValue = getNodeValue(node);

  if (totalValue === 0 || !node.children || node.children.length === 0) {
    cells.push({
      node,
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      depth,
      path: [...path, node.name],
    });
    return cells;
  }

  let currentY = area.y;
  const sortedChildren = [...node.children].sort(
    (a, b) => getNodeValue(b) - getNodeValue(a)
  );

  for (const child of sortedChildren) {
    const childValue = getNodeValue(child);
    const childHeight = area.height * (childValue / totalValue);

    const childCells = computeSliceLayout(
      child,
      {
        x: area.x,
        y: currentY,
        width: area.width,
        height: childHeight,
      },
      depth + 1,
      [...path, node.name]
    );
    cells.push(...childCells);
    currentY += childHeight;
  }

  return cells;
};

// Dice layout (vertical strips)
export const computeDiceLayout = (
  node: TreeNode,
  area: LayoutArea,
  depth: number = 0,
  path: string[] = []
): TreeMapCell[] => {
  const cells: TreeMapCell[] = [];
  const totalValue = getNodeValue(node);

  if (totalValue === 0 || !node.children || node.children.length === 0) {
    cells.push({
      node,
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      depth,
      path: [...path, node.name],
    });
    return cells;
  }

  let currentX = area.x;
  const sortedChildren = [...node.children].sort(
    (a, b) => getNodeValue(b) - getNodeValue(a)
  );

  for (const child of sortedChildren) {
    const childValue = getNodeValue(child);
    const childWidth = area.width * (childValue / totalValue);

    const childCells = computeDiceLayout(
      child,
      {
        x: currentX,
        y: area.y,
        width: childWidth,
        height: area.height,
      },
      depth + 1,
      [...path, node.name]
    );
    cells.push(...childCells);
    currentX += childWidth;
  }

  return cells;
};

// Slice-dice layout (alternating)
export const computeSliceDiceLayout = (
  node: TreeNode,
  area: LayoutArea,
  depth: number = 0,
  path: string[] = []
): TreeMapCell[] => {
  const cells: TreeMapCell[] = [];
  const totalValue = getNodeValue(node);

  if (totalValue === 0 || !node.children || node.children.length === 0) {
    cells.push({
      node,
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      depth,
      path: [...path, node.name],
    });
    return cells;
  }

  // Alternate between slice and dice based on depth
  const useSlice = depth % 2 === 0;
  const sortedChildren = [...node.children].sort(
    (a, b) => getNodeValue(b) - getNodeValue(a)
  );

  if (useSlice) {
    let currentY = area.y;
    for (const child of sortedChildren) {
      const childValue = getNodeValue(child);
      const childHeight = area.height * (childValue / totalValue);

      const childCells = computeSliceDiceLayout(
        child,
        {
          x: area.x,
          y: currentY,
          width: area.width,
          height: childHeight,
        },
        depth + 1,
        [...path, node.name]
      );
      cells.push(...childCells);
      currentY += childHeight;
    }
  } else {
    let currentX = area.x;
    for (const child of sortedChildren) {
      const childValue = getNodeValue(child);
      const childWidth = area.width * (childValue / totalValue);

      const childCells = computeSliceDiceLayout(
        child,
        {
          x: currentX,
          y: area.y,
          width: childWidth,
          height: area.height,
        },
        depth + 1,
        [...path, node.name]
      );
      cells.push(...childCells);
      currentX += childWidth;
    }
  }

  return cells;
};
