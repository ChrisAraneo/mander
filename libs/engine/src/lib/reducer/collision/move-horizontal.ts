import type { Level } from '@mander/model';

import type { AxisMove } from './types/axis-move';
import { isOverlappingSolid } from './is-overlapping-solid';
import { sweep } from './sweep';

export const moveHorizontal = (
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number,
): AxisMove =>
  sweep({
    origin: originX,
    delta,
    size: width,
    isColliding: (position) =>
      isOverlappingSolid(level, position, originY, width, height),
  });
