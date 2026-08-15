import { reduce } from 'lodash-es';

import type { CanvasStep } from './canvas-step';

export const sequence =
  (steps: readonly CanvasStep[]): CanvasStep =>
  (context) =>
    reduce(steps, (current, next) => next(current), context);
