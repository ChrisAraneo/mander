import type { Vec } from './types/vec';

export const computeBoxCorners = (
  left: number,
  top: number,
  width: number,
  height: number,
): Vec[] => [
  { x: left, y: top },
  { x: left + width, y: top },
  { x: left + width, y: top + height },
  { x: left, y: top + height },
];
