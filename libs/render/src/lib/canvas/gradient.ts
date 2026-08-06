import { chain, reduce } from 'lodash-es';
import { tap } from 'ramda';

export type ColorStop = readonly [number, string];

const withStops =
  (stops: readonly ColorStop[]) =>
  (gradient: CanvasGradient): CanvasGradient =>
    reduce(
      stops,
      (current, [offset, color]) =>
        tap((target: CanvasGradient) => target.addColorStop(offset, color))(
          current,
        ),
      gradient,
    );

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
