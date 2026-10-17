import type { Triangle } from '@mander/utils';
import { map, range } from 'lodash-es';
import type { Axis } from './types/axis';

const TRIANGLE_CORNERS = 3;

export const computeEdgeAxes = (triangle: Triangle): Axis[] =>
  map(range(TRIANGLE_CORNERS), (edge) => ({
    normalX: triangle[edge].y - triangle[(edge + 1) % TRIANGLE_CORNERS].y,
    normalY: triangle[(edge + 1) % TRIANGLE_CORNERS].x - triangle[edge].x,
  }));
