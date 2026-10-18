import { reduce, tap } from 'lodash-es';
import type { ColorStop } from '../types/color-stop';

export const addStops =
  (
    stops: readonly ColorStop[],
  ): ((gradient: CanvasGradient) => CanvasGradient) =>
  (gradient) =>
    reduce(
      stops,
      (current, [offset, color]) =>
        tap(current, (target) => target.addColorStop(offset, color)),
      gradient,
    );
