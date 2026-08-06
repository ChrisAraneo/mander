import { chain } from 'lodash-es';

import type { ColorStop } from './color-stop';
import { withStops } from './with-stops';

export const radialGradient = (
  context: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
  stops: readonly ColorStop[],
): CanvasGradient =>
  chain(context.createRadialGradient(x0, y0, r0, x1, y1, r1))
    .thru(withStops(stops))
    .value();
