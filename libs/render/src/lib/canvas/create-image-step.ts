import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createImageStep = (
  image: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number,
): CanvasStep =>
  createActionStep((context) => context.drawImage(image, x, y, width, height));
