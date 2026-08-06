import { tap } from 'lodash-es';

import type { CanvasStep } from './canvas-step';

export const run =
  (action: (context: CanvasRenderingContext2D) => unknown): CanvasStep =>
  (context) =>
    tap(context, action);
