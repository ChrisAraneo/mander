import type { Point, Triangle } from '@mander/model';
import { every } from 'lodash-es';
import { computeCandidateAxes } from './compute-candidate-axes';
import { isOverlappingOnAxis } from './is-overlapping-on-axis';

export const isOverlappingOnAllAxes = (
  triangle: Triangle,
  corners: readonly Point[],
): boolean =>
  every(computeCandidateAxes(triangle), (axis) =>
    isOverlappingOnAxis(axis, triangle, corners),
  );
