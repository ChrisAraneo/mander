import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createFillRectStep = (
  pixelX: number,
  pixelY: number,
  width: number,
  height: number,
): CanvasStep =>
  createActionStep((context) =>
    context.fillRect(pixelX, pixelY, width, height),
  );
