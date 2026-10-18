import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawClip: CanvasStep = createActionStep((context) =>
  context.clip(),
);
