import { type Triangle } from '@mander/model';
import { every } from 'lodash-es';
import { computeBoxCorners } from './internal/compute-box-corners';
import { computeCandidateAxes } from './internal/compute-candidate-axes';
import { isOverlappingOnAxis } from './internal/is-overlapping-on-axis';
import type { Vec } from './internal/types/vec';

const isOverlappingOnAllAxes = (
  triangle: Triangle,
  corners: readonly Vec[],
): boolean =>
  every(computeCandidateAxes(triangle), (axis) =>
    isOverlappingOnAxis(axis, triangle, corners),
  );

export const isBoxHittingTriangle = (
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
  triangle: Triangle,
): boolean =>
  isOverlappingOnAllAxes(
    triangle,
    computeBoxCorners(boxLeft, boxTop, boxWidth, boxHeight),
  );
