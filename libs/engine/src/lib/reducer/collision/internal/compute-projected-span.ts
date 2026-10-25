import { defaultTo, map, max, min } from 'lodash-es';
import { pipe } from 'remeda';
import type { Axis } from './types/axis';
import type { Span } from './types/span';
import type { Vec } from './types/vec';

export const computeProjectedSpan = (
  axis: Axis,
  points: readonly Vec[],
): Span =>
  pipe(
    points,
    (corners) =>
      map(corners, (point) => point.x * axis.normalX + point.y * axis.normalY),
    (values) => ({
      min: defaultTo(min(values), Infinity),
      max: defaultTo(max(values), -Infinity),
    }),
  );
