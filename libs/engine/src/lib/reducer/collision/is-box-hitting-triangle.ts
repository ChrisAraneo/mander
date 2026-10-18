import { chain, type Triangle } from '@mander/model';
import { every } from 'lodash-es';
import { computeBoxCorners } from './internal/compute-box-corners';
import { computeCandidateAxes } from './internal/compute-candidate-axes';
import { isOverlappingOnAxis } from './internal/is-overlapping-on-axis';

export const isBoxHittingTriangle = (
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
  triangle: Triangle,
): boolean =>
  chain(computeBoxCorners(boxLeft, boxTop, boxWidth, boxHeight))
    .thru((corners) =>
      every(computeCandidateAxes(triangle), (axis) =>
        isOverlappingOnAxis(axis, triangle, corners),
      ),
    )
    .value();
