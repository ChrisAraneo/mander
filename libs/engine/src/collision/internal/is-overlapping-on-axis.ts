import type { Point, Triangle } from '@mander/model';
import { computeProjectedSpan } from './compute-projected-span';
import { isSpanSeparated } from './is-span-separated';
import type { Axis } from './types/axis';

export const isOverlappingOnAxis = (
  axis: Axis,
  triangle: Triangle,
  corners: readonly Point[],
): boolean =>
  !isSpanSeparated(
    computeProjectedSpan(axis, triangle),
    computeProjectedSpan(axis, corners),
  );
