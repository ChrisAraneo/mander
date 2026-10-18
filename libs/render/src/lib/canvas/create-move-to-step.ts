import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createMoveToStep = (pixelX: number, pixelY: number): CanvasStep =>
  createActionStep((context) => context.moveTo(pixelX, pixelY));
