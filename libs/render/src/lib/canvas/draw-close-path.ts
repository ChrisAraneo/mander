import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawClosePath: CanvasStep = createActionStep((context) =>
  context.closePath(),
);
