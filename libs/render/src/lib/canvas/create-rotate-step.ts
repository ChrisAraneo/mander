import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createRotateStep = (angle: number): CanvasStep =>
  createActionStep((context) => context.rotate(angle));
