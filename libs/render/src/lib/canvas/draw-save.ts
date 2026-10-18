import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawSave: CanvasStep = createActionStep((context) =>
  context.save(),
);
