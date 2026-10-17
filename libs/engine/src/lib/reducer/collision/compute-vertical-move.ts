import type { Level } from '@mander/model';
import { computeAxisMove } from './internal/compute-axis-move';
import { isOverlappingSolid } from './internal/is-overlapping-solid';
import type { AxisMove } from './types/axis-move';

export const computeVerticalMove = (
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number,
): AxisMove =>
  computeAxisMove({
    origin: originY,
    delta,
    size: height,
    isColliding: (position) =>
      isOverlappingSolid(level, originX, position, width, height),
  });
