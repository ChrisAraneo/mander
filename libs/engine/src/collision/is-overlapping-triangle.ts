import type { Triangle } from '@mander/model';
import { computeBoxCorners } from './internal/compute-box-corners';
import { isOverlappingOnAllAxes } from './internal/is-overlapping-on-all-axes';

export const isOverlappingTriangle = (
  triangle: Triangle,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  isOverlappingOnAllAxes(
    triangle,
    computeBoxCorners(boxLeft, boxTop, boxWidth, boxHeight),
  );
