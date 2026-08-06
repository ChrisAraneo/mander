import { reduce, tap } from 'lodash-es';

import type { ColorStop } from './color-stop';

export const withStops =
  (stops: readonly ColorStop[]) =>
  (gradient: CanvasGradient): CanvasGradient =>
    reduce(
      stops,
      (current, [offset, color]) =>
        tap(current, (target) => target.addColorStop(offset, color)),
      gradient,
    );
