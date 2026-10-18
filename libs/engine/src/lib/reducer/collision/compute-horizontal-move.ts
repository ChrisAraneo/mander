import type { Level } from '@mander/model';
import { computeAxisMove } from './internal/compute-axis-move';
import { isOverlappingSolid } from './internal/is-overlapping-solid';
import type { AxisMove } from './types/axis-move';

export const computeHorizontalMove = (
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number,
): AxisMove =>
  computeAxisMove({
    origin: originX,
    delta,
    size: width,
    isColliding: (position) =>
      isOverlappingSolid(level, position, originY, width, height),
  });
