import type { Triangle } from '@mander/utils';
import { computeProjectedSpan } from './compute-projected-span';
import { isSpanSeparated } from './is-span-separated';
import type { Axis } from './types/axis';
import type { Vec } from './types/vec';

export const isOverlappingOnAxis = (
  axis: Axis,
  triangle: Triangle,
  corners: readonly Vec[],
): boolean =>
  !isSpanSeparated(
    computeProjectedSpan(axis, triangle),
    computeProjectedSpan(axis, corners),
  );
