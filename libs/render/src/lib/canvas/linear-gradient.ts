import { chain } from '@mander/utils';
import type { ColorStop } from './color-stop';
import { withStops } from './with-stops';

export const linearGradient = (
  context: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: readonly ColorStop[],
): CanvasGradient =>
  chain(context.createLinearGradient(x0, y0, x1, y1))
    .thru(withStops(stops))
    .value();
