import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawBeginPath: CanvasStep = createActionStep((context) =>
  context.beginPath(),
);
