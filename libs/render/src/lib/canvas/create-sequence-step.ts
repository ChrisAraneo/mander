import { reduce } from 'lodash-es';
import type { CanvasStep } from '../types/canvas-step';

export const createSequenceStep =
  (steps: readonly CanvasStep[]): CanvasStep =>
  (context) =>
    reduce(steps, (current, next) => next(current), context);
