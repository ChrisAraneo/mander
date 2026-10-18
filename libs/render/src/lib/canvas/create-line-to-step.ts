import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createLineToStep = (pixelX: number, pixelY: number): CanvasStep =>
  createActionStep((context) => context.lineTo(pixelX, pixelY));
