import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createRectStep = (
  pixelX: number,
  pixelY: number,
  width: number,
  height: number,
): CanvasStep =>
  createActionStep((context) => context.rect(pixelX, pixelY, width, height));
