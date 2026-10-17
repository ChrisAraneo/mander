import { chain } from '@mander/utils';
import { defaultTo, map, max, min } from 'lodash-es';
import type { Axis } from './types/axis';
import type { Span } from './types/span';
import type { Vec } from './types/vec';

export const computeProjectedSpan = (
  axis: Axis,
  points: readonly Vec[],
): Span =>
  chain(points)
    .thru((corners) =>
      map(corners, (point) => point.x * axis.normalX + point.y * axis.normalY),
    )
    .thru((values) => ({
      min: defaultTo(min(values), Infinity),
      max: defaultTo(max(values), -Infinity),
    }))
    .value();
