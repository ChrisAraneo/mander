export const clampIndex = (index: number, edge: number): number =>
  Math.min(Math.max(index, 0), edge);
