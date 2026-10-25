import { match } from 'ts-pattern';
import { isOverlappingSolid } from './is-overlapping-solid';
import type { Sweep } from './types/sweep';

export const isSweepColliding = (
  { axis, level, originX, originY, width, height }: Sweep,
  position: number,
): boolean =>
  match(axis)
    .with('HORIZONTAL', () =>
      isOverlappingSolid(level, position, originY, width, height),
    )
    .with('VERTICAL', () =>
      isOverlappingSolid(level, originX, position, width, height),
    )
    .exhaustive();
