import { floor } from 'lodash-es';
import { TILE_SIZE, type Level } from '@mander/generator';
import type { AxisMove } from './axis-move';
import { EPSILON, SUBSTEP } from './internal-constants';
import { overlapsSolid } from './overlaps-solid';

export function moveVertical(
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number
): AxisMove {
  let current = originY;
  let remaining = delta;
  const direction = Math.sign(delta);
  while (remaining !== 0) {
    const step = direction * Math.min(Math.abs(remaining), SUBSTEP);
    const nextPosition = current + step;
    if (overlapsSolid(level, originX, nextPosition, width, height)) {
      const position =
        direction > 0
          ? floor((nextPosition + height - EPSILON) / TILE_SIZE) * TILE_SIZE - height
          : (floor(nextPosition / TILE_SIZE) + 1) * TILE_SIZE;
      return { position, isBlocked: true };
    }
    current = nextPosition;
    remaining -= step;
  }
  return { position: current, isBlocked: false };
}
