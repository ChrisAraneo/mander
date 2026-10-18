import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createScaleStep = (
  horizontal: number,
  vertical: number,
): CanvasStep =>
  createActionStep((context) => context.scale(horizontal, vertical));
