import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createRoundRectStep = (
  pixelX: number,
  pixelY: number,
  width: number,
  height: number,
  radius: number,
): CanvasStep =>
  createActionStep((context) =>
    context.roundRect(pixelX, pixelY, width, height, radius),
  );
