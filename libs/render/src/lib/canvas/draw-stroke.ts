import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawStroke: CanvasStep = createActionStep((context) =>
  context.stroke(),
);
