import type { Level } from '@mander/model';

import type { AxisMove } from './types/axis-move';
import { overlapsSolid } from './overlaps-solid';
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
    collides: (position) =>
      overlapsSolid(level, originX, position, width, height),
  });
