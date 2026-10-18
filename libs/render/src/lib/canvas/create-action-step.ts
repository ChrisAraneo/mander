import { tap } from 'lodash-es';
import type { CanvasStep } from '../types/canvas-step';

export const createActionStep =
  (action: (context: CanvasRenderingContext2D) => unknown): CanvasStep =>
  (context) =>
    tap(context, action);
