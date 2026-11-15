import type { Point } from '@mander/model';

export const computeBoxCorners = (
  left: number,
  top: number,
  width: number,
  height: number,
): Point[] => [
  { x: left, y: top },
  { x: left + width, y: top },
  { x: left + width, y: top + height },
  { x: left, y: top + height },
];
