import type { Level } from '@mander/generator';
import type { AxisMove } from './axis-move';
import { overlapsSolid } from './overlaps-solid';
import { sweep } from './sweep';

export const moveHorizontal = (
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number
): AxisMove =>
  sweep({
    origin: originX,
    delta,
    size: width,
    collides: (position) => overlapsSolid(level, position, originY, width, height),
  });
