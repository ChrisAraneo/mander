import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const drawRestore: CanvasStep = createActionStep((context) =>
  context.restore(),
);
