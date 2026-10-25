import { type Triangle } from '@mander/model';
import { every } from 'lodash-es';
import { computeCandidateAxes } from './compute-candidate-axes';
import { isOverlappingOnAxis } from './is-overlapping-on-axis';
import type { Vec } from './types/vec';

export const isOverlappingOnAllAxes = (
  triangle: Triangle,
  corners: readonly Vec[],
): boolean =>
  every(computeCandidateAxes(triangle), (axis) =>
    isOverlappingOnAxis(axis, triangle, corners),
  );
