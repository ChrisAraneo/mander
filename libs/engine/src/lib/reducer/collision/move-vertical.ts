import type { Level } from '@mander/model';

import type { AxisMove } from './types/axis-move';
import { isOverlappingSolid } from './is-overlapping-solid';
import { sweep } from './sweep';

export const moveVertical = (
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number,
): AxisMove =>
  sweep({
    origin: originY,
    delta,
    size: height,
    isColliding: (position) =>
      isOverlappingSolid(level, originX, position, width, height),
  });
