import { chain } from '@mander/utils';
import type { ColorStop } from './color-stop';
import { addStops } from './add-stops';

export const createRadialGradient = (
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
    .thru(addStops(stops))
    .value();
