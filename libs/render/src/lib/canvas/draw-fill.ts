import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawFill: CanvasStep = createActionStep((context) =>
  context.fill(),
);
