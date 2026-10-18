import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createTranslateStep = (
  offsetX: number,
  offsetY: number,
): CanvasStep =>
  createActionStep((context) => context.translate(offsetX, offsetY));
